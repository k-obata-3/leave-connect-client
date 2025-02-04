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
import utils from '@/assets/js/utils';
import { SaveUserRequest, saveUser } from '@/api/saveUser';
import { getUserDetails, getUserDetailsRequest } from '@/api/getUserDetails';
import { getLoginUserInfo, getLoginUserInfoResponse } from '@/api/getLoginUserInfo';
import GrantDaysModal from './grantDaysModal';

type Props = {
  userPrimaryId: string | null,
  isNew: boolean,
  onReload: () => void,
}

export default function UserEditView({ userPrimaryId, isNew, onReload }: Props) {
  const router = useRouter();
  let dateOption = {
    locale: Japanese,
    dateFormat: 'Y/m/d',
  };

  const AUTH_INPUT_MAP = [
    { key: 'standard', name: '一般', value: '1' },
    { key: 'admin', name: '管理者', value: '0' },
  ]

  // 共通Store
  const { setNotificationMessageObject } = useNotificationMessageStore();
  const { getUserInfo, setUserInfo } = useUserInfoStore();
  // カスタムフック
  const confirm = useConfirm();
  const setSubHeaderUserName = useSetSubHeaderUserName();

  const [showGrantDaysModal, setShowGrantDaysModal] = useState(false);
  const [isLoadComplete, setIsLoadComplete] = useState(false);
  const [inputValues, setInputValues] = useState({
    userId: '',
    password: '',
    firstName: '',
    lastName: '',
    firstNameKana: '',
    lastNameKana: '',
    dateOfBirth: new Date().toLocaleDateString('ja-JP'),
    joiningDate: new Date().toLocaleDateString('ja-JP'),
    referenceDate: new Date().toLocaleDateString('ja-JP'),
    workingDays: '5',
    auth: '1',
    totalDeleteDays: '',
    totalAddDays: '',
    totalRemainingDays: '',
    totalCarryoverDays: '',
  });

  const [inputError, setInputError] = useState({
    userId: '',
    password: '',
    firstName: '',
    lastName: '',
    firstNameKana: '',
    lastNameKana: '',
    dateOfBirth: '',
    joiningDate: '',
    referenceDate: '',
  });

  useEffect(() =>{
    setInputValues({
      userId: '',
      password: '',
      firstName: '',
      lastName: '',
      firstNameKana: '',
      lastNameKana: '',
      dateOfBirth: new Date().toLocaleDateString('ja-JP'),
      joiningDate: new Date().toLocaleDateString('ja-JP'),
      referenceDate: new Date().toLocaleDateString('ja-JP'),
      workingDays: '5',
      auth: '1',
      totalDeleteDays: '',
      totalAddDays: '',
      totalRemainingDays: '',
      totalCarryoverDays: '',
    });

    setInputError({ ...inputError,
      userId: '',
      password: '',
      firstName: '',
      lastName: '',
      firstNameKana: '',
      lastNameKana: '',
      dateOfBirth: '',
      joiningDate: '',
      referenceDate: '',
    })

    closeGrantDaysModal();

    if(isNew) {
      setIsLoadComplete(true);
    } else if(userPrimaryId) {
      getUser();
    }
  },[userPrimaryId, isNew])

  const getUser = async() => {
    const req: getUserDetailsRequest = {
      id: userPrimaryId,
    }

    const res = await getUserDetails(req);
    if(res.responseResult) {
      const utcDateOfBirth = new Date(res.dateOfBirth);
      const utcJoiningDate = new Date(res.joiningDate);
      const utcReferenceDate = new Date(res.referenceDate);
      setInputValues({
        ...inputValues,
        userId: res.userId,
        firstName: res.firstName,
        lastName: res.lastName,
        firstNameKana: res.firstNameKana,
        lastNameKana: res.lastNameKana,
        dateOfBirth: new Date(utcDateOfBirth.getUTCFullYear(), utcDateOfBirth.getMonth(), utcDateOfBirth.getDate()).toLocaleDateString('ja-JP'),
        joiningDate: new Date(utcJoiningDate.getUTCFullYear(), utcJoiningDate.getMonth(), utcJoiningDate.getDate()).toLocaleDateString('ja-JP'),
        referenceDate: new Date(utcReferenceDate.getUTCFullYear(), utcReferenceDate.getMonth(), utcReferenceDate.getDate()).toLocaleDateString('ja-JP'),
        workingDays: res.workingDays,
        auth: res.auth,
        totalDeleteDays: res.totalDeleteDays,
        totalAddDays: res.totalAddDays,
        totalRemainingDays: res.totalRemainingDays,
        totalCarryoverDays: res.totalCarryoverDays,
      });
      setIsLoadComplete(true);
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
      if(userPrimaryId == getUserInfo().id) {
        await getLoginUserInfo().then(async(res: getLoginUserInfoResponse) => {
          if(res.responseResult) {
            setUserInfo(res);
          }
        })
      }

      // 更新後のユーザ情報を取得
      getUser();
      onReload();
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
      ['userId']: !inputValues.userId.trim() ? 'ユーザIDは必須入力です。' : '',
      ['password']: isNew && !inputValues.password?.trim() ? 'パスワードは必須入力です。' : '',
      ['lastName']: !inputValues.lastName.trim() ? '姓は必須入力です。' : '',
      ['firstName']: !inputValues.firstName.trim() ? '名は必須入力です。' : '',
      ['lastNameKana']: !inputValues.lastNameKana.trim() ? '姓(カナ)は必須入力です。' : '',
      ['firstNameKana']: !inputValues.firstNameKana.trim() ? '名(カナ)は必須入力です。' : '',
      ['dateOfBirth']: !inputValues.dateOfBirth ? '生年月日は必須入力です。' : '',
      ['joiningDate']: !inputValues.joiningDate? '入社日は必須入力です。': '',
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
        id: userPrimaryId,
        userId: inputValues.userId,
        password: isNew ? utils.getHash(inputValues.password) : null,
        lastName: inputValues.lastName,
        firstName: inputValues.firstName,
        firstNameKana: inputValues.firstNameKana,
        lastNameKana: inputValues.lastNameKana,
        dateOfBirth: inputValues.dateOfBirth,
        joiningDate: inputValues.joiningDate,
        referenceDate: inputValues.referenceDate,
        workingDays: inputValues.workingDays,
        auth: inputValues.auth,
      }

      const res = await saveUser(request);
      if(res.responseResult) {
        // ログインユーザ自身の場合、共通Store内のユーザ情報、サブヘッダに表示しているユーザ名を更新
        if(userPrimaryId == getUserInfo().id) {
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
      <div className="operation-btn-parent-view" hidden={!isLoadComplete}>
        <div className="operation-btn-view-pc">
          <button className="btn btn-outline-success" onClick={onUpdateGrantDays} hidden={isNew}>付与日数更新</button>
          <button className="btn btn-outline-primary ms-2" onClick={onSubmit}>保存</button>
        </div>
      </div>

      {/* ユーザID */}
      <div className="row mb-3 g-3">
        <div className="col-md-2">
          <label className="col-form-label fw-medium" htmlFor="userId">ユーザID</label>
        </div>
        <div className="col-xl-4 col-6 pe-3 g-1">
          <input className="form-control" type="text" placeholder="ユーザID" value={inputValues.userId} name="userId" id="userId" onChange={(e) => handleOnChange(e)} disabled={!!userPrimaryId} />
          <p className="input_error">{inputError.userId}</p>
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
      {/* 姓名(カナ) */}
      <div className="row mb-3 g-3">
        <div className="col-md-2">
          <label className="col-form-label fw-medium" htmlFor="lastNameKana">名前(カナ)</label>
        </div>
        <div className="col-md-5 col-6 pe-3">
          <input className="form-control" type="text" placeholder="姓(カナ)" value={inputValues.lastNameKana} name="lastNameKana" id="lastNameKana" onChange={(e) => handleOnChange(e)} />
          <p className="input_error">{inputError.lastNameKana}</p>
        </div>
        <div className="col-md-5 col-6 ps-3">
          <input className="form-control" type="text" placeholder="名(カナ)" value={inputValues.firstNameKana} name="firstNameKana" id="firstNameKana" onChange={(e) => handleOnChange(e)} />
          <p className="input_error">{inputError.firstNameKana}</p>
        </div>
      </div>
      {/* 生年月日 */}
      <div className="row mb-3 g-3">
        <div className="col-md-2">
          <label className="col-form-label fw-medium" htmlFor="dateOfBirth">生年月日</label>
        </div>
        <div className="col-2">
          <Flatpickr className="form-select" id="dateOfBirth" options={dateOption}
            value={inputValues.dateOfBirth} name="dateOfBirth" placeholder="生年月日" onChange={([date]) => handleOnDateChange(date, "dateOfBirth")} />
          <p className="input_error">{inputError.dateOfBirth}</p>
        </div>
      </div>
      {/* 入社日 */}
      <div className="row mb-3 g-3">
        <div className="col-md-2">
          <label className="col-form-label fw-medium" htmlFor="joiningDate">入社日</label>
        </div>
        <div className="col-2">
          <Flatpickr className="form-select" id="joiningDate" options={dateOption}
            value={inputValues.joiningDate} name="joiningDate" placeholder="入社日" onChange={([date]) => handleOnDateChange(date, "joiningDate")} />
          <p className="input_error">{inputError.joiningDate}</p>
        </div>
      </div>
      {/* 基準日 */}
      <div className="row mb-3 g-3">
        <div className="col-md-2">
          <label className="col-form-label fw-medium" htmlFor="referenceDate">基準日</label>
        </div>
        <div className="col-2">
          <Flatpickr className="form-select" id="referenceDate" options={dateOption}
            value={inputValues.referenceDate} name="referenceDate" placeholder="基準日" onChange={([date]) => handleOnDateChange(date, "referenceDate")} />
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
      {/* 権限 */}
      <div className="row mb-3 g-3">
        <div className="col-md-2">
          <label className="col-form-label fw-medium">権限</label>
        </div>
        <div className="col">
          {
            AUTH_INPUT_MAP.map((map: any, index: number) => {
              return (
                <div className="form-check-inline" key={index}>
                  <input type="radio" className="btn-check" value={map.value} id={map.key} name={'auth'} autoComplete="off" checked={inputValues.auth == map.value} onChange={(e) => setInputValues({...inputValues, ['auth']: e.target.value})} disabled={getUserInfo().id == userPrimaryId}></input>
                  <label className="btn btn-outline-secondary btn-sm" htmlFor={map.key}>{map.name}</label>
                </div>
              )
            })
          }
        </div>
      </div>
      {/* パスワード */}
      <div className="row mb-3 g-3" hidden={!isNew}>
        <div className="col-md-2">
          <label className="col-form-label fw-medium" htmlFor="password">パスワード</label>
        </div>
        <div className="col-xl-4 col-6 pe-3 g-1">
          <input className="form-control" type="password" placeholder="パスワード" value={inputValues.password} name="password" id="password" onChange={(e) => handleOnChange(e)} />
          <p className="input_error">{inputError.password}</p>
        </div>
      </div>

      <div className="row mb-3 g-3" hidden={isNew}>
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
          </div>
        </div>
      </div>
      <GrantDaysModal userId={userPrimaryId} isShow={showGrantDaysModal} callback={callback}></GrantDaysModal>
    </>
  )
};
