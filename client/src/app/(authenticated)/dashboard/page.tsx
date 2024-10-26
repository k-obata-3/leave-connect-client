"use client"

import React, { useEffect } from 'react';
import DashboardCardView from './dashboardCardView';
import DashboardCalendarView from './dashboardCalendarView';
// import { GetGrantRuleResponse, getGrantRule } from '@/api/getGrantRule';

export default function Dashboard() {
  useEffect(() =>{
    (async() => {
      // const res: GetGrantRuleResponse = await getGrantRule();
      // console.log(res)
    })();
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
