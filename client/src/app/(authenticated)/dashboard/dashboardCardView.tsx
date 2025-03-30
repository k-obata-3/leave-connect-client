"use client"

import React from 'react';
import { useUserInfoStore } from '@/store/userInfoStore';

export default function DashboardCardView() {
  // 共通Store
  const { getUserInfo } = useUserInfoStore();

  return (
    <>
      <div className="custom-card mb-2">
        <div className="custom-card-header">
          <h6>有給取得日数</h6>
        </div>
        <div className="custom-card-body text-center">
          <span>{getUserInfo().totalDeleteDays}日</span>
        </div>
      </div>
      <div className="custom-card mb-2">
        <div className="custom-card-header">
          <h6>時間単位の有給取得</h6>
        </div>
        <div className="custom-card-body text-center">
          <span>{getUserInfo().totalDeleteTimes}時間</span>
        </div>
      </div>
      <div className="custom-card mb-2">
        <div className="custom-card-header">
          <h6>合計残日数</h6>
        </div>
        <div className="custom-card-body text-center">
          <span>{getUserInfo().totalRemainingDays}日</span>
        </div>
      </div>
      <div className="custom-card mb-2">
        <div className="custom-card-header">
          <h6>合計付与日数</h6>
        </div>
        <div className="custom-card-body text-center">
          <span>{getUserInfo().totalAddDays}日</span>
        </div>
      </div>
      {/* <div className="custom-card mb-2">
        <div className="custom-card-header">
          <h6>申請中</h6>
        </div>
        <div className="custom-card-body text-center">
          <span>{getCommonObject().activeApplicationCount}件</span>
        </div>
      </div> */}
      {/* <div className="custom-card mb-2">
        <div className="custom-card-header">
          <h6></h6>
        </div>
        <div className="custom-card-body text-center">
          <span></span>
        </div>
      </div> */}
    </>
  )
};
