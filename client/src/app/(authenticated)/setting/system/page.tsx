"use client"

import React, { useState, useEffect } from 'react';
import GrantRule from './grantRule';
import { getSystemConfigs, GetSystemConfigsRequest, GetSystemConfigsResponse, SystemConfigObject } from '@/api/getSystemConfigs';
import { ApprovalGroupObject, getApprovalGroupList, GetApprovalGroupListResponse } from '@/api/getApprovalGroupList';
import ApprovalGroupView from './approvalGroupView';
import { useSearchParams } from 'next/navigation';
import { useNotificationMessageStore } from '@/app/store/NotificationMessageStore';

export default function SettingSystem() {
  const ITEM = [
    { contentName: "付与日数設定", keyword: "grantRule" },
    { contentName: "承認グループ設定", keyword: "approvalGroup" }
  ]

  // 共通Sore
  const { setNotificationMessageObject } = useNotificationMessageStore();
  const searchParams = useSearchParams();
  const [currentMenu, setCurrentMenu] = useState({
    contentName: "",
    keyword: "",
  });
  const [systemConfigsResponse, setSystemConfigsResponse] = useState<SystemConfigObject[]>([]);
  const [approvalGroupResponse, setApprovalGroupResponse] = useState<ApprovalGroupObject[]>([]);

  useEffect(() =>{
    const tab = searchParams?.get("tab") ?? '';
    const item = ITEM.find((item: any) => item.keyword === tab);
    if(item) {
      setCurrentMenu(item)
      getSystemConfig(tab);
    }
    // (async() => {
    //   await getSystemConfig(currentMenu);
    // })()
  },[searchParams])

  const handleOnChange = async(e: any) => {
    const selectMenu = ITEM.find((item: any) => item.keyword === e.target.value);
    if(selectMenu && selectMenu.keyword !== currentMenu.keyword) {
      setCurrentMenu(selectMenu);
      await getSystemConfig(selectMenu.keyword);
    }
  }

  const handleOnMenuClick = async(e: any, keyword: string) => {
    const selectMenu = ITEM.find((item: any) => item.keyword === keyword);
    if(selectMenu && selectMenu.keyword !== currentMenu.keyword) {
      setCurrentMenu(selectMenu);
      await getSystemConfig(selectMenu.keyword);
    }
  }

  const getSystemConfig = async(keyword: string) => {
    const req: GetSystemConfigsRequest = {
      key: keyword,
    }

    if(keyword === "grantRule") {
      const res: GetSystemConfigsResponse = await getSystemConfigs(req);
      if(res.responseResult) {
        setSystemConfigsResponse(res.systemConfigs);
      } else {
        setNotificationMessageObject({
          errorMessageList: res.message ? [res.message] : [],
          inputErrorMessageList: [],
        })
      }
    } else if(keyword === "approvalGroup") {
      const res: GetApprovalGroupListResponse = await getApprovalGroupList();
      if(res.responseResult) {
        setApprovalGroupResponse(res.approvalGroupList);
      } else {
        setNotificationMessageObject({
          errorMessageList: res.message ? [res.message] : [],
          inputErrorMessageList: [],
        })
      }
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
      <div className="sp-only text-center">Not supported</div>
      <div className="pc-only">
        <div hidden={currentMenu.keyword !== 'grantRule'}>
          <GrantRule systemConfigs={systemConfigsResponse}></GrantRule>
        </div>
        <div hidden={currentMenu.keyword !== 'approvalGroup'}>
          <ApprovalGroupView approvalGroupList={approvalGroupResponse} updateSystemConfigList={updateSystemConfigList}></ApprovalGroupView>
        </div>
      </div>
    </div>
  );
};
