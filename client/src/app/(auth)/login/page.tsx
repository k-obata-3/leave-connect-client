"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
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
      password: inputPassword,
    };

    await login(request);
    router.push('/dashboard', {scroll: true});
  }

  return (
    <div className="login-content">
      <div className="row m-5">
        <div className="col-xl-10 offset-xl-1">
            <div className="row">
              <div className="card col-xl-6 offset-xl-3">
                <div className="card-body">
                  <h2 className="card-title mb-3">ログイン</h2>
                  <div className="form-floating mb-3">
                    <input type="email" className="form-control" placeholder="name@example.com" value={inputUserId} onChange={(e) => setInputUserId(e.target.value)} />
                    <label>ユーザID</label>
                  </div>
                  <div className="form-floating">
                    <input type="password" className="form-control" placeholder="Password" value={inputPassword} onChange={(e) => setInputPassword(e.target.value)} />
                    <label>パスワード</label>
                  </div>
                  <div className="col-8 offset-2 mt-3 d-grid">
                    <button className="btn btn-secondary" onClick={onLogin}>ログイン</button>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
