"use client"

import React, { useState, useEffect } from 'react';
import { getUserDetails, getUserDetailsRequest, getUserDetailsResponse,  } from '@/api/getUserDetails';
import { useUserInfoStore } from '@/app/store/UserInfoStore';

export default function EditPassword() {
  const { getUserInfo } = useUserInfoStore();
  const [inputValues, setInputValues] = useState({
    currentPassword: '',
    afterChangePassword: '',
    afterChangePasswordConfirm: '',
  });

  const [inputError, setInputError] = useState({
    currentPassword: '',
    afterChangePassword: '',
    afterChangePasswordConfirm: '',
  });

  const handleOnChange = (e: any) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value});
  }

  const onSave = (e: any) => {
    let currentPasswordError = '';
    let afterChangePasswordError = '';
    let afterChangePasswordConfirmError = '';
    if(!inputValues.currentPassword) {
      currentPasswordError = '現在のパスワードは必須入力です。';
    }

    if(!inputValues.afterChangePassword) {
      afterChangePasswordError = '変更後パスワードは必須入力です。';
    }

    if(!inputValues.afterChangePasswordConfirm) {
      afterChangePasswordConfirmError = '確認用パスワードは必須入力です。';
    }

    setInputError({
      currentPassword: currentPasswordError,
      afterChangePassword: afterChangePasswordError,
      afterChangePasswordConfirm: afterChangePasswordConfirmError,
    })
  }

  useEffect(() =>{

  },[])

  return (
    <>
      <div className="">
        <div className="row align-items-center mb-3 g-3">
          <div className="col-md-2">
            <label className="col-form-label fw-medium">現在のパスワード</label>
          </div>
          <div className="col-5 ps-3">
            <input className="form-control" type="text" placeholder="現在のパスワード" value={inputValues.currentPassword} name="currentPassword" id="currentPassword" onChange={(e) => handleOnChange(e)} />
            <p className="input_error">{inputError.currentPassword}</p>
          </div>
        </div>

        <div className="row align-items-center mb-3 g-3">
          <div className="col-md-2">
            <label className="col-form-label fw-medium">変更後パスワード</label>
          </div>
          <div className="col-5 ps-3">
            <input className="form-control" type="text" placeholder="変更後パスワード" value={inputValues.afterChangePassword} name="afterChangePassword" id="afterChangePassword" onChange={(e) => handleOnChange(e)} />
            <p className="input_error">{inputError.afterChangePassword}</p>
          </div>
        </div>

        <div className="row align-items-center mb-3 g-3">
          <div className="col-md-2">
            <label className="col-form-label fw-medium">確認用パスワード</label>
          </div>
          <div className="col-5 ps-3 mb-2">
            <input className="form-control" type="text" placeholder="確認用パスワード" value={inputValues.afterChangePasswordConfirm} name="afterChangePasswordConfirm" id="afterChangePasswordConfirm" onChange={(e) => handleOnChange(e)} />
            <p className="input_error">{inputError.afterChangePasswordConfirm}</p>
          </div>
        </div>

        <div className="col-1 text-start"></div>
        <div className="col-11 text-end">
          <button className="btn btn-outline-success" onClick={(e) => onSave(e)}>変更</button>
        </div>
      </div>
    </>
  );

};
