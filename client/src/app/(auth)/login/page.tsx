"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import utils from '@/assets/js/utils';
import { pageCommonConst } from '@/consts/pageCommonConst';
import { loginPageConst } from '@/consts/loginPageConst';
import { login, loginRequest } from '@/api/login';

export default function Login() {
  const router = useRouter();
  const [inputUserId, setInputUserId] = useState('test01@test.abc.123');
  const [inputPassword, setInputPassword] = useState('password');

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
      router.push(pageCommonConst.path.dashboard, {scroll: true});
    }
  }

  return (
    <div className="login-content">
      <div className="row">
        <div className="card col-12 col-md-8 offset-md-2">
          <div className="card-body">
            <h2 className="card-title mb-3">{pageCommonConst.pageName.login}</h2>
            <div className="form-floating mb-3">
              <input type="email" className="form-control" placeholder="name@example.com" value={inputUserId} onChange={(e) => setInputUserId(e.target.value)} />
              <label>{loginPageConst.label.userId}</label>
            </div>
            <div className="form-floating">
              <input type="password" className="form-control" placeholder="Password" value={inputPassword} onChange={(e) => setInputPassword(e.target.value)} />
              <label>{loginPageConst.label.password}</label>
            </div>
            <div className="col-8 offset-2 mt-3 d-grid">
              <button className="btn btn-secondary" onClick={onLogin}>{loginPageConst.button.login}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
