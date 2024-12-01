"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation'
import { logout } from '@/api/logout';
import utils from '@/assets/js/utils';
import { getLoginUserInfo, getLoginUserInfoResponse } from '@/api/getLoginUserInfo';
import { useUserInfoStore } from '../store/UserInfoStore';
import { useCommonStore } from '../store/CommonStore';
import { getNotification, GetNotificationResponse } from '@/api/getNotification';
import { useMediaQuery } from 'react-responsive'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isDisabledBackBtn, setIsDisabledBackBtn] = useState(true);
  const { setUserInfo, getUserInfo, isAdmin } = useUserInfoStore();
  const { setCommonObject, getCommonObject } = useCommonStore();
  const [showOtherMenu, setShowOtherMenu] = useState(false);
  const [isCompleteLoad, setIsCompleteLoad] = useState(false);

  const isSp = useMediaQuery({
    query: '(max-width: 1023px)'
  })

  const routePageList = ['/dashboard', '/application/list', '/application/edit/new', '/approval/list', '/admin/application/list', '/user/list', '/setting/system', '/setting/user'];

  useEffect(() =>{
    (async() => {
      await getLoginUserInfo().then(async(res: getLoginUserInfoResponse) => {
        if(res.responseResult) {
          setUserInfo(res);

          await getNotification().then((res: GetNotificationResponse) => {
            if(res.responseResult) {
              setCommonObject({
                errorMessage: getCommonObject().errorMessage,
                actionRequiredApplicationCount: res?.actionRequiredApplicationCount,
                approvalTaskCount: res.approvalTaskCount,
                activeApplicationCount: res.activeApplicationCount,
              });
            }
          })
        } else {
          router.replace('/', {scroll: true});
        }
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
    setIsCompleteLoad(true)
  }, [pathname, isCompleteLoad])

  const onLogout = async() => {
    const res = await logout();
    router.replace('/', {scroll: true});
  };

  const push = (e: any) => {
    const nextPath = e.currentTarget.getAttribute('data-url');
    if(nextPath && nextPath != utils.getSessionStorage('currentPathname')) {
      setNavItems(nextPath);
      next(nextPath);
    }
    setShowOtherMenu(false);
  };

  const next = (nextPath: string) => {
    setShowOtherMenu(false);
    router.replace(nextPath, {scroll: true});
  };

  const back = () => {
    if(!routePageList.includes(pathname)) {
      router.back();
    }
  };

  const setNavItems = (pathName: string) => {
    const currentClassName = 'current-nav-item';
    const navItems: any = document.getElementsByClassName('nav-item');
    for (let index = 0; index < navItems.length; index++) {
      const subItems: any = navItems[index].getElementsByClassName('nav-item-sub');
      let isSubItem = false;
      if(subItems.length) {
        const subItemUri = subItems[0].children[0].getAttribute('data-url')?.substring(0, subItems[0].children[0].getAttribute('data-url').indexOf('?'));
        isSubItem = subItemUri && pathName?.includes(subItemUri);
      }

      if(pathName === navItems[index].getAttribute('data-url') || isSubItem) {
        navItems[index].classList.add(currentClassName);
      } else {
        navItems[index].classList.remove(currentClassName);
      }
    }
  }

  const createSubHeaderView = () => {
    return (
      <>
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
      </>
    )
  }

  const createSpOtherMenu = () => {
    return (
      <>
        <li className="nav-item" data-url="/admin/application/list" onClick={(e: any) => push(e)} hidden={!isAdmin()}>
          <p className="nav-link mb-0">
            <i className="bi bi-list-check"></i>
            <span>申請管理</span>
          </p>
        </li>
        <li className="nav-item" data-url="/setting/user" onClick={() => next('/setting/user?tab=editPersonal')}>
          <p className="nav-link mb-0">
            <i className="bi bi-person-gear"></i>
            <span>個人設定</span>
          </p>
        </li>
        <li className="nav-item" onClick={onLogout}>
          <p className="nav-link mb-0">
            <i className="bi bi-box-arrow-right"></i>
            <span>ログアウト</span>
          </p>
        </li>
      </>
    )
  }

  if (isCompleteLoad && !isSp) {
    // PCサイズ専用レイアウト
    return (
      <div>
        <div className="nav-menu">
          <ul className="nav flex-column mb-3">
            <li className="nav-item" data-url="/dashboard" onClick={(e: any) => push(e)}>
              <p className="nav-link">
                <i className="bi bi-columns-gap"></i>
                <span>ダッシュボード</span>
              </p>
            </li>
            <li className="nav-item" data-url="/application/list" onClick={(e: any) => push(e)}>
              <p className="nav-link">
                <span className="position-absolute ms-2 mt-1 translate-bottom badge rounded-pill bg-danger" hidden={getCommonObject().actionRequiredApplicationCount == '0'}>{getCommonObject().actionRequiredApplicationCount}</span>
                <i className="bi bi-card-list"></i>
                <span>申請一覧</span>
              </p>
            </li>
            <li className="nav-item" data-url="/approval/list" onClick={(e: any) => push(e)}>
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
                  <div className="sub-item" data-url="/setting/user?tab=editPersonal" onClick={(e: any) => push(e)}>
                    <p className="nav-link">個人情報編集</p>
                  </div>
                  <div className="sub-item" data-url="/setting/user?tab=editPassword" onClick={(e: any) => push(e)}>
                    <p className="nav-link">パスワード変更</p>
                  </div>
                </div>
            </li>
          </ul>

          <div className="border-top border-dark-subtle mt-3 mb-3" hidden={!isAdmin()}>
            <ul className="nav flex-column mt-3 mb-3">
              <li className="nav-item" data-url="/admin/application/list" onClick={(e: any) => push(e)}>
                <p className="nav-link">
                  <i className="bi bi-list-check"></i>
                  <span>申請管理</span>
                </p>
              </li>
              <li className="nav-item" data-url="/user/list" onClick={(e: any) => push(e)}>
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
                  <div className="sub-item" data-url="/setting/system?tab=grantRule" onClick={(e: any) => push(e)}>
                    <p className="nav-link">付与日数設定</p>
                  </div>
                  <div className="sub-item" data-url="/setting/system?tab=approvalGroup" onClick={(e: any) => push(e)}>
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
          {createSubHeaderView()}
        </div>
        <div className="content-parent">
          <div className="content">
            <div className="alert alert-danger p-3" role="alert" hidden={!getCommonObject().errorMessage}>
              <p className="mb-0">{getCommonObject().errorMessage}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    )
  } else if(isCompleteLoad && isSp) {
    // SPサイズ専用レイアウト
    return (
      <>
        <div className="sub-navbar sub-navbar-sp row col-12 pt-2 me-2">
          {createSubHeaderView()}
        </div>
        <div className="content-parent-sp">
          <div className="content-sp">
            <div className="alert alert-danger p-3" role="alert" hidden={!getCommonObject().errorMessage}>
              <p className="mb-0">{getCommonObject().errorMessage}</p>
            </div>
            {children}
          </div>
        </div>
        <div className="nav-menu-sp">
          <ul className="nav sp-other-menu" hidden={!showOtherMenu}>
            {createSpOtherMenu()}
          </ul>
          <ul className="nav">
            <li className="nav-item" data-url="/dashboard" onClick={(e: any) => push(e)}>
              <p className="nav-link">
                <i className="bi bi-columns-gap"></i>
                <span>ダッシュボード</span>
              </p>
            </li>
            <li className="nav-item" data-url="/application/list" onClick={(e: any) => push(e)}>
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
            <li className="nav-item" data-url="/approval/list" onClick={(e: any) => push(e)}>
              <p className="nav-link">
                <span className="position-absolute translate-bottom badge rounded-pill bg-danger ms-2 mt-1" hidden={getCommonObject().approvalTaskCount == '0'}>{getCommonObject().approvalTaskCount}</span>
                <i className="bi bi-card-checklist"></i>
                <span>承認一覧</span>
              </p>
            </li>
            <li className="nav-item" onClick={()=> setShowOtherMenu(!showOtherMenu)}>
              <p className="nav-link">
                <i className="bi bi-three-dots"></i>
                <span>その他</span>
              </p>
            </li>
          </ul>
        </div>
      </>
    )
  } else {
    return(
      <></>
    )
  }
}
