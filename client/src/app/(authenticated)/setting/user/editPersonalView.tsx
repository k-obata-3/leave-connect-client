"use client"

import React from 'react';

import { useUserInfoStore } from '@/store/userInfoStore';

export default function EditPersonalView() {
  // 共通Store
  const { getUserInfo } = useUserInfoStore();

  return (
    <>
      <div className="ps-1 pe-1">
        <div className="row align-items-center mb-3 g-3">
          <div className="col-md-2">
            <label className="col-form-label fw-medium">ユーザID</label>
          </div>
          <div className="col col-md-5 ps-3">
            <p className="mb-0">{getUserInfo().userId}</p>
          </div>
        </div>

        <div className="row align-items-center mb-3 g-3">
          <div className="col-md-2">
            <label className="col-form-label fw-medium">名前</label>
          </div>
          <div className="col col-md-5 ps-3">
            <p className="mb-0">{getUserInfo().lastName} {getUserInfo().firstName}</p>
          </div>
        </div>
        <div className="row align-items-center mb-3 g-3">
          <div className="col-md-2">
            <label className="col-form-label fw-medium">名前(カナ)</label>
          </div>
          <div className="col col-md-5 ps-3">
          <p className="mb-0">{getUserInfo().lastNameKana} {getUserInfo().firstNameKana}</p>
          </div>
        </div>
        <div className="row align-items-center mb-3 g-3">
          <div className="col-md-2">
            <label className="col-form-label fw-medium">生年月日</label>
          </div>
          <div className="col col-md-5 ps-3">
            <p className="mb-0">{getUserInfo().dateOfBirth.substring(0, 10).replaceAll('-', '/')}</p>
          </div>
        </div>
        <div className="row align-items-center mb-3 g-3">
          <div className="col-md-2">
            <label className="col-form-label fw-medium">入社日</label>
          </div>
          <div className="col col-md-5 ps-3">
            <p className="mb-0">{getUserInfo().joiningDate.substring(0, 10).replaceAll('-', '/')}</p>
          </div>
        </div>
        <div className="row align-items-center mb-3 g-3">
          <div className="col-md-2">
            <label className="col-form-label fw-medium">基準日</label>
          </div>
          <div className="col col-md-5 ps-3">
            <p className="mb-0">{getUserInfo().referenceDate.substring(0, 10).replaceAll('-', '/')}</p>
          </div>
        </div>
      </div>
    </>
  );

};
