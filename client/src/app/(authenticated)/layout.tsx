"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation'
import { logout } from '@/api/logout';
import utils from '@/assets/js/utils';
import { getLoginUserInfo } from '@/api/getLoginUserInfo';
import { useUserInfoStore } from '../store/UserInfoStore';
import { useCommonStore } from '../store/CommonStore';
import { getNotification, GetNotificationResponse } from '@/api/getNotification';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isDisabledBackBtn, setIsDisabledBackBtn] = useState(false);
  const { setUserInfo, isAdmin } = useUserInfoStore();
  const { setCommonObject, getCommonObject } = useCommonStore();

  const routePageList = ['/dashboard', '/application/list', '/approval/list', '/admin/application/list', '/user/list', '/setting/system', '/setting/user'];

  useEffect(() =>{
    (async() => {
      await getLoginUserInfo().then(async(res) => {
        setUserInfo(res);
      }).catch (() => {
        router.replace('/', {scroll: true});
      })

      await getNotification().then(async(res: GetNotificationResponse) => {
        setCommonObject({
          errorMessage: "",
          actionRequiredApplicationCount: res.actionRequiredApplicationCount,
          approvalTaskCount: res.approvalTaskCount,
          activeApplicationCount: res.activeApplicationCount,
        });
      })
    })
    ();
  }, [])

  useEffect(() =>{
    if(routePageList.includes(pathname)) {
      setIsDisabledBackBtn(true);
      setNavItems(pathname);
      utils.setSessionStorage('currentRoutePage', pathname);
    } else {
      setIsDisabledBackBtn(false);
      setNavItems(utils.getSessionStorage('currentRoutePage'));
    }

    utils.setSessionStorage('currentPathname', pathname);
    setCommonObject({
      errorMessage: '',
      actionRequiredApplicationCount: getCommonObject().actionRequiredApplicationCount,
      approvalTaskCount: getCommonObject().approvalTaskCount,
      activeApplicationCount: getCommonObject().activeApplicationCount,
    })
  }, [pathname])

  const onLogout = async() => {
    const res = await logout();
    router.replace('/', {scroll: true});
  };

  const push = (e: any) => {
    const nextPath = e.target.getAttribute('data-url');
    if(nextPath) {
      setNavItems(nextPath);
      router.replace(nextPath, {scroll: true});
    }
  };

  const setNavItems = (pathName: string) => {
    const currentClassName = 'current-nav-item';
    const navItems: any = document.getElementsByClassName('nav-item');
    for (let index = 0; index < navItems.length; index++) {
      const subItems: any = navItems[index].getElementsByClassName('sub-item');
      let isSubItem = false;
      if(subItems.length) {
        const subItemUri = subItems[0].children[0].getAttribute('data-url').substr(0, subItems[0].children[0].getAttribute('data-url').indexOf('?'));
        isSubItem = subItemUri && subItemUri === pathName?.substr(0, pathName.indexOf('?'));
      }

      if(pathName === navItems[index].children[0].getAttribute('data-url') || isSubItem) {
        navItems[index].children[0].classList.add(currentClassName);
      } else {
        navItems[index].children[0].classList.remove(currentClassName);
      }
    }
  }

  const back = () => {
    if(!routePageList.includes(pathname)) {
      router.back();
    }
  };

  return (
    <>
      <div className="nav-menu">
        <div className="d-grid mt-2 mb-2 ms-4 me-4">
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={back} disabled={isDisabledBackBtn}>戻る</button>
        </div>

        <ul className="nav flex-column mb-3">
          <li className="nav-item">
            <p className="nav-link" data-url="/dashboard" onClick={(e: any) => push(e)}>ダッシュボード</p>
          </li>
          <li className="nav-item">
            <p className="nav-link" data-url="/application/list" onClick={(e: any) => push(e)}>申請一覧
              <span className="position-absolute ms-2 translate-bottom badge rounded-pill bg-danger">{getCommonObject().actionRequiredApplicationCount}</span>
            </p>
          </li>
          <li className="nav-item">
            <p className="nav-link" data-url="/approval/list" onClick={(e: any) => push(e)}>承認一覧
              <span className="position-absolute ms-2 translate-bottom badge rounded-pill bg-danger">{getCommonObject().approvalTaskCount}</span>
            </p>
          </li>
          <li className="nav-item nav-item-contains-sub">
            <p className="nav-link" data-url="/setting/user">個人設定</p>
              <div className="nav-item-sub">
                <div className="sub-item">
                  <p className="nav-link" data-url="/setting/user?tab=editPersonal" onClick={(e: any) => push(e)}>個人情報編集</p>
                </div>
                <div className="sub-item">
                  <p className="nav-link" data-url="/setting/user?tab=editPassword" onClick={(e: any) => push(e)}>パスワード変更</p>
                </div>
              </div>
          </li>
        </ul>

        <div className="border-top border-dark-subtle mt-3 mb-3" hidden={!isAdmin()}>
          <ul className="nav flex-column mt-3 mb-3">
            <li className="nav-item">
              <p className="nav-link" data-url="/admin/application/list" onClick={(e: any) => push(e)}>申請管理</p>
            </li>
            <li className="nav-item">
              <p className="nav-link" data-url="/user/list" onClick={(e: any) => push(e)}>ユーザ管理</p>
            </li>
            <li className="nav-item nav-item-contains-sub">
              <p className="nav-link" data-url="/setting/system">システム管理</p>
              <div className="nav-item-sub">
                <div className="sub-item">
                  <p className="nav-link" data-url="/setting/system?tab=grantRule" onClick={(e: any) => push(e)}>付与日数設定</p>
                </div>
                <div className="sub-item">
                  <p className="nav-link" data-url="/setting/system?tab=approvalGroup" onClick={(e: any) => push(e)}>承認グループ設定</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="border-top border-dark-subtle mt-3 mb-3">
          <ul className="nav flex-column mt-3 mb-3">
            <li className="nav-item">
              <p className="nav-link" onClick={onLogout}>ログアウト</p>
            </li>
          </ul>
        </div>
      </div>
      <div className="content-parent">
        <div className="content">
          <div className="alert alert-danger p-3" role="alert" hidden={!getCommonObject().errorMessage}>
            <p className="mb-0">{getCommonObject().errorMessage}</p>
          </div>
          {children}
        </div>
      </div>
    </>
  )
}
