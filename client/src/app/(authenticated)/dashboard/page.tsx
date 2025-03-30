"use client"

import React, { useEffect } from 'react';

import '@/assets/styles/dashboard.css';
import usePageBack from '@/hooks/usePageBack';
import useSetPageTitle from '@/hooks/useSetPageTitle';
import { pageCommonConst } from '@/consts/pageCommonConst';
import DashboardCardView from './dashboardCardView';
import DashboardCalendarView from './dashboardCalendarView';
import AggregateView from './aggregateView';

export default function Dashboard() {
  // カスタムフック
  const pageBack = usePageBack();
  const pageTitle = useSetPageTitle();

  useEffect(() =>{
    pageBack(false);
    pageTitle(pageCommonConst.pageName.dashboard);
  },[])

  return (
    <div className="dashboard">
      <div className="row">
        <div className="col-auto dashboard-card-calendar">
          <div className="row dashboard-card">
            <DashboardCardView></DashboardCardView>
          </div>
          <div className="col-auto dashboard-calendar">
            <DashboardCalendarView></DashboardCalendarView>
          </div>
        </div>
        <div className="col dashboard-aggregate-view">
          <AggregateView></AggregateView>
        </div>
      </div>
    </div>
  );
};
