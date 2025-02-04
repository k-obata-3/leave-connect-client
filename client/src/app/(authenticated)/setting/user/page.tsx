"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useNotificationMessageStore } from '@/store/notificationMessageStore';
import usePageBack from '@/hooks/usePageBack';
import useSetPageTitle from '@/hooks/useSetPageTitle';
import { pageCommonConst } from '@/consts/pageCommonConst';
import EditPersonal from './editPersonal';
import EditPassword from './editPassword';

export default function SettingUser() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const ITEM = [
    { contentName: pageCommonConst.pageName.settingUserEditPersonal, keyword: pageCommonConst.tabName.editPersonal },
    { contentName: pageCommonConst.pageName.settingUserEditPassword, keyword: pageCommonConst.tabName.editPassword }
  ]

  // 共通Store
  const { clearNotificationMessageObject } = useNotificationMessageStore();
  // カスタムフック
  const pageBack = usePageBack();
  const pageTitle = useSetPageTitle();

  const [currentMenu, setCurrentMenu] = useState({
    contentName: "",
    keyword: "",
  });

  useEffect(() =>{
    pageTitle(pageCommonConst.pageName.settingUser);
    const tab = searchParams?.get(pageCommonConst.param.tab) ?? '';
    const item = ITEM.find((item: any) => item.keyword === tab);
    if(item) {
      setCurrentMenu(item);
    }

    clearNotificationMessageObject();
    pageBack(false);
  },[searchParams])

  return (
    <div className="config-user-page">
      {/* 個人設定 サブメニュー */}
      {/* <nav className="nav sub-menu-nav nav-underline pc-only">
        <div className={currentMenu.keyword === pageCommonConst.tabName.editPersonal ? "nav-link active" : "nav-link"} onClick={() => router.push(pageCommonConst.path.settingUserEditPersonal, {scroll: true})}>
          <span>{pageCommonConst.pageName.settingUserEditPersonal}</span>
        </div>
        <div className={currentMenu.keyword === pageCommonConst.tabName.editPassword ? "nav-link active" : "nav-link"} onClick={() => router.push(pageCommonConst.path.settingUserEditPassword, {scroll: true})}>
          <span>{pageCommonConst.pageName.settingUserEditPassword}</span>
        </div>
      </nav> */}

      <div className="config-user">
        <div hidden={currentMenu.keyword !== pageCommonConst.tabName.editPersonal}>
          <EditPersonal></EditPersonal>
        </div>
        <div hidden={currentMenu.keyword !== pageCommonConst.tabName.editPassword}>
          <EditPassword></EditPassword>
        </div>
      </div>
    </div>
  );

};
