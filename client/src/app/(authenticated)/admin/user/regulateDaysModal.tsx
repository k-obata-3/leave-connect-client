"use client"

import { useEffect, useState } from "react";

import Flatpickr from 'react-flatpickr';
import { Japanese } from 'flatpickr/dist/l10n/ja.js';
import 'flatpickr/dist/flatpickr.min.css';
import "flatpickr/dist/themes/material_blue.css";

import { confirmModalConst } from "@/consts/confirmModalConst";
import { UserDetails } from "@/api/getUserDetails";
import { regulateDays, RegulateDaysRequest, RegulateDaysResponse } from "@/api/regulateDays";

type Props = {
  userDetails: UserDetails | undefined,
  isShow: boolean,
  callback: (reload: boolean) => void,
}

export default function RegulateDaysModal({ userDetails, isShow, callback }: Props) {
  let dateOption = {
    locale: Japanese,
    dateFormat: 'Y/m/d',
  };

  const [apiErrors, setApiErrors] = useState<string[]>([]);
  // const [grantPeriods, setGrantPeriods] = useState<GrantPeriod[] | []>();

  const [inputValues, setInputValues] = useState({
    regulateDate: new Date().toLocaleDateString('ja-JP'),
    timeHourUnitTotalTime: '',
    otherTotalTime: '',
  });

  const [inputError, setInputError] = useState({
    regulateDate: '',
    timeHourUnitTotalTime: '',
    otherTotalTime: '',
  });

  useEffect(() =>{
    if(!(userDetails && isShow)) {
      callback(false);
      return;
    }

    clearInputErrors();
    setInputValues({
      regulateDate: new Date().toLocaleDateString('ja-JP'),
      otherTotalTime: '',
      timeHourUnitTotalTime: '',
    })

  },[isShow])

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
   * 登録ボタン押下
   * @returns 
   */
  const onRegulateDays = async() => {
    if(!userDetails) {
      return;
    }

    const requiredErrors = {
      ...inputError,
      ['regulateDate']: inputValues.regulateDate ? '' : '調整日は必須入力です。',
      ['otherTotalTime']: inputValues.otherTotalTime.trim() ? '' : '取得日数(時間単位を除く)は必須入力です。',
      ['timeHourUnitTotalTime']: inputValues.timeHourUnitTotalTime.trim() ? '' : '取得日数(時間単位分)は必須入力です。',
    };

    for (const value of Object.values(requiredErrors)) {
      if(value.length) {
        setInputError(requiredErrors);
        setApiErrors(['入力内容が不正です。'])
        return;
      }
    }

    const regexp = /^([1-9]\d*|0)(\.\d+)?$/;
    const formatErrors = {
      ...inputError,
      ['otherTotalTime']: regexp.test(inputValues.otherTotalTime) ? '' : '取得日数(時間単位を除く)の入力値が不正です。',
      ['timeHourUnitTotalTime']: regexp.test(inputValues.timeHourUnitTotalTime) ? '' : '取得日数(時間単位分)の入力値が不正です。',
    };

    for (const value of Object.values(formatErrors)) {
      if(value.length) {
        setInputError(formatErrors);
        setApiErrors(['入力内容が不正です。'])
        return;
      }
    }

    clearInputErrors();

    const request: RegulateDaysRequest = {
      userId: userDetails.id.toString(),
      regulateDate: inputValues.regulateDate,
      otherTotalTime: inputValues.otherTotalTime,
      timeHourUnitTotalTime: inputValues.timeHourUnitTotalTime,
    }

    await regulateDays(request).then(async(res: RegulateDaysResponse) => {
      if(res.responseResult) {
        callback(true);
      } else {
        setApiErrors(res.message ? [res.message] : [])
      }
    });
  };

  const clearInputErrors = () => {
    setApiErrors([]);
    setInputError({
      regulateDate: '',
      otherTotalTime: '',
      timeHourUnitTotalTime: '',
    })
  }

  return (
    <div className={isShow ? "custom-modal-overview modal-show" : "custom-modal-overview"}>
      <div className="custom-modal-content col-12 col-md-10 offset-md-1" hidden={!isShow}>
        <div className="custom-modal-header">
          <div className="me-1"><i className="bi bi-question-circle-fill text-primary fs-4"></i></div>
            <h5 className="flex-grow-1 m-0">{confirmModalConst.label.confirm}</h5>
          <button className="btn btn-outline-default" onClick={() => callback(false)}><i className="bi bi-x-lg"></i></button>
        </div>
        <div className="custom-modal-content-body">
          <div className="alert alert-danger pt-2 pb-2 mt-1 ms-3 me-3 mb-2" role="alert" hidden={!apiErrors.length}>
            {
              apiErrors.filter(msg => msg).map((msg, index) => {
                return<p className="m-0" key={index}>{msg}</p>
              })
            }
          </div>
          <p className="text-center">有給休暇の取得日数を旧システムから引継ぎます。</p>
          <p className="text-center m-0"><span className="pe-1">例:</span><span>2025年4月1日時点での有給休暇の取得日数が5日、時間単位分が2時間の場合、調整日に「2025/04/01」</span></p>
          <p className="text-center"><span>取得日数(時間単位を除く)に「5」、取得日数(時間単位分)に「2」を入力してください。</span></p>
          <div className="col-10 offset-1">
            <div className="row mb-3 g-3">
              <div className="col-md-4">
                <label className="col-form-label fw-medium" htmlFor="regulateDate">調整日</label>
              </div>
              <div className="col-3 col-xl-2">
                <Flatpickr className="form-select" id="regulateDate" options={dateOption}
                  value={inputValues.regulateDate} name="regulateDate" placeholder="2025/04/01" onChange={([date]) => handleOnDateChange(date, "regulateDate")} />
              </div>
              <div className="offset-4">
                <p className="input_error">{inputError.regulateDate}</p>
              </div>
            </div>
            <div className="row mb-3 g-3">
              <div className="col-md-4">
                <label className="form-label fw-medium">取得日数(時間単位を除く)</label>
              </div>
              <div className="col-3 col-xl-2">
                <input className="form-control" type="text" placeholder="5" value={inputValues.otherTotalTime} name="otherTotalTime" id="otherTotalTime" onChange={(e) => handleOnChange(e)} />
              </div>
              <div className="col-auto ps-2">
                <p className="form-text pt-1">日</p>
              </div>
              <div className="col-auto ps-2">
                <p className="form-text pt-1"><span>※半日の場合は0.5を入力</span></p>
              </div>
              <div className="offset-4">
                <p className="input_error">{inputError.otherTotalTime}</p>
              </div>
            </div>
            <div className="row mb-3 g-3">
              <div className="col-md-4">
                <label className="form-label fw-medium">取得日数(時間単位分)</label>
              </div>
              <div className="col-3 col-xl-2">
                <input className="form-control" type="text" placeholder="2" value={inputValues.timeHourUnitTotalTime} name="timeHourUnitTotalTime" id="timeHourUnitTotalTime" onChange={(e) => handleOnChange(e)} />
              </div>
              <div className="col-auto ps-2">
                <p className="form-text pt-1">時間</p>
              </div>
              <div className="offset-4">
                <p className="input_error">{inputError.timeHourUnitTotalTime}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="custom-modal-footer">
          <button className="btn btn-secondary col-auto col-md-5" onClick={() => callback(false)}>{confirmModalConst.button.close}</button>
          <button className='btn btn-primary col-auto col-md-5 ms-3' onClick={onRegulateDays}>{confirmModalConst.button.regulate}</button>
        </div>
      </div>
    </div>
  )
};
