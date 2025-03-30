"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { useNotificationMessageStore } from '@/store/notificationMessageStore';
import utils from '@/assets/js/utils';
import { commonConst } from '@/consts/commonConst';
import { pageCommonConst } from '@/consts/pageCommonConst';
import { loginPageConst } from '@/consts/loginPageConst';
import { login, loginRequest } from '@/api/login';

export default function Login() {
  const router = useRouter();
  const { getNotificationMessageObject, setNotificationMessageObject } = useNotificationMessageStore();
  const [inputUserId, setInputUserId] = useState('');
  const [inputPassword, setInputPassword] = useState('');

  useEffect(() =>{

  }, [])

  /**
   * ログインボタン押下
   */
  const onLogin = async() => {
    const request: loginRequest = {
      user_id: inputUserId,
      password: utils.getHash(inputPassword),
    };

    const res = await login(request);
    if(res.responseResult) {
      setNotificationMessageObject({
        errorMessageList: [],
        inputErrorMessageList: [],
      })
      router.push(pageCommonConst.path.dashboard, {scroll: true});
    } else {
      setNotificationMessageObject({
        errorMessageList: res.message ? ["ユーザIDまたはパスワードが間違っています。"] : [],
        inputErrorMessageList: [],
      })
    }
  }

  const onTest = (userId: string) => {
    setInputUserId(userId)
    setInputPassword("password")
  }

  return (
    <div className="login-page">
      <div className="login-content-error">
        {/* その他のエラーメッセージ */}
        <div className="alert alert-danger p-3" role="alert" hidden={!getNotificationMessageObject().errorMessageList.length}>
          {
            getNotificationMessageObject().errorMessageList.filter(msg => msg).map((msg, index) => {
              return<p className="m-0" key={index}>{msg}</p>
            })
          }
        </div>
        {/* 入力エラーメッセージ */}
        <div className="alert alert-danger p-3" role="alert" hidden={!getNotificationMessageObject().inputErrorMessageList.length}>
          {
            getNotificationMessageObject().inputErrorMessageList.filter(msg => msg).map((msg, index) => {
              return<p className="m-0" key={index}>{msg}</p>
            })
          }
        </div>
      </div>
      <div className="login-content row">
        <div className="login-content-title">
          <h3>{commonConst.systemName}</h3>
        </div>

        {/* テスト用 */}
        <div className="row text-center text-white">
          <div className="col pb-3">
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" name="radios" id="admin1" value="" onChange={() => onTest('test01@test.abc.123')} />
              <label className="form-check-label" htmlFor="admin1">admin1</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" name="radios" id="guest1" value="" onChange={() => onTest('test02@test.abc.123')} />
              <label className="form-check-label" htmlFor="guest1">guest1</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" name="radios" id="guest2" value="" onChange={() => onTest('test03@test.abc.123')} />
              <label className="form-check-label" htmlFor="guest2">guest</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" name="radios" id="guest3" value="" onChange={() => onTest('test04@test.abc.123')} />
              <label className="form-check-label" htmlFor="guest3">guest</label>
            </div>
          </div>
        </div>

        <div className="col-10 col-md-5">
          <div className="form-floating mb-3">
            <input type="email" className="form-control" placeholder="name@example.com" value={inputUserId} onChange={(e) => setInputUserId(e.target.value)} />
            <label>{loginPageConst.label.userId}</label>
          </div>
          <div className="form-floating">
            <input type="password" className="form-control" placeholder="Password" value={inputPassword} onChange={(e) => setInputPassword(e.target.value)} />
            <label>{loginPageConst.label.password}</label>
          </div>
          <div className="col-8 offset-2 mt-5 d-grid">
            <button className="btn btn-secondary" onClick={onLogin}>{loginPageConst.button.login}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
