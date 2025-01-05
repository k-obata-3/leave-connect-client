"use client"

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { useNotificationMessageStore } from '@/store/notificationMessageStore';
import usePageBack from '@/hooks/usePageBack';
import { pageCommonConst } from '@/consts/pageCommonConst';
import { getSystemConfigs, GetSystemConfigsRequest, GetSystemConfigsResponse } from '@/api/getSystemConfigs';
import { ApprovalGroupObject, getApprovalGroupList, GetApprovalGroupListResponse } from '@/api/getApprovalGroupList';
import GrantRule from './grantRule';
import ApprovalGroupView from './approvalGroupView';

export default function SettingSystem() {
  const searchParams = useSearchParams();

  const ITEM = [
    { contentName: pageCommonConst.pageName.settingSystemGrantRule, keyword: pageCommonConst.tabName.grantRule },
    { contentName: pageCommonConst.pageName.settingSystemApprovalGroup, keyword: pageCommonConst.tabName.approvalGroup }
  ]

  // 共通Store
  const { setNotificationMessageObject } = useNotificationMessageStore();
  // 戻るボタン カスタムフック
  const pageBack = usePageBack();

  const [currentMenu, setCurrentMenu] = useState({
    contentName: "",
    keyword: "",
  });
  const [grantRule, setGrantRule] = useState<string | null>(null);
  const [approvalGroupResponse, setApprovalGroupResponse] = useState<ApprovalGroupObject[]>([]);

  useEffect(() =>{
    const tab = searchParams?.get(pageCommonConst.param.tab) ?? '';
    const item = ITEM.find((item: any) => item.keyword === tab);
    setGrantRule(null);
    setApprovalGroupResponse([]);
    if(item) {
      setCurrentMenu(item);
      getSystemConfig(tab);
    }

    setNotificationMessageObject({
      errorMessageList: [],
      inputErrorMessageList: [],
    })

    pageBack(false);
  },[searchParams])

  const getGrantRule = async(req: GetSystemConfigsRequest) => {
    const res: GetSystemConfigsResponse = await getSystemConfigs(req);
    if(res.responseResult) {
      if(res.systemConfigs.length) {
        setGrantRule(res.systemConfigs[0].value);
      }
    } else {
      setNotificationMessageObject({
        errorMessageList: res.message ? [res.message] : [],
        inputErrorMessageList: [],
      })
    }
  }

  const getApprovalGroup = async(req: GetSystemConfigsRequest) => {
    const res: GetApprovalGroupListResponse = await getApprovalGroupList();
    if(res.responseResult) {
      setApprovalGroupResponse(res.approvalGroupList);
    } else {
      setNotificationMessageObject({
        errorMessageList: res.message ? [res.message] : [],
        inputErrorMessageList: [],
      })
      return;
    }
  }

  const getSystemConfig = async(keyword: string) => {
    const req: GetSystemConfigsRequest = {
      key: keyword,
    }

    if(keyword === pageCommonConst.tabName.grantRule) {
      getGrantRule(req);
    } else if(keyword === pageCommonConst.tabName.approvalGroup) {
      getApprovalGroup(req);
    }
  }

  const updateSystemConfigList = async() => {
    getSystemConfig(currentMenu.keyword);
  }

  return (
    <div className="config-system">
      <div className="page-title pc-only">
        <h3 className="">{currentMenu.contentName}</h3>
      </div>
      <div className="sp-only text-center">{pageCommonConst.notSupportMessage}</div>
      <div className="pc-only">
        <div hidden={currentMenu.keyword !== pageCommonConst.tabName.grantRule}>
          <GrantRule value={grantRule}></GrantRule>
        </div>
        <div hidden={currentMenu.keyword !== pageCommonConst.tabName.approvalGroup}>
          <ApprovalGroupView approvalGroupList={approvalGroupResponse} updateSystemConfigList={updateSystemConfigList}></ApprovalGroupView>
        </div>
      </div>
    </div>
  );
};
