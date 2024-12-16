"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Flatpickr from 'react-flatpickr';
import { Japanese } from 'flatpickr/dist/l10n/ja.js';
import 'flatpickr/dist/flatpickr.min.css';
import "flatpickr/dist/themes/material_blue.css";

import { getUserDetailsResponse } from '@/api/getUserDetails';
import { SaveUserRequest, SaveUserResponse, saveUser } from '@/api/saveUser';
import { updateGrantDays, UpdateGrantDaysRequest, UpdateGrantDaysResponse } from '@/api/updateGrantDays';
import { useNotificationMessageStore } from '@/app/store/NotificationMessageStore';

type Props = {
  id: number | undefined,
  user: getUserDetailsResponse | undefined,
}

export default function UserEditView({ id, user }: Props) {
  const router = useRouter();
  let dateOption = {
    locale: Japanese,
    dateFormat: 'Y/m/d',
  };

  // 共通Sore
  const { setNotificationMessageObject } = useNotificationMessageStore();
  const [values, setValues] = useState({
    autoCalcRemainingDays: '',
  });

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
    totalDeleteDays: '',
    totalAddDays: '',
    totalRemainingDays: '',
    totalCarryoverDays: '',
  });

  useEffect(() =>{
    if(id && user) {
      setValues({
        ...values,
        autoCalcRemainingDays: user.autoCalcRemainingDays,
      })

      const utcReferenceDate = new Date(user.referenceDate)
      setInputValues({
        ...inputValues,
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        referenceDate: new Date(utcReferenceDate.getUTCFullYear(), utcReferenceDate.getMonth(), utcReferenceDate.getDate()).toLocaleDateString('ja-JP'),
        workingDays: user.workingDays,
        totalDeleteDays: user.totalDeleteDays,
        totalAddDays: user.totalAddDays,
        totalRemainingDays: user.totalRemainingDays,
        totalCarryoverDays: user.totalCarryoverDays,
      });
    }
  }, [id])

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
  const onUpdateGrantDays = async() => {
    const request: UpdateGrantDaysRequest = {
      id: id,
    }

    await updateGrantDays(request).then(async(res: UpdateGrantDaysResponse) => {
      if(res.responseResult) {

      } else {
        setNotificationMessageObject({
          errorMessageList: res.message ? [res.message] : [],
          inputErrorMessageList: [],
        })
      }
    });
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
      ['totalDeleteDays']: inputValues.totalDeleteDays < '0' ? '有給取得日数は必須入力です。' : '',
      ['totalAddDays']: inputValues.totalAddDays < '0' ? '付与日数は必須入力です。' : '',
      ['totalRemainingDays']: inputValues.totalRemainingDays < '0' ? '有給残日数は必須入力です。' : '',
      ['totalCarryoverDays']: inputValues.totalCarryoverDays < '0' ? '繰越日数は必須入力です。' : '',
    }

    for (const value of Object.values(requiredErrors)) {
      if(value.length) {
        setInputError(requiredErrors);
        return;
      }
    }

    const regexp = /^([1-9]\d*|0)(\.\d+)?$/;
    const formatErrors = {
      ...inputError,
      ['totalDeleteDays']: !regexp.test(inputValues.totalDeleteDays) ? '有給取得日数の入力値が不正です。' : '',
      ['totalAddDays']: !regexp.test(inputValues.totalAddDays) ? '付与日数の入力値が不正です。' : '',
      ['totalRemainingDays']: !regexp.test(inputValues.totalRemainingDays) ? '有給残日数の入力値が不正です。' : '',
      ['totalCarryoverDays']: !regexp.test(inputValues.totalCarryoverDays) ? '繰越日数の入力値が不正です。' : '',
    };

    for (const value of Object.values(formatErrors)) {
      if(value.length) {
        setInputError(formatErrors);
        return;
      }
    }

    const request: SaveUserRequest = {
      id: id,
      lastName: inputValues.lastName,
      firstName: inputValues.firstName,
      referenceDate: inputValues.referenceDate,
      workingDays: inputValues.workingDays,
      totalDeleteDays: inputValues.totalDeleteDays,
      totalAddDays: inputValues.totalAddDays,
      totalRemainingDays: inputValues.totalRemainingDays,
      totalCarryoverDays: inputValues.totalCarryoverDays,
    }

    await saveUser(request).then(async(res: SaveUserResponse) => {
      if(res.responseResult) {
        router.replace('/user/list', {scroll: true});
      } else {
        // 自分自身だった場合、共通Storeも更新する。
        setNotificationMessageObject({
          errorMessageList: res.message ? [res.message] : [],
          inputErrorMessageList: [],
        })
      }
    });
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
              <label className="form-label fw-medium" htmlFor="totalDeleteDays">有給取得日数</label>
              <input className="form-control" type="text" value={inputValues.totalDeleteDays} name="totalDeleteDays" id="totalDeleteDays" onChange={(e) => handleOnChange(e)} />
              <p className="input_error">{inputError.totalDeleteDays}</p>
            </div>
            {/* 有給残日数 */}
            <div className="col-md-2 col-3 me-3">
              <label className="form-label fw-medium" htmlFor="totalRemainingDays">有給残日数</label>
              <input className="form-control" type="text" value={inputValues.totalRemainingDays} name="totalRemainingDays" id="totalRemainingDays" disabled />
            </div>
            {/* 有給残日数（自動計算） */}
            <div className="col-md-3 col-3">
              <p className="fw-medium">有給残日数(自動算出)</p>
              <p className="mt-1 ps-3">{values.autoCalcRemainingDays}</p>
            </div>
          </div>
          <div className="row mb-3 g-3">
            {/* 繰越日数 */}
            <div className="col-md-2 col-3 me-3">
              <label className="form-label fw-medium" htmlFor="totalCarryoverDays">繰越日数</label>
              <input className="form-control" type="text" value={inputValues.totalCarryoverDays} name="totalCarryoverDays" id="totalCarryoverDays" onChange={(e) => handleOnChange(e)} />
              <p className="input_error">{inputError.totalCarryoverDays}</p>
            </div>
            {/* 付与日数 */}
            <div className="col-md-2 col-3 me-3">
              <label className="form-label fw-medium" htmlFor="totalAddDays">付与日数</label>
              <input className="form-control" type="text" value={inputValues.totalAddDays} name="totalAddDays" id="totalAddDays" onChange={(e) => handleOnChange(e)} />
              <p className="input_error">{inputError.totalAddDays}</p>
            </div>
            <div className="col-md-3 col-3"></div>
          </div>
        </div>
      </div>
    </>
  )
};
