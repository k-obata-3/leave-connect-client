"use client"

import React, { useEffect } from 'react';

import usePageBack from '@/hooks/usePageBack';
import DashboardCardView from './dashboardCardView';
import DashboardCalendarView from './dashboardCalendarView';

export default function Dashboard() {
  // 戻るボタン カスタムフック
  const pageBack = usePageBack();

  useEffect(() =>{
    pageBack(false);
  },[])

  return (
    <div className="dashboard">
      <div className="row row-dashboard">
        <div className="row-dashboard-card">
          <DashboardCardView></DashboardCardView>
        </div>
        <div className="row-dashboard-calendar justify-content-center">
          <DashboardCalendarView></DashboardCalendarView>
        </div>
      </div>
    </div>
  );
};
