"use client"

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { useNotificationMessageStore } from '@/store/notificationMessageStore';
import usePageBack from '@/hooks/usePageBack';
import { pageCommonConst } from '@/consts/pageCommonConst';
import EditPersonal from './editPersonal';
import EditPassword from './editPassword';

export default function SettingUser() {
  const searchParams = useSearchParams();

  const ITEM = [
    { contentName: pageCommonConst.pageName.settingUserEditPersonal, keyword: pageCommonConst.tabName.editPersonal },
    { contentName: pageCommonConst.pageName.settingUserEditPassword, keyword: pageCommonConst.tabName.editPassword }
  ]

  // 共通Store
  const { clearNotificationMessageObject } = useNotificationMessageStore();
  // 戻るボタン カスタムフック
  const pageBack = usePageBack();

  const [currentMenu, setCurrentMenu] = useState({
    contentName: "",
    keyword: "",
  });

  useEffect(() =>{
    const tab = searchParams?.get(pageCommonConst.param.tab) ?? '';
    const item = ITEM.find((item: any) => item.keyword === tab);
    if(item) {
      setCurrentMenu(item)
    }

    clearNotificationMessageObject();
    pageBack(false);
  },[searchParams])

  return (
    <div className="config-user">
      <div className="page-title pc-only">
        <h3 className="">{currentMenu.contentName}</h3>
      </div>
      <div hidden={currentMenu.keyword !== pageCommonConst.tabName.editPersonal}>
        <EditPersonal></EditPersonal>
      </div>
      <div hidden={currentMenu.keyword !== pageCommonConst.tabName.editPassword}>
        <EditPassword></EditPassword>
      </div>
    </div>
  );

};
