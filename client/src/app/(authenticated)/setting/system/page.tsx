"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useNotificationMessageStore } from '@/store/notificationMessageStore';
import usePageBack from '@/hooks/usePageBack';
import useSetPageTitle from '@/hooks/useSetPageTitle';
import { pageCommonConst } from '@/consts/pageCommonConst';
import GrantRule from './grantRule';
import ApprovalGroupView from './approvalGroupView';
import CareerItemView from './careerItemView';

export default function SettingSystem() {
  const router = useRouter();
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
    pageTitle(pageCommonConst.pageName.settingSystem);
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
    <div className="config-system-page">
      <div className="sp-only text-center">{pageCommonConst.notSupportMessage}</div>
      <div className="pc-only">
        {/* システム管理 サブメニュー */}
        {/* <nav className="nav sub-menu-nav nav-underline">
          <div className={currentMenu.keyword === pageCommonConst.tabName.grantRule ? "nav-link active" : "nav-link"} onClick={() => router.push(pageCommonConst.path.settingSystemGrantRule, {scroll: true})}>
            <span>{pageCommonConst.pageName.settingSystemGrantRule}</span>
          </div>
          <div className={currentMenu.keyword === pageCommonConst.tabName.approvalGroup ? "nav-link active" : "nav-link"} onClick={() => router.push(pageCommonConst.path.settingSystemApprovalGroup, {scroll: true})}>
            <span>{pageCommonConst.pageName.settingSystemApprovalGroup}</span>
          </div>
          <div className={currentMenu.keyword === pageCommonConst.tabName.career ? "nav-link active" : "nav-link"} onClick={() => router.push(pageCommonConst.path.settingSystemCareerItem, {scroll: true})}>
            <span>{pageCommonConst.pageName.settingSystemCareerItem}</span>
          </div>
        </nav> */}

        <div className="config-system">
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
    </div>
  );
};
