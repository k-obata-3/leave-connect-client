"use client"

import React from 'react';

import { useCommonStore } from '@/store/commonStore';
import { useUserInfoStore } from '@/store/userInfoStore';

export default function DashboardCardView() {
  const { getUserInfo } = useUserInfoStore();
  const { getCommonObject } = useCommonStore();

  return (
    <>
      <div className="custom-card mb-2">
        <div className="custom-card-header">
          <h6>承認待ち</h6>
        </div>
        <div className="custom-card-body text-center">
          <span>{getCommonObject().activeApplicationCount}件</span>
        </div>
      </div>
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
          <h6>有給残日数</h6>
        </div>
        <div className="custom-card-body text-center">
          <span>{getUserInfo().totalRemainingDays}日</span>
        </div>
      </div>
      <div className="custom-card mb-2">
      <div className="custom-card-header">
          <h6><span>付与</span><span className="ms-1 me-1">/</span><span>繰越日数</span></h6>
        </div>
        <div className="custom-card-body text-center">
          <span>{getUserInfo().totalAddDays}日</span>
          <span className="ms-1 me-1">/</span>
          <span>{getUserInfo().totalCarryoverDays}日</span>
        </div>
      </div>
    </>
  )
};
