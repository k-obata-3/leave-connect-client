"use client"

import React, { useEffect } from 'react';

import '@/assets/styles/dashboard.css';
import usePageBack from '@/hooks/usePageBack';
import useSetPageTitle from '@/hooks/useSetPageTitle';
import { pageCommonConst } from '@/consts/pageCommonConst';
import DashboardCardView from './dashboardCardView';
import DashboardCalendarView from './dashboardCalendarView';

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
        <div className="col dashboard-card">
          <DashboardCardView></DashboardCardView>
        </div>
        <div className="col-auto dashboard-calendar justify-content-center">
          <DashboardCalendarView></DashboardCalendarView>
        </div>
      </div>
    </div>
  );
};
