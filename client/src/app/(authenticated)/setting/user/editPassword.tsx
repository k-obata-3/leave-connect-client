"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useNotificationMessageStore } from '@/store/notificationMessageStore';
import useConfirm from '@/hooks/useConfirm';
import utils from '@/assets/js/utils';
import { confirmModalConst } from '@/consts/confirmModalConst';
import { logout } from '@/api/logout';
import { changePassword, ChangePasswordRequest, ChangePasswordResponse } from '@/api/changePassword';
import { pageCommonConst } from '@/consts/pageCommonConst';

export default function EditPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // 共通Store
  const { setNotificationMessageObject } = useNotificationMessageStore();
  // モーダル表示 カスタムフック
  const confirm = useConfirm();
  const [inputValues, setInputValues] = useState({
    currentPassword: '',
    afterChangePassword: '',
    afterChangePasswordConfirm: '',
  });

  const [inputError, setInputError] = useState({
    currentPassword: '',
    afterChangePassword: '',
    afterChangePasswordConfirm: '',
    mismatchPassword: '',
  });

  useEffect(() =>{
    setInputValues({
      ...inputValues,
      ['currentPassword']: '',
      ['afterChangePassword']: '',
      ['afterChangePasswordConfirm']: '',
    });
    setInputError({
      ...inputError,
      ['currentPassword']: '',
      ['afterChangePassword']: '',
      ['afterChangePasswordConfirm']: '',
      ['mismatchPassword']: '',
    });
  },[searchParams])

  const handleOnChange = (e: any) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value});
  }

  const onChangePassword = async(e: any) => {
    const errors = {
      ...inputError,
      ['currentPassword']: !inputValues.currentPassword.trim() ? '現在のパスワードは必須入力です。' : '',
      ['afterChangePassword']: !inputValues.afterChangePassword.trim() ? '変更後パスワードは必須入力です。' : '',
      ['afterChangePasswordConfirm']: !inputValues.afterChangePasswordConfirm.trim() ? '確認用パスワードは必須入力です。' : '',
      ['mismatchPassword']: inputValues.afterChangePassword.trim() != inputValues.afterChangePasswordConfirm.trim() ? '確認用パスワードが不一致です。' : '',
    };

    for (const value of Object.values(errors)) {
      if(value.length) {
        setInputError(errors);
        setNotificationMessageObject({
          errorMessageList: [],
          inputErrorMessageList: ['入力内容が不正です。'],
        })
        return;
      }
    }

    const cancel = await confirm({
      description: confirmModalConst.message.changePassword,
    }).then(async() => {
      const req: ChangePasswordRequest = {
        oldPassword: utils.getHash(inputValues.currentPassword),
        newPassword: utils.getHash(inputValues.afterChangePassword),
      }
  
      await changePassword(req).then(async(res: ChangePasswordResponse) => {
        if(res.responseResult) {
          const res = await logout();
          router.replace(pageCommonConst.path.login, {scroll: false});
        } else {
          setNotificationMessageObject({
            errorMessageList: res.message ? [res.message] : [],
            inputErrorMessageList: [],
          })
        }
      });
    }).catch(() => {
      return true
    })

    if (cancel) {
    }
  }

  return (
    <>
      <div className="ps-1 pe-1">
        <div className="operation-btn-parent-view">
          <div className="pc-only operation-btn-view-pc">
            <button className="btn btn-outline-primary" onClick={(e) => onChangePassword(e)}>変更</button>
          </div>
          <div className="sp-only operation-btn-view-sp">
            <button className="btn btn-primary flex-grow-1 m-1" onClick={(e) => onChangePassword(e)}>変更</button>
          </div>
        </div>

        <div className="row align-items-center mb-3 g-3">
          <div className="col-md-2">
            <label className="col-form-label fw-medium">現在のパスワード</label>
          </div>
          <div className="col col-md-5 ps-3">
            <input className="form-control" type="text" placeholder="現在のパスワード" value={inputValues.currentPassword} name="currentPassword" id="currentPassword" onChange={(e) => handleOnChange(e)} />
            <p className="input_error">{inputError.currentPassword}</p>
          </div>
        </div>

        <div className="row align-items-center mb-3 g-3">
          <div className="col-md-2">
            <label className="col-form-label fw-medium">変更後パスワード</label>
          </div>
          <div className="col col-md-5 ps-3">
            <input className="form-control" type="text" placeholder="変更後パスワード" value={inputValues.afterChangePassword} name="afterChangePassword" id="afterChangePassword" onChange={(e) => handleOnChange(e)} />
            <p className="input_error">{inputError.afterChangePassword}</p>
          </div>
        </div>

        <div className="row align-items-center mb-3 g-3 pb-5">
          <div className="col-md-2">
            <label className="col-form-label fw-medium">確認用パスワード</label>
          </div>
          <div className="col col-md-5 ps-3 mb-2">
            <input className="form-control" type="text" placeholder="確認用パスワード" value={inputValues.afterChangePasswordConfirm} name="afterChangePasswordConfirm" id="afterChangePasswordConfirm" onChange={(e) => handleOnChange(e)} />
            <p className="input_error">{inputError.afterChangePasswordConfirm}</p>
            <p className="input_error">{inputError.mismatchPassword}</p>
          </div>
        </div>
      </div>
    </>
  );

};
