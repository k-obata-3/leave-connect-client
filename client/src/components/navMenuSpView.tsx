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
  push: (e: React.MouseEvent<HTMLLIElement>) => void,
  next: (path: string) => void,
}

export default function NavMenuSpView({ children, push, next }: Props) {
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
  },[pathname, searchParams])

  useEffect(() =>{
    setSubHeaderUserName(getUserInfo().firstName, getUserInfo().lastName);
  },[getUserInfo().id])

  return (
    <>
      <div className="content-parent-sp">
        {/* 申請一覧メニュータブ */}
        <nav className="nav menu-tab menu-tab-application mt-1 mb-2 nav-underline nav-justified" hidden={!isAdmin() || !((pathname === pageCommonConst.path.application || pathname === pageCommonConst.path.adminApplication) && !searchParams?.get(pageCommonConst.param.applicationId))}>
          <div className={pathname === pageCommonConst.path.application ? "col-6 nav-link active" : "col-6 nav-link"} onClick={() => next(pageCommonConst.path.application)}>
            <span>{pageCommonConst.pageName.application}</span>
          </div>
          <div className={pathname === pageCommonConst.path.adminApplication ? "col-6 nav-link active" : "col-6 nav-link"} onClick={() => next(pageCommonConst.path.adminApplication)}>
            <span>{pageCommonConst.pageName.adminApplication}</span>
          </div>
        </nav>
        {/* 個人設定メニュータブ */}
        <nav className="nav menu-tab menu-tab-application mt-1 mb-2 nav-underline nav-justified" hidden={pathname !== pageCommonConst.path.settingUser}>
          <div className={searchParams.get(pageCommonConst.param.tab) === pageCommonConst.tabName.editPersonal ? "col-6 nav-link active" : "col-6 nav-link"} onClick={() => next(pageCommonConst.path.settingUserEditPersonal)}>
            <span>{pageCommonConst.pageName.settingUserEditPersonal}</span>
          </div>
          <div className={searchParams.get(pageCommonConst.param.tab) === pageCommonConst.tabName.editPassword ? "col-6 nav-link active" : "col-6 nav-link"} onClick={() => next(pageCommonConst.path.settingUserEditPassword)}>
            <span>{pageCommonConst.pageName.settingUserEditPassword}</span>
          </div>
        </nav>
        {/* コンテンツ表示エリア */}
        <div className="content-sp">
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
        {/* メインメニュー */}
        <div className="nav-menu-sp">
          <ul className="nav">
            <li className="nav-item" data-url={pageCommonConst.path.dashboard} onClick={e=> push(e)}>
              <p className="nav-link">
                <i className="bi bi-columns-gap"></i>
                <span>{pageCommonConst.pageName.dashboard}</span>
              </p>
            </li>
            <li className="nav-item" data-url={pageCommonConst.path.application} onClick={e => push(e)}>
              <p className="nav-link">
                <span className="position-absolute translate-bottom badge rounded-pill bg-danger ms-2 mt-1" hidden={getCommonObject().actionRequiredApplicationCount == '0'}>{getCommonObject().actionRequiredApplicationCount}</span>
                <i className="bi bi-card-list"></i>
                <span>{pageCommonConst.pageName.application}</span>
              </p>
            </li>
            <li className="nav-item" data-url={pageCommonConst.path.applicationNew} onClick={e => push(e)}>
              <p className="nav-link">
                <i className="bi bi-plus-circle"></i>
                <span>{pageCommonConst.pageName.applicationNew}</span>
              </p>
            </li>
            <li className="nav-item" data-url={pageCommonConst.path.approval} onClick={e => push(e)}>
              <p className="nav-link">
                <span className="position-absolute translate-bottom badge rounded-pill bg-danger ms-2 mt-1" hidden={getCommonObject().approvalTaskCount == '0'}>{getCommonObject().approvalTaskCount}</span>
                <i className="bi bi-card-checklist"></i>
                <span>{pageCommonConst.pageName.approval}</span>
              </p>
            </li>
            <li className="nav-item" data-url={pageCommonConst.path.settingUser} onClick={() => next(pageCommonConst.path.settingUserEditPersonal)}>
              <p className="nav-link mb-0">
                <i className="bi bi-person-gear"></i>
                <span>{pageCommonConst.pageName.settingUser}</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
};
