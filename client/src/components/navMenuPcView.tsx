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

  const onMenuClick = (e: React.MouseEvent<HTMLLIElement | HTMLDivElement>) => {
    showSlideMenu(false);
    push(e);
  }

  // スライドメニュー 表示/非表示
  const showSlideMenu = (containsSubItem: boolean, name: string | null = null) => {
    const slideMenu: any = document.getElementsByClassName('slide-menu');
    if(!containsSubItem) {
      // スライドメニューが一瞬表示されることを回避するための処理
      if(slideMenu[0].classList.contains('slide-in')) {
        slideMenu[0].classList.remove('slide-in');
        slideMenu[0].classList.add('slide-out');
      }

      return;
    }

    for (let index = 0; index < slideMenu[0]?.children.length; index++) {
      const classList = slideMenu[0]?.children[index].classList;
      if(classList.contains(name)) {
        classList.remove('d-none');
      } else {
        classList.add('d-none');
      }
    }

    if(!(slideMenu[0].classList.contains('slide-in') || slideMenu[0].classList.contains('slide-out'))) {
      slideMenu[0].classList.add('slide-in');
    } else if(slideMenu[0].classList.contains('slide-out')) {
      slideMenu[0].classList.remove('slide-out');
      slideMenu[0].classList.add('slide-in');
    } else {
      slideMenu[0].classList.remove('slide-in');
      slideMenu[0].classList.add('slide-out');
    }
  }

  return (
    <>
      {/* メインメニュー */}
      <div className="nav-menu">
        <ul className="nav flex-column mb-1">
          {/* ダッシュボード */}
          <li className="nav-item" data-url={pageCommonConst.path.dashboard} onClick={e => onMenuClick(e)}>
            <p className="nav-link">
              <i className="bi bi-columns-gap"></i>
              <span>{pageCommonConst.pageName.dashboard}</span>
            </p>
          </li>
          {/* 申請一覧 */}
          <li className="nav-item" data-url={pageCommonConst.path.application} onClick={e => onMenuClick(e)}>
            <p className="nav-link">
              <span className="position-absolute ms-2 mt-1 translate-bottom badge rounded-pill bg-danger" hidden={getCommonObject().actionRequiredApplicationCount == '0'}>{getCommonObject().actionRequiredApplicationCount}</span>
              <i className="bi bi-card-list"></i>
              <span>{pageCommonConst.pageName.application}</span>
            </p>
          </li>
          {/* 承認一覧 */}
          <li className="nav-item" data-url={pageCommonConst.path.approval} onClick={e => onMenuClick(e)}>
            <p className="nav-link">
              <span className="position-absolute ms-2 mt-1 translate-bottom badge rounded-pill bg-danger" hidden={getCommonObject().approvalTaskCount == '0'}>{getCommonObject().approvalTaskCount}</span>
              <i className="bi bi-card-checklist"></i>
              <span>{pageCommonConst.pageName.approval}</span>
            </p>
          </li>
          {/* 個人設定 */}
          <li className="nav-item">
            <p className="nav-link">
              <i className="bi bi-person-gear"></i>
              <span>{pageCommonConst.pageName.settingUser}</span>
            </p>
            {/* 個人設定 サブメニュー */}
            <div className="nav-item-sub">
                <div className="sub-item" data-url={pageCommonConst.path.settingUserEditPersonal} onClick={e => onMenuClick(e)}>
                  <p className="nav-link">{pageCommonConst.pageName.settingUserEditPersonal}</p>
                </div>
                <div className="sub-item" data-url={pageCommonConst.path.settingUserEditPassword} onClick={e => onMenuClick(e)}>
                  <p className="nav-link">{pageCommonConst.pageName.settingUserEditPassword}</p>
                </div>
              </div>
          </li>
        </ul>
        <div className="border-top border-dark-subtle" hidden={!isAdmin()}>
          <ul className="nav flex-column mt-1 mb-1">
            {/* 申請管理 */}
            <li className="nav-item" data-url={pageCommonConst.path.adminApplication} onClick={e => onMenuClick(e)}>
              <p className="nav-link">
                <i className="bi bi-list-check"></i>
                <span>{pageCommonConst.pageName.adminApplication}</span>
              </p>
            </li>
            {/* ユーザ管理 */}
            <li className="nav-item" data-url={pageCommonConst.path.user} onClick={e => onMenuClick(e)}>
              <p className="nav-link">
                <i className="bi bi-people"></i>
                <span>{pageCommonConst.pageName.user}</span>
              </p>
            </li>
            {/* システム管理 */}
            <li className="nav-item">
              <p className="nav-link">
                <i className="bi bi-gear"></i>
                <span>{pageCommonConst.pageName.settingSystem}</span>
              </p>
              {/* システム管理 サブメニュー */}
              <div className="nav-item-sub">
                <div className="sub-item" data-url={pageCommonConst.path.settingSystemGrantRule} onClick={e => onMenuClick(e)}>
                  <p className="nav-link">{pageCommonConst.pageName.settingSystemGrantRule}</p>
                </div>
                <div className="sub-item" data-url={pageCommonConst.path.settingSystemApprovalGroup} onClick={e => onMenuClick(e)}>
                  <p className="nav-link">{pageCommonConst.pageName.settingSystemApprovalGroup}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="border-top border-dark-subtle">
          <ul className="nav flex-column mt-1 mb-1">
            {/* スキル管理 */}
            <li className="nav-item" data-url={pageCommonConst.path.career} onClick={e => onMenuClick(e)}>
              <p className="nav-link">
                <i className="bi bi-person-workspace"></i>
                <span>{pageCommonConst.pageName.career}</span>
              </p>
            </li>
          </ul>
        </div>

        <div className="border-top border-dark-subtle">
          <ul className="nav flex-column mt-1 mb-1">
            {/* ログアウト */}
            <li className="nav-item" onClick={onLogout}>
              <p className="nav-link">
                <i className="bi bi-box-arrow-right"></i>
                <span>{pageCommonConst.pageName.logout}</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div className="content-parent">
        {/* スライドメニュー */}
        <div className="slide-menu">

        </div>
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
