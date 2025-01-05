"use client"

import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import '@/assets/styles/fullCalendarCustom.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import jaLocale from '@fullcalendar/core/locales/ja';
import { EventClickArg, EventContentArg, EventInput } from '@fullcalendar/core/index.js';

import { useNotificationMessageStore } from '@/store/notificationMessageStore';
import { commonConst } from '@/consts/commonConst';
import { pageCommonConst } from '@/consts/pageCommonConst';
import utils from '@/assets/js/utils';
import { GetApplicationListByMonthRequest, GetApplicationListByMonthResponse, getApplicationListByMonth } from '@/api/getApplicationListByMonth';

export default function DashboardCalendarView() {
  const router = useRouter();

  // 共通Store
  const { setNotificationMessageObject } = useNotificationMessageStore();
  const [calendarInitialDate, setCalendarInitialDate] = useState();
  const calendarRef = useRef<FullCalendar>(null!);
  const [eventContent, setEventContent] = useState<EventInput[]>([]);

  useEffect(() =>{
    if(!utils.getSessionStorage('calendarInitialDate')) {
      utils.setSessionStorage('calendarInitialDate', new Date());
    }

    setCalendarInitialDate(utils.getSessionStorage('calendarInitialDate'))
  }, [])

  useEffect(() =>{
    (async() => {
      setCalendarEvents();
    })()
  }, [calendarInitialDate])

  /**
   * イベント取得およびセット
   * @returns 
   */
  const setCalendarEvents = async() => {
    if(!calendarRef.current) {
      return;
    }

    const req: GetApplicationListByMonthRequest = {
      startStr: `${calendarRef.current.getApi().view.activeStart.toLocaleDateString('sv-SE')} 00:00:00.000`,
      endStr: `${calendarRef.current.getApi().view.activeEnd.toLocaleDateString('sv-SE')} 23:59:59.999`,
    }

    const res: GetApplicationListByMonthResponse = await getApplicationListByMonth(req);
    if(res.responseResult) {
      setEventContent(getEventContent(res));
    } else {
      setNotificationMessageObject({
        errorMessageList: res.message ? [res.message] : [],
        inputErrorMessageList: [],
      })
    }
  }

  /**
   * イベント表示のためのオブジェクト取得
   * @param res 
   * @returns 
   */
  const getEventContent = (res: GetApplicationListByMonthResponse) => {
    let eventInputs: EventInput[] = [];
    for (let index = 0; index < res.applicationListByMonth.length; index++) {
      const item = res.applicationListByMonth[index];
      let color = 'rgba(0,0,0,0)';
      if(item.action === commonConst.actionValue.draft) {
        // 下書き
        color = commonConst.statusColorCode.draft;
      } else if(item.action === commonConst.actionValue.panding) {
        // 承認待ち
        color = commonConst.statusColorCode.panding;
      } else if(item.action === commonConst.actionValue.complete) {
        // 完了
        color = commonConst.statusColorCode.complete;
      } else if(item.action === commonConst.actionValue.reject) {
        // 差戻
        color = commonConst.statusColorCode.reject;
      }

      const event: EventInput = {
        title: "",
        // start: `${item.sStartDate} ${item.sStartTime}`,
        // end: `${item.sEndDate} ${item.sEndTime}`,
        start: `${item.startDate}`,
        end: `${item.endDate}`,
        extendedProps: {
          'id': item.id,
          'sClassification': item.sClassification,
          'sStartTime': item.sStartTime,
          'sEndTime': item.sEndTime,
          'sAction': item.sAction,
          'sType': item.sType,
        },
        // display: 'background',
        textColor: '#333333',
        color: color,
        className: 'event-contents'
      }

      eventInputs.push(event);
    }

    return eventInputs;
  }

  /**
   * イベント情報描画
   * @param eventContent 
   * @returns 
   */
  const renderEventContent = (eventContent: EventContentArg) => (
    <>
      <div className="calendar-event-content pc-only">
        <b>{eventContent.event.extendedProps.sAction}</b><br></br>
        <i>{eventContent.event.extendedProps.sType}</i><br></br>
        <i>{eventContent.event.extendedProps.sStartTime}～{eventContent.event.extendedProps.sEndTime}</i>
      </div>
      <div className="calendar-event-content sp-only">
        <b className="">{eventContent.event.extendedProps.sAction}</b>
      </div>
    </>
  );

  /**
   * 編集ボタン押下
   * @param id 
   */
  const onEdit = (eventArg: EventClickArg) => {
    router.push(`${pageCommonConst.path.application}?${pageCommonConst.param.applicationId}=${eventArg.event.extendedProps.id}&${pageCommonConst.param.ref}=${pageCommonConst.path.dashboard}`, {scroll: true});
  };

  /**
   * 日付押下
   * @param eventArg 
   */
  const onDateClick = (eventArg: DateClickArg) => {
    if(eventArg.dayEl.querySelectorAll('.event-contents').length) {
      return;
    }

    router.push(`${pageCommonConst.path.applicationNew}?${pageCommonConst.param.selectDate}=${eventArg.dateStr}`, {scroll: true});
  };

  /**
   * 前月ボタン押下
   */
  const gotoPrevMonth = useCallback(() => {
    const calendarApi = calendarRef.current.getApi();
    const currentDate = calendarApi.getDate();
    currentDate.setMonth(currentDate.getMonth() - 1);
    calendarApi.gotoDate(currentDate);
    utils.setSessionStorage('calendarInitialDate', currentDate);

    setCalendarEvents();
  }, []);

  /**
   * 翌月ボタン押下
   */
  const gotoNextMonth = useCallback(() => {
    const calendarApi = calendarRef.current.getApi();
    const currentDate = calendarApi.getDate();
    currentDate.setMonth(currentDate.getMonth() + 1);
    calendarApi.gotoDate(currentDate);
    utils.setSessionStorage('calendarInitialDate', currentDate);

    setCalendarEvents();
  }, []);

  /**
   * 今日ボタン押下
   */
  const gotoToday = useCallback(() => {
    const calendarApi = calendarRef.current.getApi();
    const currentDate = new Date();
    calendarApi.gotoDate(currentDate);
    utils.setSessionStorage('calendarInitialDate', currentDate);

    setCalendarEvents();
  }, []);

  const createCalendar = () => {
    if(calendarInitialDate) {
      return (
        <>
          <FullCalendar
            ref={calendarRef}
            plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
            locale={jaLocale}
            timeZone='Asia/Tokyo'
            aspectRatio={1.5}
            contentHeight='auto'
            businessHours={{ daysOfWeek: [1, 2, 3, 4, 5] }}
            customButtons={{
              prevButton: {
                  text: '＜',
                  click: () => {
                    gotoPrevMonth();
                  },
              },
              nextButton: {
                text: '＞',
                click: () => {
                  gotoNextMonth();
                },
              },
              todayButton: {
                text: '今日',
                click: () => {
                  gotoToday();
                },
              },
            }}
            // headerToolbar={{ start: 'prev,next,today', center: 'title', end: 'dayGridMonth,dayGridWeek,timeGridDay'}}
            // headerToolbar={{ start: 'prevButton,nextButton todayButton', center: 'title', end: 'dayGridMonth,dayGridWeek,timeGridDay'}}
            headerToolbar={{ start: 'title', center: '', end: 'prevButton,todayButton,nextButton'}}
            // dayHeaderFormat={{weekday: 'short'}}
            navLinks={false}
            initialView="dayGridMonth"
            initialDate={calendarInitialDate}
            dayCellContent={(e) => e.dayNumberText = e.dayNumberText.replace('日', '')}
            eventDisplay={'block'}
            events={ eventContent }
            eventContent={renderEventContent}
            eventClick={(e) => onEdit(e)}
            dateClick={(e) => onDateClick(e)}
            rerenderDelay={200}
            // eventTimeFormat={{
              // hour: '2-digit',
              // minute: '2-digit',
              // second: '2-digit',
              // meridiem: false,
            // }}
          />
        </>
      )
    }
  }

  return (
    <>
      <div>
        {createCalendar()}
      </div>
    </>
  )
};
