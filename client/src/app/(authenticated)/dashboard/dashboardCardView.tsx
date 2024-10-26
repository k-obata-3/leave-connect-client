"use client"

import React, { useEffect } from 'react';
import { useUserInfoStore } from '@/app/store/UserInfoStore';
import { useCommonStore } from '@/app/store/CommonStore';

export default function DashboardCardView() {
  const { getUserInfo } = useUserInfoStore();
  const { getCommonObject } = useCommonStore();
  useEffect(() =>{

  }, [])

  return (
    <>
      <div className="dashboard-card">
        <div className="card text-center">
        <div className="card-header">申請処理中</div>
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
              <p>{getUserInfo().autoCalcRemainingDays}日</p>
            </blockquote>
          </div>
        </div>
      </div>
      <div className="dashboard-card">
        <div className="card text-center">
        <div className="card-header">付与/繰越日数</div>
          <div className="card-body">
            <blockquote className="blockquote mb-0">
              <p>
                <span>{getUserInfo().totalAddDays}日</span>
                <span>/{getUserInfo().totalCarryoverDays}日</span>
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </>
  )
};
