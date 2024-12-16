"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation'
import { logout } from '@/api/logout';
import utils from '@/assets/js/utils';
import { getLoginUserInfo, getLoginUserInfoResponse } from '@/api/getLoginUserInfo';
import { useUserInfoStore } from '../store/UserInfoStore';
import { useCommonStore } from '../store/CommonStore';
import { useNotificationMessageStore } from '../store/NotificationMessageStore';
import { getNotification, GetNotificationResponse } from '@/api/getNotification';
import { useMediaQuery } from 'react-responsive'
import NavMenuPcView from '@/components/navMenuPcView';
import NavMenuSpView from '@/components/navMenuSpView';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isDisabledBackBtn, setIsDisabledBackBtn] = useState(true);
  const { setUserInfo } = useUserInfoStore();
  const { setCommonObject, getCommonObject } = useCommonStore();
  const { setNotificationMessageObject } = useNotificationMessageStore();
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
      behavior: "smooth",
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

    if(isSp && pathName === '/admin/application/list') {
      for (let index = 0; index < navItems.length; index++) {
        if(navItems[index].getAttribute('data-url') === '/application/list') {
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

  const back = () => {
    if(!routePageList.includes(pathname)) {
      router.back();
    }
  };

  const onLogout = async() => {
    const res = await logout();
    router.replace('/', {scroll: true});
  };

  if (isCompleteLoad && !isSp) {
    return (
      // PCサイズ専用メニュー
      <NavMenuPcView children={children} push={push} back={back} isDisabledBackBtn={isDisabledBackBtn} onLogout={onLogout}></NavMenuPcView>
    )
  } else if(isCompleteLoad && isSp) {
    return (
      // SPサイズ専用メニュー
      <NavMenuSpView children={children} push={push} next={next} back={back} isDisabledBackBtn={isDisabledBackBtn} onLogout={onLogout}></NavMenuSpView>
    )
  } else {
    return(
      <></>
    )
  }
}
