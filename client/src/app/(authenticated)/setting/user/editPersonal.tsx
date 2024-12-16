"use client"

import React, { useState, useEffect } from 'react';
import { useUserInfoStore } from '@/app/store/UserInfoStore';
// import { getUserDetails, getUserDetailsRequest, getUserDetailsResponse,  } from '@/api/getUserDetails';
// import { useSearchParams } from 'next/navigation';
// import { useNotificationMessageStore } from '@/app/store/NotificationMessageStore';

export default function EditPersonal() {
  // const searchParams = useSearchParams();
  // 共通Sore
  const { getUserInfo } = useUserInfoStore();
  // const { setNotificationMessageObject } = useNotificationMessageStore();
  // const [inputValues, setInputValues] = useState({
  //   firstName: '',
  //   lastName: '',
  // });

  // const [inputError, setInputError] = useState({
  //   name: '',
  // });

  // useEffect(() =>{
  //   setInputValues({
  //     ...inputValues,
  //     firstName: getUserInfo().firstName,
  //     lastName: getUserInfo().lastName,
  //   })

  //   setInputError({
  //     ...inputError,
  //     ['name']: '',
  //   });
  // },[searchParams])

  // const handleOnChange = (e: any) => {
  //   setInputValues({ ...inputValues, [e.target.name]: e.target.value});
  // }

  // const onSave = (e: any) => {
  //   const errors = {
  //     ...inputError,
  //     ['name']: !inputValues.lastName.trim() || !inputValues.firstName.trim() ? '名前は必須入力です。' : '',
  //   };

  //   for (const value of Object.values(errors)) {
  //     if(value.length) {
  //       setInputError(errors);
  //       setNotificationMessageObject({
  //         errorMessageList: [],
  //         inputErrorMessageList: ['入力内容が不正です。'],
  //       })
  //       return;
  //     }
  //   }
  // }

  return (
    <>
      <div className="">

        {/* <div className="operation-btn-parent-view">
          <div className="pc-only operation-btn-view-pc">
            <button className="btn btn-outline-primary" onClick={(e) => onSave(e)}>保存</button>
          </div>
          <div className="sp-only operation-btn-view-sp">
            <button className="btn btn-primary flex-grow-1 m-1" onClick={(e) => onSave(e)}>保存</button>
          </div>
        </div> */}

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
            <label className="col-form-label fw-medium">基準日</label>
          </div>
          <div className="col col-md-5 ps-3">
            <p className="mb-0">{getUserInfo().referenceDate.substring(0, 10).replaceAll('-', '/')}</p>
          </div>
        </div>

        {/* <div className="row align-items-center mb-3 g-3">
          <div className="col-md-2">
            <label className="col-form-label fw-medium" htmlFor="lastName">名前(姓)</label>
          </div>
          <div className="col col-md-5 ps-3">
            <input className="form-control" type="text" placeholder="姓" value={inputValues.lastName} name="lastName" id="lastName" onChange={(e) => handleOnChange(e)} />
          </div>
        </div> */}

        {/* <div className="row align-items-center mb-3 g-3">
          <div className="col-md-2">
            <label className="col-form-label fw-medium" htmlFor="firstName">名前(名)</label>
          </div>
          <div className="col col-md-5 ps-3">
            <input className="form-control" type="text" placeholder="名" value={inputValues.firstName} name="firstName" id="firstName" onChange={(e) => handleOnChange(e)} />
          </div>
        </div>
        <div className="row align-items-center mb-3 g-3">
          <div className="col-12 offset-md-2 ps-3 mb-2">
            <p className="input_error">{inputError.name}</p>
          </div>
        </div> */}

      </div>
    </>
  );

};
