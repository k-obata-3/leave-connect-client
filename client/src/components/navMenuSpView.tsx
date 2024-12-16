"use client"

import React, { useState } from 'react'
import { useCommonStore } from '@/app/store/CommonStore';
import { useUserInfoStore } from '@/app/store/UserInfoStore';
import { usePathname } from 'next/navigation';
import { useNotificationMessageStore } from '@/app/store/NotificationMessageStore';

type Props = {
  children: React.ReactNode,
  push: (e: React.MouseEvent<HTMLLIElement>) => void,
  next: (path: string) => void,
  back: () => void,
  isDisabledBackBtn: boolean | undefined,
  onLogout: () => void,
}

export default function NavMenuSpView({ children, push, next, back, isDisabledBackBtn, onLogout }: Props) {
  const pathname = usePathname();
  // 共通Sore
  const { getCommonObject } = useCommonStore();
  const { getUserInfo, isAdmin } = useUserInfoStore();
  const { getNotificationMessageObject } = useNotificationMessageStore();

  return (
    <>
      <div className="sub-navbar sub-navbar-sp row col-12 pt-2 me-2">
        <div className="col-1 text-start ms-2">
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={back} hidden={isDisabledBackBtn}>
            <i className="bi bi-chevron-left"><span className=""></span></i>
          </button>
        </div>
        <div className="col text-end me-4">
          <p className="mb-2 mt-1">
            <i className="bi bi-person-circle"></i>
            <span className="ms-2 me-3">{getUserInfo().lastName + ' ' + getUserInfo().firstName}</span>
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onLogout}>
              <span className="">ログアウト</span>
            </button>
          </p>
        </div>
      </div>
      <div className="content-parent-sp">
        <div className="content-sp">
          <nav className="nav menu-tab menu-tab-application mt-1 mb-2 nav-underline nav-justified" hidden={!isAdmin() || !(pathname === '/application/list' || pathname === '/admin/application/list')}>
            <div className={pathname === '/application/list' ? "col-6 nav-link active" : "col-6 nav-link"} onClick={() => next('/application/list')}>
              <span>申請一覧</span>
            </div>
            <div className={pathname === '/admin/application/list' ? "col-6 nav-link active" : "col-6 nav-link"} onClick={() => next('/admin/application/list')}>
              <span>申請管理</span>
            </div>
          </nav>
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
          {children}
        </div>
      </div>
      <div className="nav-menu-sp">
        <ul className="nav">
          <li className="nav-item" data-url="/dashboard" onClick={e=> push(e)}>
            <p className="nav-link">
              <i className="bi bi-columns-gap"></i>
              <span>ダッシュボード</span>
            </p>
          </li>
          <li className="nav-item" data-url="/application/list" onClick={e => push(e)}>
            <p className="nav-link">
              <span className="position-absolute translate-bottom badge rounded-pill bg-danger ms-2 mt-1" hidden={getCommonObject().actionRequiredApplicationCount == '0'}>{getCommonObject().actionRequiredApplicationCount}</span>
              <i className="bi bi-card-list"></i>
              <span>申請一覧</span>
            </p>
          </li>
          <li className="nav-item" data-url="/application/edit/new" onClick={() => next('/application/edit/new')}>
            <p className="nav-link">
              <i className="bi bi-plus-circle"></i>
              <span>新規申請</span>
            </p>
          </li>
          <li className="nav-item" data-url="/approval/list" onClick={e => push(e)}>
            <p className="nav-link">
              <span className="position-absolute translate-bottom badge rounded-pill bg-danger ms-2 mt-1" hidden={getCommonObject().approvalTaskCount == '0'}>{getCommonObject().approvalTaskCount}</span>
              <i className="bi bi-card-checklist"></i>
              <span>承認一覧</span>
            </p>
          </li>
          <li className="nav-item" data-url="/setting/user" onClick={() => next('/setting/user?tab=editPersonal')}>
            <p className="nav-link mb-0">
              <i className="bi bi-person-gear"></i>
              <span>個人設定</span>
            </p>
          </li>
        </ul>
      </div>
    </>
  )
};
