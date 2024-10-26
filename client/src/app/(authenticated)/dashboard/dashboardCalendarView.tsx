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

export default function DashboardCalendarView() {
  const router = useRouter();
  const [calendarInitialDate, setCalendarInitialDate] = useState();
  const calendarRef = useRef<FullCalendar>(null!);

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
  const getMonthApplications = async(info: any, successCallback: any) => {
    const req: GetApplicationListByMonthRequest = {
      startStr: info.startStr,
      endStr: info.endStr,
    }

    const res: GetApplicationListByMonthResponse[] = await getApplicationListByMonth(req);

    let eventInputs: EventInput[] = [];
    for (let index = 0; index < res.length; index++) {
      const item = res[index];
      let color = '';
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
        // 却下
        color = '#ff9999';
      }

      const event: EventInput = {
        title: `${item.sType}`,
        start: `${item.sStartDate} ${item.sStartTime}`,
        end: `${item.sEndDate} ${item.sEndTime}`,
        // allDay: true,
        extendedProps: {
          'id': item.id,
          'sClassification': item.sClassification,
          'sStartTime': item.sStartTime,
          'sEndTime': item.sEndTime,
          'sAction': item.sAction,
        },
        textColor: '#333333',
        backgroundColor: color,
        borderColor: color,
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
      <b>{eventContent.event.title}</b><br></br>
      <i>{eventContent.event.extendedProps.sStartTime}～{eventContent.event.extendedProps.sEndTime}</i><br></br>
      <i>{eventContent.event.extendedProps.sAction}</i>
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
            contentHeight={700}
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
            events={(fetchInfo, successCallback, failureCallback) => getMonthApplications(fetchInfo, successCallback)}
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
      {createCalendar()}
    </>
  )
};
