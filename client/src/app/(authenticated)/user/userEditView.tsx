"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Flatpickr from 'react-flatpickr';
import { Japanese } from 'flatpickr/dist/l10n/ja.js';
import 'flatpickr/dist/flatpickr.min.css';
import "flatpickr/dist/themes/material_blue.css";

import { useUserInfoStore } from '@/store/userInfoStore';
import { useNotificationMessageStore } from '@/store/notificationMessageStore';
import useConfirm from '@/hooks/useConfirm';
import useSetSubHeaderUserName from '@/hooks/useSetSubHeaderUserName';
import { confirmModalConst } from '@/consts/confirmModalConst';
import { SaveUserRequest, saveUser } from '@/api/saveUser';
import { getUserDetails, getUserDetailsRequest } from '@/api/getUserDetails';
import { getLoginUserInfo, getLoginUserInfoResponse } from '@/api/getLoginUserInfo';
import GrantDaysModal from './grantDaysModal';

type Props = {
  userId: string | null,
  onReload: () => void,
}

export default function UserEditView({ userId, onReload }: Props) {
  const router = useRouter();
  let dateOption = {
    locale: Japanese,
    dateFormat: 'Y/m/d',
  };

  // 共通Store
  const { setNotificationMessageObject } = useNotificationMessageStore();
  const { getUserInfo, setUserInfo } = useUserInfoStore();
  // カスタムフック
  const confirm = useConfirm();
  const setSubHeaderUserName = useSetSubHeaderUserName();

  const [showGrantDaysModal, setShowGrantDaysModal] = useState(false);
  const [inputValues, setInputValues] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    referenceDate: new Date().toLocaleDateString('ja-JP'),
    workingDays: '5',
    totalDeleteDays: '',
    totalAddDays: '',
    totalRemainingDays: '',
    totalCarryoverDays: '',
  });

  const [inputError, setInputError] = useState({
    firstName: '',
    lastName: '',
    referenceDate: '',
  });

  useEffect(() =>{
    (async() => {
      if(!userId) {
        return;
      }

      setInputError({ ...inputError,
        firstName: '',
        lastName: '',
        referenceDate: '',
      })

      getUser();
      closeGrantDaysModal();
    })()
  },[userId])

  const getUser = async() => {
    const req: getUserDetailsRequest = {
      id: userId,
    }

    const res = await getUserDetails(req);
    if(res.responseResult) {
      const utcReferenceDate = new Date(res.referenceDate)
      setInputValues({
        ...inputValues,
        userId: res.userId,
        firstName: res.firstName,
        lastName: res.lastName,
        referenceDate: new Date(utcReferenceDate.getUTCFullYear(), utcReferenceDate.getMonth(), utcReferenceDate.getDate()).toLocaleDateString('ja-JP'),
        workingDays: res.workingDays,
        totalDeleteDays: res.totalDeleteDays,
        totalAddDays: res.totalAddDays,
        totalRemainingDays: res.totalRemainingDays,
        totalCarryoverDays: res.totalCarryoverDays,
      });
    } else {
      setNotificationMessageObject({
        errorMessageList: res.message ? [res.message] : [],
        inputErrorMessageList: [],
      })
    }
  }

  const handleOnChange = (e: any) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value});
  }

  const handleOnDateChange = (date: Date, name: any) => {
    if(date) {
      setInputValues({ ...inputValues, [name]: date.toLocaleDateString('ja-JP')});
    } else {
      setInputValues({ ...inputValues, [name]: ''});
    }
  }

  /**
   * 付与日数更新ボタン押下
   * @returns 
   */
  const onUpdateGrantDays = () => {
    setShowGrantDaysModal(true);
  };

  const closeGrantDaysModal = () => {
    setShowGrantDaysModal(false);
  };

  const callback = async(reload: boolean) => {
    if(reload) {
      // ログインユーザ自身の場合、共通Store内のユーザ情報を更新
      if(userId == getUserInfo().id) {
        await getLoginUserInfo().then(async(res: getLoginUserInfoResponse) => {
          if(res.responseResult) {
            setUserInfo(res);
          }
        })
      }

      // 更新後のユーザ情報を取得
      getUser();
    }
    setShowGrantDaysModal(false);
  };

  /**
   * 保存ボタン押下
   * @returns 
   */
  const onSubmit = async() => {
    const requiredErrors = {
      ...inputError,
      ['lastName']: !inputValues.lastName ? '姓は必須入力です。' : '',
      ['firstName']: !inputValues.firstName ? '名は必須入力です。' : '',
      ['referenceDate']: !inputValues.referenceDate ? '基準日は必須入力です。' : '',
      // ['workingDays']: !inputValues.workingDays ? '稼働日数は必須入力です。' : '',
    }

    for (const value of Object.values(requiredErrors)) {
      if(value.length) {
        setInputError(requiredErrors);
        setNotificationMessageObject({
          errorMessageList: [],
          inputErrorMessageList: ['入力内容が不正です。'],
        })
        return;
      }
    }

    const cancel = await confirm({
      description: confirmModalConst.message.saveUser,
    }).then(async() => {
      const request: SaveUserRequest = {
        id: userId,
        lastName: inputValues.lastName,
        firstName: inputValues.firstName,
        referenceDate: inputValues.referenceDate,
        workingDays: inputValues.workingDays,
      }

      const res = await saveUser(request);
      if(res.responseResult) {
        // ログインユーザ自身の場合、共通Store内のユーザ情報、サブヘッダに表示しているユーザ名を更新
        if(userId == getUserInfo().id) {
          setUserInfo(res);
          setSubHeaderUserName(res.firstName, res.lastName);
        }

        onReload();
        router.replace('/user', {scroll: true});
      } else {
        setNotificationMessageObject({
          errorMessageList: res.message ? [res.message] : [],
          inputErrorMessageList: [],
        })
      }
    }).catch(() => {
      return true
    })

    if (cancel) {
    }
  };

  return (
    <>
      <div className="operation-btn-parent-view">
        <div className="operation-btn-view-pc">
          <button className="btn btn-outline-success" onClick={onUpdateGrantDays}>付与日数更新</button>
          <button className="btn btn-outline-primary ms-2" onClick={onSubmit}>保存</button>
        </div>
      </div>

      {/* ユーザID */}
      <div className="row mb-3 g-3">
        <div className="col-md-2">
          <label className="col-form-label fw-medium" htmlFor="userId">ユーザID</label>
        </div>
        <div className="col-xl-4 col-6 pe-3 g-1">
          <input className="form-control" type="text" value={inputValues.userId} name="userId" id="userId" disabled />
        </div>
      </div>
      {/* 姓名 */}
      <div className="row mb-3 g-3">
        <div className="col-md-2">
          <label className="col-form-label fw-medium" htmlFor="lastName">名前</label>
        </div>
        <div className="col-md-5 col-6 pe-3">
          <input className="form-control" type="text" placeholder="姓" value={inputValues.lastName} name="lastName" id="lastName" onChange={(e) => handleOnChange(e)} />
          <p className="input_error">{inputError.lastName}</p>
        </div>
        <div className="col-md-5 col-6 ps-3">
          <input className="form-control" type="text" placeholder="名" value={inputValues.firstName} name="firstName" id="firstName" onChange={(e) => handleOnChange(e)} />
          <p className="input_error">{inputError.firstName}</p>
        </div>
      </div>
      {/* 基準日 */}
      <div className="row mb-3 g-3">
        <div className="col-md-2">
          <label className="col-form-label fw-medium" htmlFor="referenceDate">基準日</label>
        </div>
        <div className="col-2">
          <Flatpickr className="form-select" id="referenceDate" options={dateOption}
            value={inputValues.referenceDate} name="referenceDate" onChange={([date]) => handleOnDateChange(date, "referenceDate")} />
          <p className="input_error">{inputError.referenceDate}</p>
        </div>
      </div>
      {/* 稼働日数（日/週） */}
      <div className="row mb-3 g-3">
        <div className="col-md-2">
          <label className="col-form-label fw-medium" htmlFor="workingDays">稼働日数</label>
        </div>
        <div className="col-2">
          <select className="form-select" value={inputValues.workingDays} name="workingDays" id="workingDays" onChange={(e) => handleOnChange(e)}>
            {
              ['1', '2', '3', '4', '5'].map((item: any, index: number) => (
                <option value={item} key={index}>{item}日</option>
              ))
            }
          </select>
        </div>
      </div>

      <div className="row mb-3 g-3">
        <div className="col-md-10 offset-md-2">
          <div className="row mb-3 g-3">
            {/* 有給取得日数 */}
            <div className="col-md-2 col-3 me-3">
              <label className="form-label fw-medium">有給取得日数</label>
              <p className="mt-1 ps-3">{inputValues.totalDeleteDays}</p>
            </div>
            {/* 有給残日数 */}
            <div className="col-md-2 col-3 me-3">
              <label className="form-label fw-medium">有給残日数</label>
              <p className="mt-1 ps-3">{inputValues.totalRemainingDays}</p>
            </div>
          </div>
          <div className="row mb-3 g-3">
            {/* 繰越日数 */}
            <div className="col-md-2 col-3 me-3">
              <label className="form-label fw-medium">繰越日数</label>
              <p className="mt-1 ps-3">{inputValues.totalCarryoverDays}</p>
            </div>
            {/* 付与日数 */}
            <div className="col-md-2 col-3 me-3">
              <label className="form-label fw-medium">付与日数</label>
              <p className="mt-1 ps-3">{inputValues.totalAddDays}</p>
            </div>
            <div className="col-md-3 col-3"></div>
          </div>
        </div>
      </div>
      <GrantDaysModal userId={userId} isShow={showGrantDaysModal} callback={callback}></GrantDaysModal>
    </>
  )
};
