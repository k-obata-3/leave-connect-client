"use client"

import React, { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation';

import { useCommonStore } from '@/store/commonStore';
import { useUserInfoStore } from '@/store/userInfoStore';
import { useNotificationMessageStore } from '@/store/notificationMessageStore';
import useSetSubHeaderUserName from '@/hooks/useSetSubHeaderUserName';
import { pageCommonConst } from '@/consts/pageCommonConst';

type Props = {
  children: React.ReactNode,
  push: (e: React.MouseEvent<HTMLLIElement | HTMLDivElement>) => void,
  onLogout: () => void,
}

export default function NavMenuPcView({ children, push, onLogout }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 共通Store
  const { getCommonObject } = useCommonStore();
  const { getUserInfo, isAdmin } = useUserInfoStore();
  const { getNotificationMessageObject, setNotificationMessageObject } = useNotificationMessageStore();
  //  カスタムフック
  const setSubHeaderUserName = useSetSubHeaderUserName();

  useEffect(() =>{
    const contentParent = document.getElementsByClassName('content-parent');
    if(contentParent.length){
      contentParent[0].scroll({
        top: 0,
        behavior: "instant",
      })
    }

    window.scroll({
      top: 0,
      behavior: "instant",
    });
    setNotificationMessageObject({
      errorMessageList: [],
      inputErrorMessageList: [],
    })

    setSubHeaderUserName(getUserInfo().firstName, getUserInfo().lastName);
  },[pathname, searchParams])

  useEffect(() =>{
    setSubHeaderUserName(getUserInfo().firstName, getUserInfo().lastName);
  },[getUserInfo().id])

  return (
    <>
      {/* メインメニュー */}
      <div className="nav-menu">
        <ul className="nav flex-column mb-3">
          <li className="nav-item" data-url={pageCommonConst.path.dashboard} onClick={e => push(e)}>
            <p className="nav-link">
              <i className="bi bi-columns-gap"></i>
              <span>{pageCommonConst.pageName.dashboard}</span>
            </p>
          </li>
          <li className="nav-item" data-url={pageCommonConst.path.application} onClick={e => push(e)}>
            <p className="nav-link">
              <span className="position-absolute ms-2 mt-1 translate-bottom badge rounded-pill bg-danger" hidden={getCommonObject().actionRequiredApplicationCount == '0'}>{getCommonObject().actionRequiredApplicationCount}</span>
              <i className="bi bi-card-list"></i>
              <span>{pageCommonConst.pageName.application}</span>
            </p>
          </li>
          <li className="nav-item" data-url={pageCommonConst.path.approval} onClick={e => push(e)}>
            <p className="nav-link">
              <span className="position-absolute ms-2 mt-1 translate-bottom badge rounded-pill bg-danger" hidden={getCommonObject().approvalTaskCount == '0'}>{getCommonObject().approvalTaskCount}</span>
              <i className="bi bi-card-checklist"></i>
              <span>{pageCommonConst.pageName.approval}</span>
            </p>
          </li>
          <li className="nav-item nav-item-contains-sub">
            <p className="nav-link" data-url={pageCommonConst.path.settingUser}>
              <i className="bi bi-person-gear"></i>
              <span>{pageCommonConst.pageName.settingUser}</span>
            </p>
              <div className="nav-item-sub">
                <div className="sub-item" data-url={pageCommonConst.path.settingUserEditPersonal} onClick={e => push(e)}>
                  <p className="nav-link">{pageCommonConst.pageName.settingUserEditPersonal}</p>
                </div>
                <div className="sub-item" data-url={pageCommonConst.path.settingUserEditPassword} onClick={e => push(e)}>
                  <p className="nav-link">{pageCommonConst.pageName.settingUserEditPassword}</p>
                </div>
              </div>
          </li>
        </ul>
        <div className="border-top border-dark-subtle mt-3 mb-3" hidden={!isAdmin()}>
          <ul className="nav flex-column mt-3 mb-3">
            <li className="nav-item" data-url={pageCommonConst.path.adminApplication} onClick={e => push(e)}>
              <p className="nav-link">
                <i className="bi bi-list-check"></i>
                <span>{pageCommonConst.pageName.adminApplication}</span>
              </p>
            </li>
            <li className="nav-item" data-url={pageCommonConst.path.user} onClick={e => push(e)}>
              <p className="nav-link">
                <i className="bi bi-people"></i>
                <span>{pageCommonConst.pageName.user}</span>
              </p>
            </li>
            <li className="nav-item nav-item-contains-sub">
              <p className="nav-link" data-url={pageCommonConst.path.settingSystem}>
                <i className="bi bi-gear"></i>
                <span>{pageCommonConst.pageName.settingSystem}</span>
              </p>
              <div className="nav-item-sub">
                <div className="sub-item" data-url={pageCommonConst.path.settingSystemGrantRule} onClick={e => push(e)}>
                  <p className="nav-link">{pageCommonConst.pageName.settingSystemGrantRule}</p>
                </div>
                <div className="sub-item" data-url={pageCommonConst.path.settingSystemApprovalGroup} onClick={e => push(e)}>
                  <p className="nav-link">{pageCommonConst.pageName.settingSystemApprovalGroup}</p>
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
      <div className="content-parent">
        {/* コンテンツ表示エリア */}
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
