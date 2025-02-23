"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useNotificationMessageStore } from '@/store/notificationMessageStore';
import usePageBack from '@/hooks/usePageBack';
import useSetPageTitle from '@/hooks/useSetPageTitle';
import { pageCommonConst } from '@/consts/pageCommonConst';
import EditPersonalView from './editPersonalView';
import EditPasswordView from './editPasswordView';

export default function SettingUserPage() {
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
    <div className="setting-user-page">
      <div className="setting-user">
        <div hidden={currentMenu.keyword !== pageCommonConst.tabName.editPersonal}>
          <EditPersonalView></EditPersonalView>
        </div>
        <div hidden={currentMenu.keyword !== pageCommonConst.tabName.editPassword}>
          <EditPasswordView></EditPasswordView>
        </div>
      </div>
    </div>
  );

};
