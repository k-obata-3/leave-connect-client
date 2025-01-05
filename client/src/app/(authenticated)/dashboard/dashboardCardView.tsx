"use client"

import React from 'react';

import { useCommonStore } from '@/store/commonStore';
import { useUserInfoStore } from '@/store/userInfoStore';

export default function DashboardCardView() {
  const { getUserInfo } = useUserInfoStore();
  const { getCommonObject } = useCommonStore();

  return (
    <>
      <div className="dashboard-card">
        <div className="card text-center">
        <div className="card-header">承認待ち</div>
          <div className="card-body">
            <blockquote className="blockquote mb-0">
              <p>{getCommonObject().activeApplicationCount}件</p>
            </blockquote>
          </div>
        </div>
      </div>
      <div className="dashboard-card">
        <div className="card text-center">
          <div className="card-header">有給取得日数</div>
          <div className="card-body">
            <blockquote className="blockquote mb-0">
              <p>{getUserInfo().totalDeleteDays}日</p>
            </blockquote>
          </div>
        </div>
      </div>
      <div className="dashboard-card">
        <div className="card text-center">
        <div className="card-header">有給残日数</div>
          <div className="card-body">
            <blockquote className="blockquote mb-0">
              <p>{getUserInfo().totalRemainingDays}日</p>
            </blockquote>
          </div>
        </div>
      </div>
      <div className="dashboard-card">
        <div className="card text-center">
        <div className="card-header"><span>付与</span><span className="ms-1 me-1">/</span><span>繰越日数</span></div>
          <div className="card-body">
            <blockquote className="blockquote mb-0">
              <p>
                <span>{getUserInfo().totalAddDays}日</span>
                <span className="ms-1 me-1">/</span>
                <span>{getUserInfo().totalCarryoverDays}日</span>
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </>
  )
};
