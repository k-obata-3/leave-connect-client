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
import { commonConst } from '@/consts/commonConst';
import { pageCommonConst } from '@/consts/pageCommonConst';
import { confirmModalConst } from '@/consts/confirmModalConst';
import utils from '@/assets/js/utils';
import { SaveUserRequest, saveUser } from '@/api/saveUser';
import { getUserDetails, getUserDetailsRequest, UserDetails } from '@/api/getUserDetails';
import GrantDaysModal from './grantDaysModal';
import RegulateDaysModal from './regulateDaysModal';

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
  const [showRegulateDaysModal, setShowRegulateDaysModal] = useState(false);
  const [isLoadComplete, setIsLoadComplete] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails>()
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
    closeRegulateDaysModal();

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
      const utcDateOfBirth = new Date(res.userDetails.dateOfBirth);
      const utcJoiningDate = new Date(res.userDetails.joiningDate);
      const utcReferenceDate = new Date(res.userDetails.referenceDate);
      setUserDetails(res.userDetails);
      setInputValues({
        ...inputValues,
        userId: res.userDetails.userId,
        firstName: res.userDetails.firstName,
        lastName: res.userDetails.lastName,
        firstNameKana: res.userDetails.firstNameKana,
        lastNameKana: res.userDetails.lastNameKana,
        dateOfBirth: new Date(utcDateOfBirth.getUTCFullYear(), utcDateOfBirth.getMonth(), utcDateOfBirth.getDate()).toLocaleDateString('ja-JP'),
        joiningDate: new Date(utcJoiningDate.getUTCFullYear(), utcJoiningDate.getMonth(), utcJoiningDate.getDate()).toLocaleDateString('ja-JP'),
        referenceDate: new Date(utcReferenceDate.getUTCFullYear(), utcReferenceDate.getMonth(), utcReferenceDate.getDate()).toLocaleDateString('ja-JP'),
        workingDays: res.userDetails.workingDays,
        auth: res.userDetails.auth,
      });
      
      if(res.userDetails.status != commonConst.USER_EFFECTIVE_STATUS) {
        setNotificationMessageObject({
          errorMessageList: ["無効なユーザのため編集できません。"],
          inputErrorMessageList: [],
        })
      }
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

  /**
   * 日数調整ボタン押下
   */
  const onRegulateDays = () => {
    setShowRegulateDaysModal(true);
  }

  const closeRegulateDaysModal = () => {
    setShowRegulateDaysModal(false);
  };

  const callback = async(reload: boolean) => {
    if(reload) {
      // 更新後のユーザ情報を取得
      getUser();
      onReload();
    }

    closeGrantDaysModal();
    closeRegulateDaysModal();
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
        router.replace(pageCommonConst.path.adminUser, {scroll: true});
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
          <button className="btn btn-outline-secondary" onClick={onRegulateDays} hidden={isNew || userDetails?.status != commonConst.USER_EFFECTIVE_STATUS}>日数調整</button>
          <button className="btn btn-outline-success ms-2" onClick={onUpdateGrantDays} hidden={isNew || userDetails?.status != commonConst.USER_EFFECTIVE_STATUS}>休暇付与</button>
          <button className="btn btn-outline-primary ms-2" onClick={onSubmit} hidden={userDetails && userDetails?.status != commonConst.USER_EFFECTIVE_STATUS}>保存</button>
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
            value={inputValues.joiningDate} name="joiningDate" placeholder="入社日" onChange={([date]) => handleOnDateChange(date, "joiningDate")} disabled={!!userPrimaryId} />
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
            value={inputValues.referenceDate} name="referenceDate" placeholder="基準日" onChange={([date]) => handleOnDateChange(date, "referenceDate")} disabled={!!userPrimaryId} />
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
          <p className="text-nowrap mb-1">
            <span className="me-2 fw-bold">対象期間:</span>
            <span hidden={!userDetails?.periodStart}>
              <span>{userDetails?.periodStart}</span>
              <span className="ms-1 me-1">～</span>
              <span>{userDetails?.periodEnd}</span>
            </span>
            <span hidden={!!userDetails?.periodStart}>{userDetails?.periodStart}-</span>
          </p>
          <table className="table">
            <thead className="table-light">
              <tr className="text-center" style={{lineHeight: "0.75rem"}}>
              <th scope="row">付与日数</th>
              <th scope="row">有給残日数</th>
                <th scope="row">有給取得日数</th>
                <th scope="row">時間単位の有給取得</th>
                
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center" style={{lineHeight: "0.5rem"}}>
                  <p className="text-nowrap">{userDetails?.totalAddDays}日</p>
                </td>
                <td className="text-center" style={{lineHeight: "0.5rem"}}>
                  <p className="text-nowrap">{userDetails?.totalRemainingDays}日</p>
                </td>
                <td className="text-center" style={{lineHeight: "0.5rem"}}>
                  <p className="text-nowrap">{userDetails?.totalDeleteDays}日</p>
                </td>
                <td className="text-center" style={{lineHeight: "0.5rem"}}>
                  <p className="text-nowrap">{userDetails?.totalDeleteTimes}時間</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <GrantDaysModal userDetails={userDetails} isShow={showGrantDaysModal} callback={callback}></GrantDaysModal>
      <RegulateDaysModal userDetails={userDetails} isShow={showRegulateDaysModal} callback={callback}></RegulateDaysModal>
    </>
  )
};
