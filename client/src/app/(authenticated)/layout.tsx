"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation'
import { useMediaQuery } from 'react-responsive'

import { useCommonStore } from '@/store/commonStore';
import { useUserInfoStore } from '@/store/userInfoStore';
import { useUserNameListStore } from '@/store/userNameListStore';
import { useApplicationTypeStore } from '@/store/applicationTypeStore';
import { useNotificationMessageStore } from '@/store/notificationMessageStore';
import { SubHeaderProvider } from '@/contexts/subHeaderProvider';
import useConfirm from '@/hooks/useConfirm';
import utils from '@/assets/js/utils';
import { pageCommonConst } from '@/consts/pageCommonConst';
import { confirmModalConst } from '@/consts/confirmModalConst';
import { logout } from '@/api/logout';
import { getNotification, GetNotificationResponse } from '@/api/getNotification';
import { getUserNameList, GetUserNameListResponse } from '@/api/getUserNameList';
import { getLoginUserInfo, getLoginUserInfoResponse } from '@/api/getLoginUserInfo';
import { getApplicationTypeList, GetApplicationTypeListResponse } from '@/api/getApplicationTypeList';
import NavMenuPcView from '@/components/navMenuPcView';
import NavMenuSpView from '@/components/navMenuSpView';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { setUserInfo, clearUserInfo } = useUserInfoStore();
  const { setCommonObject, getCommonObject, clearCommonObject } = useCommonStore();
  const { setNotificationMessageObject, clearNotificationMessageObject } = useNotificationMessageStore();
  const { setApplicationTypeObject, clearApplicationTypeObject } = useApplicationTypeStore();
  const { setUserNameList, clearUserNameList } = useUserNameListStore();
  const [isCompleteLoad, setIsCompleteLoad] = useState(false);
  // モーダル表示 カスタムフック
  const confirm = useConfirm();

  const isSp = useMediaQuery({
    query: '(max-width: 1023px)'
  })

  const routePageList = [
    pageCommonConst.path.dashboard,
    pageCommonConst.path.application,
    pageCommonConst.path.applicationNew,
    pageCommonConst.path.approval,
    pageCommonConst.path.adminApplication,
    pageCommonConst.path.user,
    pageCommonConst.path.settingSystem,
    pageCommonConst.path.settingUser,
  ] as string[];

  useEffect(() =>{
    (async() => {
      // Store情報をあらかじめ初期化
      // ログイン時に必ず本処理が呼び出される
      // ※ログイン画面はLayoutコンポーネントが異なるため、本コンポーネントがログイン後にマウントされることによる
      clearCommonObject();
      clearNotificationMessageObject();
      clearApplicationTypeObject();
      clearUserNameList();
      clearUserInfo();

      const res: GetApplicationTypeListResponse = await getApplicationTypeList();
      if(res.responseResult) {
        setApplicationTypeObject(res.result);
      }

      const userNameList: GetUserNameListResponse = await getUserNameList();
      if(userNameList.responseResult) {
        setUserNameList(userNameList.userNameList);
      }

      await getLoginUserInfo().then(async(res: getLoginUserInfoResponse) => {
        if(res.responseResult) {
          setUserInfo(res);

          await getNotification().then((res: GetNotificationResponse) => {
            if(res.responseResult) {
              setCommonObject({
                actionRequiredApplicationCount: res?.actionRequiredApplicationCount,
                approvalTaskCount: res.approvalTaskCount,
                activeApplicationCount: res.activeApplicationCount,
              });
            }
          })
        } else {
          router.replace(pageCommonConst.path.login, {scroll: true});
        }
      })
    })
    ();
  }, [])

  useEffect(() =>{
    if(routePageList.includes(pathname)) {
      setNavItems(pathname);
      utils.setSessionStorage('currentRoutePage', pathname);
    } else {
      setNavItems(utils.getSessionStorage('currentRoutePage'));
    }

    utils.setSessionStorage('currentPathname', pathname);
    setCommonObject({
      actionRequiredApplicationCount: getCommonObject().actionRequiredApplicationCount,
      approvalTaskCount: getCommonObject().approvalTaskCount,
      activeApplicationCount: getCommonObject().activeApplicationCount,
    })
    setNotificationMessageObject({
      errorMessageList: [],
      inputErrorMessageList: [],
    })

    window.scroll({
      top: 0,
      behavior: "instant",
    });

    setIsCompleteLoad(true)
  }, [pathname, isCompleteLoad])

  const setNavItems = (pathName: string) => {
    const currentClassName = 'current-nav-item';
    const navItems: HTMLCollectionOf<Element> = document.getElementsByClassName('nav-item');
    for (let index = 0; index < navItems.length; index++) {
      const subItems: HTMLCollectionOf<Element> = navItems[index].getElementsByClassName('nav-item-sub');
      let isSubItem = false;
      if(subItems.length) {
        const subItemUri: string | undefined = subItems[0].children[0].getAttribute('data-url')?.substring(0, subItems[0].children[0].getAttribute('data-url')?.indexOf('?'));
        isSubItem = subItemUri !== undefined && pathName?.includes(subItemUri);
      }

      if(pathName === navItems[index].getAttribute('data-url') || isSubItem) {
        navItems[index].classList.add(currentClassName);
      } else {
        navItems[index].classList.remove(currentClassName);
      }
    }

    if(isSp && pathName === pageCommonConst.path.adminApplication) {
      for (let index = 0; index < navItems.length; index++) {
        if(navItems[index].getAttribute('data-url') === pageCommonConst.path.application) {
          navItems[index].classList.add(currentClassName);
        }
      }
    }
  }

  const push = (e: React.MouseEvent<HTMLLIElement | HTMLDivElement>) => {
    const nextPath = e?.currentTarget.getAttribute('data-url');
    if(nextPath && nextPath != utils.getSessionStorage('currentPathname')) {
      setNavItems(nextPath);
      next(nextPath);
    }
  };

  const next = (nextPath: string) => {
    router.replace(nextPath, {scroll: true});
  };

  const onLogout = async() => {
    const cancel = await confirm({
      description: confirmModalConst.message.logout,
    }).then(async() => {
      const res = await logout();
      router.replace(pageCommonConst.path.login, {scroll: true});
    }).catch(() => {
      return true
    })
    if (cancel) {
    }
  };

  if (isCompleteLoad && !isSp) {
    return (
      // PCサイズ専用メニュー
      <SubHeaderProvider>
        <NavMenuPcView children={children} push={push} onLogout={onLogout}></NavMenuPcView>
      </SubHeaderProvider>
    )
  } else if(isCompleteLoad && isSp) {
    return (
      // SPサイズ専用メニュー
      <SubHeaderProvider>
        <NavMenuSpView children={children} push={push} next={next}></NavMenuSpView>
      </SubHeaderProvider>
    )
  } else {
    return(
      <></>
    )
  }
}
