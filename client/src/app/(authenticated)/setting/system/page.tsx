"use client"

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { useNotificationMessageStore } from '@/store/notificationMessageStore';
import usePageBack from '@/hooks/usePageBack';
import useSetPageTitle from '@/hooks/useSetPageTitle';
import { pageCommonConst } from '@/consts/pageCommonConst';
import GrantRule from './grantRule';
import ApprovalGroupView from './approvalGroupView';
import CareerItemView from './careerItemView';

export default function SettingSystem() {
  const searchParams = useSearchParams();

  const ITEM = [
    { contentName: pageCommonConst.pageName.settingSystemGrantRule, keyword: pageCommonConst.tabName.grantRule },
    { contentName: pageCommonConst.pageName.settingSystemApprovalGroup, keyword: pageCommonConst.tabName.approvalGroup },
    { contentName: pageCommonConst.pageName.settingSystemCareerItem, keyword: pageCommonConst.tabName.career }
  ]

  // 共通Store
  const { setNotificationMessageObject } = useNotificationMessageStore();
  // カスタムフック
  const pageBack = usePageBack();
  const pageTitle = useSetPageTitle();

  const [currentMenu, setCurrentMenu] = useState({
    contentName: "",
    keyword: "",
  });

  useEffect(() =>{
    const tab = searchParams?.get(pageCommonConst.param.tab) ?? '';
    const item = ITEM.find((item: any) => item.keyword === tab);
    if(item) {
      setCurrentMenu(item);
      pageTitle(item.contentName);
    }

    setNotificationMessageObject({
      errorMessageList: [],
      inputErrorMessageList: [],
    })

    pageBack(false);
  },[searchParams])

  return (
    <div className="config-system">
      <div className="sp-only text-center">{pageCommonConst.notSupportMessage}</div>
      <div className="pc-only">
        <div hidden={currentMenu.keyword !== pageCommonConst.tabName.grantRule}>
          <GrantRule isShow={currentMenu.keyword === pageCommonConst.tabName.grantRule}></GrantRule>
        </div>
        <div hidden={currentMenu.keyword !== pageCommonConst.tabName.approvalGroup}>
          <ApprovalGroupView isShow={currentMenu.keyword === pageCommonConst.tabName.approvalGroup}></ApprovalGroupView>
        </div>
        <div hidden={currentMenu.keyword !== pageCommonConst.tabName.career}>
          <CareerItemView isShow={currentMenu.keyword === pageCommonConst.tabName.career}></CareerItemView>
        </div>
      </div>
    </div>
  );
};
