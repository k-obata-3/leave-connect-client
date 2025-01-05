"use client"

import React from 'react';

import DashboardCardView from './dashboardCardView';
import DashboardCalendarView from './dashboardCalendarView';

export default function Dashboard() {
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
