"use client"

import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import jaLocale from '@fullcalendar/core/locales/ja';
import { EventClickArg, EventContentArg, EventInput } from '@fullcalendar/core/index.js';
import utils from '@/assets/js/utils';

import { GetApplicationListByMonthRequest, GetApplicationListByMonthResponse, getApplicationListByMonth } from '@/api/getApplicationListByMonth';
import { useCommonStore } from '@/app/store/CommonStore';

export default function DashboardCalendarView() {
  const router = useRouter();
  const [calendarInitialDate, setCalendarInitialDate] = useState();
  const calendarRef = useRef<FullCalendar>(null!);

  // 共通Sore
  const { setCommonObject, getCommonObject } = useCommonStore();

  useEffect(() =>{
    if(!utils.getSessionStorage('calendarInitialDate')) {
      utils.setSessionStorage('calendarInitialDate', new Date());
    }

    setCalendarInitialDate(utils.getSessionStorage('calendarInitialDate'))
  }, [])

  /**
   * 申請情報取得
   * @param info 
   * @param successCallback 
   */
  const getMonthApplications = async(info: any, successCallback: any, failureCallback:any) => {
    // console.log(info)
    // var sHh = ("00" + (info.start.getHours())).slice(-2);
    // var sMm = ("00" + (info.start.getMinutes())).slice(-2);
    // var sSs = ("00" + (info.start.getSeconds())).slice(-2);
    // var sSss = ("000" + (info.start.getTime())).slice(-3);
    // var eHh = ("00" + (info.end.getHours())).slice(-2);
    // var eMm = ("00" + (info.end.getMinutes())).slice(-2);
    // var eSs = ("00" + (info.end.getSeconds())).slice(-2);
    // var eSss = ("000" + (info.end.getTime())).slice(-3);
    const req: GetApplicationListByMonthRequest = {
      // startStr: `${sDate} ${sHh}:${sMm}:${sSs}.${sSss}`,
      // endStr: `${eDate} ${eHh}:${eMm}:${eSs}.${eSss}`,
      startStr: `${info.start.toLocaleDateString('sv-SE')} 00:00:00.000`,
      endStr: `${info.end.toLocaleDateString('sv-SE')} 23:59:59.999`,
    }

    let eventInputs: EventInput[] = [];
    const res: GetApplicationListByMonthResponse = await getApplicationListByMonth(req);
    if(!res.responseResult) {
      failureCallback();
      return;
    }

    for (let index = 0; index < res.applicationListByMonth.length; index++) {
      const item = res.applicationListByMonth[index];
      let color = 'rgba(0,0,0,0)';
      if(item.action === 0) {
        // 下書き
        color = '#99ccff';
      } else if(item.action === 1) {
        // 承認待ち
        color = '#ffcc66';
      } else if(item.action === 3) {
        // 完了
        color = '#99cc99';
      } else if(item.action === 4) {
        // 差戻
        color = '#ff9999';
      }

      const event: EventInput = {
        title: "",
        // start: `${item.sStartDate} ${item.sStartTime}`,
        // end: `${item.sEndDate} ${item.sEndTime}`,
        start: `${item.sStartDate}`,
        end: `${item.sEndDate}`,
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

    successCallback(eventInputs);
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
    router.push(`/application/edit/${eventArg.event.extendedProps.id}`, {scroll: true});
  };

  /**
   * 日付押下
   * @param eventArg 
   */
  const onDateClick = (eventArg: DateClickArg) => {
    if(eventArg.dayEl.querySelectorAll('.event-contents').length) {
      return;
    }

    router.push(`/application/edit?selectDate=${eventArg.dateStr}`, {scroll: true});
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
  }, []);

  /**
   * 今日ボタン押下
   */
  const gotoToday = useCallback(() => {
    const calendarApi = calendarRef.current.getApi();
    const currentDate = new Date();
    calendarApi.gotoDate(currentDate);
    utils.setSessionStorage('calendarInitialDate', currentDate);
  }, []);

  const createCalendar = () => {
    if(calendarInitialDate) {
      return (
        <>
          <FullCalendar
            ref={calendarRef}
            plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
            locale={jaLocale}
            timeZone='UTC'
            aspectRatio={1.5}
            contentHeight='auto'
            businessHours={{ daysOfWeek: [1, 2, 3, 4, 5] }}
            customButtons={{
              prevButton: {
                  text: '前月',
                  click: () => {
                    gotoPrevMonth();
                  },
              },
              nextButton: {
                text: '翌月',
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
            headerToolbar={{ start: 'todayButton', center: 'title', end: 'prevButton,nextButton'}}
            // dayHeaderFormat={{weekday: 'short'}}
            navLinks={false}
            initialView="dayGridMonth"
            initialDate={calendarInitialDate}
            dayCellContent={(e) => e.dayNumberText = e.dayNumberText.replace('日', '')}
            eventDisplay={'block'}
            events={(fetchInfo, successCallback, failureCallback) => getMonthApplications(fetchInfo, successCallback, failureCallback)}
            eventContent={renderEventContent}
            eventClick={(e) => onEdit(e)}
            dateClick={(e) => onDateClick(e)}
            rerenderDelay={50}
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
