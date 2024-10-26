"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Flatpickr from 'react-flatpickr';
import { Japanese } from 'flatpickr/dist/l10n/ja.js';
import 'flatpickr/dist/flatpickr.min.css';
import "flatpickr/dist/themes/material_blue.css";

import { getUserDetailsResponse } from '@/api/getUserDetails';
import { SaveUserRequest, saveUser } from '@/api/saveUser';
import { updateGrantDays, UpdateGrantDaysRequest } from '@/api/updateGrantDays';

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

  const [values, setValues] = useState({
    autoCalcRemainingDays: '',
  });

  const [inputValues, setInputValues] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    referenceDateStr: '',
    referenceDate: new Date(),
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

  const [inputNumberError, setInputNumberError] = useState({
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
        referenceDateStr: new Date(utcReferenceDate.getUTCFullYear(), utcReferenceDate.getMonth(), utcReferenceDate.getDate()).toLocaleDateString('ja-JP'),
        referenceDate: new Date(utcReferenceDate.getUTCFullYear(), utcReferenceDate.getMonth(), utcReferenceDate.getDate()),
        workingDays: user.workingDays,
        totalDeleteDays: user.totalDeleteDays,
        totalAddDays: user.totalAddDays,
        totalRemainingDays: user.totalRemainingDays,
        totalCarryoverDays: user.totalCarryoverDays,
      });
    }
  }, [id])

  const setHandleInputError = (e: any) => {
    const value = e.target.value;
    let errorMsg = '';
    if(!value) {
      errorMsg = "必須入力です"
    }

    setInputError({ ...inputError, [e.target.name]: errorMsg});
  }

  const setHandleInputNumberError = (e: any) => {
    const regexp = /^([1-9]\d*|0)(\.\d+)?$/;
    const value = e.target.value;
    let errorMsg = '';
    if(!value) {
      errorMsg = "必須入力です"
    }

    const isValid = regexp.test(value);
    if(value && !isValid) {
      errorMsg = '入力値が不正です';
    }

    setInputNumberError({ ...inputNumberError, [e.target.name]: errorMsg});
  }

  const handleOnChange = (e: any) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value});
  }

  const handleOnDateChange = (date: Date, name: any) => {
    let errorMsg = '';
    let value = '';
    if(date) {
      value = date.toLocaleDateString('ja-JP');
    } else {
      errorMsg = "必須入力です"
    }

    setInputValues({ ...inputValues, [name]: value});
    setInputError({ ...inputError, [name]: errorMsg});
  }

  /**
   * 付与日数更新ボタン押下
   * @returns 
   */
  const onUpdateGrantDays = async() => {
    const request: UpdateGrantDaysRequest = {
      id: id,
    }

    const res = await updateGrantDays(request);
    if(res) {

    }
  };

  /**
   * 保存ボタン押下
   * @returns 
   */
  const onSubmit = async() => {
    let hasError = false;
    for (let [key, value] of Object.entries(inputError)) {
      if(value !== '') {
        hasError = true;
        break;
      }
    }

    for (let [key, value] of Object.entries(inputNumberError)) {
      if(value !== '') {
        hasError = true;
        break;
      }
    }

    if(hasError) {
      return;
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

    const res = await saveUser(request);
    if(res) {
      router.replace('/user/list', {scroll: true});
    }
  };

  return (
    <>
      <div className="row col-12">
        <div className="col text-end">
        <button className="btn btn-outline-success" onClick={onUpdateGrantDays}>付与日数更新</button>
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
          <input className="form-control" type="text" placeholder="姓" value={inputValues.lastName} name="lastName" id="lastName" onChange={(e) => handleOnChange(e)} onBlur={(e) => setHandleInputError(e)} />
          <p className="input_error">{inputError.lastName}</p>
        </div>
        <div className="col-md-5 col-6 ps-3">
          <input className="form-control" type="text" placeholder="名" value={inputValues.firstName} name="firstName" id="firstName" onChange={(e) => handleOnChange(e)} onBlur={(e) => setHandleInputError(e)} />
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
              <input className="form-control" type="text" value={inputValues.totalDeleteDays} name="totalDeleteDays" id="totalDeleteDays" onChange={(e) => handleOnChange(e)} onBlur={(e) => setHandleInputNumberError(e)} />
              <p className="input_error">{inputNumberError.totalDeleteDays}</p>
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
              <input className="form-control" type="text" value={inputValues.totalCarryoverDays} name="totalCarryoverDays" id="totalCarryoverDays" onChange={(e) => handleOnChange(e)} onBlur={(e) => setHandleInputNumberError(e)} />
              <p className="input_error">{inputNumberError.totalCarryoverDays}</p>
            </div>
            {/* 付与日数 */}
            <div className="col-md-2 col-3 me-3">
              <label className="form-label fw-medium" htmlFor="totalAddDays">付与日数</label>
              <input className="form-control" type="text" value={inputValues.totalAddDays} name="totalAddDays" id="totalAddDays" onChange={(e) => handleOnChange(e)} onBlur={(e) => setHandleInputNumberError(e)} />
              <p className="input_error">{inputNumberError.totalAddDays}</p>
            </div>
            <div className="col-md-3 col-3"></div>
          </div>
        </div>
      </div>
      <div className="row col-12 mt-4">
        <div className="col-1 text-start"></div>
        <div className="col text-end">
          <button className="btn btn-outline-primary me-3" onClick={onSubmit}>保存</button>
        </div>
      </div>
    </>
  )
};
