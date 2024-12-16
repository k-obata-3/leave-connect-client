"use client"

import React from 'react'
import { useCommonStore } from '@/app/store/CommonStore';
import { useUserInfoStore } from '@/app/store/UserInfoStore';
import { useNotificationMessageStore } from '@/app/store/NotificationMessageStore';

type Props = {
  children: React.ReactNode,
  push: (e: React.MouseEvent<HTMLLIElement | HTMLDivElement>) => void,
  back: () => void,
  isDisabledBackBtn: boolean | undefined,
  onLogout: () => void,
}

export default function NavMenuPcView({ children, push, back, isDisabledBackBtn, onLogout }: Props) {
  // 共通Sore
  const { getCommonObject } = useCommonStore();
  const { getUserInfo, isAdmin } = useUserInfoStore();
  const { getNotificationMessageObject } = useNotificationMessageStore();

  return (
    <>
      <div className="nav-menu">
        <ul className="nav flex-column mb-3">
          <li className="nav-item" data-url="/dashboard" onClick={e => push(e)}>
            <p className="nav-link">
              <i className="bi bi-columns-gap"></i>
              <span>ダッシュボード</span>
            </p>
          </li>
          <li className="nav-item" data-url="/application/list" onClick={e => push(e)}>
            <p className="nav-link">
              <span className="position-absolute ms-2 mt-1 translate-bottom badge rounded-pill bg-danger" hidden={getCommonObject().actionRequiredApplicationCount == '0'}>{getCommonObject().actionRequiredApplicationCount}</span>
              <i className="bi bi-card-list"></i>
              <span>申請一覧</span>
            </p>
          </li>
          <li className="nav-item" data-url="/approval/list" onClick={e => push(e)}>
            <p className="nav-link">
              <span className="position-absolute ms-2 mt-1 translate-bottom badge rounded-pill bg-danger" hidden={getCommonObject().approvalTaskCount == '0'}>{getCommonObject().approvalTaskCount}</span>
              <i className="bi bi-card-checklist"></i>
              <span>承認一覧</span>
            </p>
          </li>
          <li className="nav-item nav-item-contains-sub">
            <p className="nav-link" data-url="/setting/user">
              <i className="bi bi-person-gear"></i>
              <span>個人設定</span>
            </p>
              <div className="nav-item-sub">
                <div className="sub-item" data-url="/setting/user?tab=editPersonal" onClick={e => push(e)}>
                  <p className="nav-link">個人情報編集</p>
                </div>
                <div className="sub-item" data-url="/setting/user?tab=editPassword" onClick={e => push(e)}>
                  <p className="nav-link">パスワード変更</p>
                </div>
              </div>
          </li>
        </ul>
        <div className="border-top border-dark-subtle mt-3 mb-3" hidden={!isAdmin()}>
          <ul className="nav flex-column mt-3 mb-3">
            <li className="nav-item" data-url="/admin/application/list" onClick={e => push(e)}>
              <p className="nav-link">
                <i className="bi bi-list-check"></i>
                <span>申請管理</span>
              </p>
            </li>
            <li className="nav-item" data-url="/user/list" onClick={e => push(e)}>
              <p className="nav-link">
                <i className="bi bi-people"></i>
                <span>ユーザ管理</span>
              </p>
            </li>
            <li className="nav-item nav-item-contains-sub">
              <p className="nav-link" data-url="/setting/system">
                <i className="bi bi-gear"></i>
                <span>システム管理</span>
              </p>
              <div className="nav-item-sub">
                <div className="sub-item" data-url="/setting/system?tab=grantRule" onClick={e => push(e)}>
                  <p className="nav-link">付与日数設定</p>
                </div>
                <div className="sub-item" data-url="/setting/system?tab=approvalGroup" onClick={e => push(e)}>
                  <p className="nav-link">承認グループ設定</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="border-top border-dark-subtle mt-3 mb-3">
          <ul className="nav flex-column mt-3 mb-3">
            <li className="nav-item" onClick={onLogout}>
              <p className="nav-link">
                <i className="bi bi-box-arrow-right"></i>
                <span>ログアウト</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div className="sub-navbar row col-12 pt-2 me-2">
        <div className="col-1 text-start ms-2">
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={back} hidden={isDisabledBackBtn}>
            <i className="bi bi-chevron-left"><span className=""></span></i>
          </button>
        </div>
        <div className="col text-end me-4">
          <p className="mb-2 mt-1">
            <i className="bi bi-person-circle"></i>
            <span className="ms-2">{getUserInfo().lastName + ' ' + getUserInfo().firstName}</span>
          </p>
        </div>
      </div>
      <div className="content-parent">
        <div className="content">
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
    </>
  )
};
