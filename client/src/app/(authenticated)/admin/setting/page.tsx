"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useNotificationMessageStore } from '@/store/notificationMessageStore';
import usePageBack from '@/hooks/usePageBack';
import useSetPageTitle from '@/hooks/useSetPageTitle';
import { pageCommonConst } from '@/consts/pageCommonConst';
import GrantRuleView from './grantRuleView';
import ApprovalGroupView from './approvalGroupView';
import CareerItemView from './careerItemView';

export default function AdminSettingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const ITEM = [
    { contentName: pageCommonConst.pageName.adminSettingGrantRule, keyword: pageCommonConst.tabName.grantRule },
    { contentName: pageCommonConst.pageName.adminSettingApprovalGroup, keyword: pageCommonConst.tabName.approvalGroup },
    { contentName: pageCommonConst.pageName.adminSettingCareerItem, keyword: pageCommonConst.tabName.career }
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
    pageTitle(pageCommonConst.pageName.adminSetting);
    const tab = searchParams?.get(pageCommonConst.param.tab) ?? '';
    const item = ITEM.find((item: any) => item.keyword === tab);
    if(item) {
      setCurrentMenu(item);
    }

    setNotificationMessageObject({
      errorMessageList: [],
      inputErrorMessageList: [],
    })

    pageBack(false);
  },[searchParams])

  return (
    <div className="admin-setting-page">
      <div className="sp-only text-center">{pageCommonConst.notSupportMessage}</div>
      <div className="pc-only">
        <div className="admin-setting-view">
          <div hidden={currentMenu.keyword !== pageCommonConst.tabName.grantRule}>
            <GrantRuleView isShow={currentMenu.keyword === pageCommonConst.tabName.grantRule}></GrantRuleView>
          </div>
          <div hidden={currentMenu.keyword !== pageCommonConst.tabName.approvalGroup}>
            <ApprovalGroupView isShow={currentMenu.keyword === pageCommonConst.tabName.approvalGroup}></ApprovalGroupView>
          </div>
          <div hidden={currentMenu.keyword !== pageCommonConst.tabName.career}>
            <CareerItemView isShow={currentMenu.keyword === pageCommonConst.tabName.career}></CareerItemView>
          </div>
        </div>
      </div>
    </div>
  );
};
