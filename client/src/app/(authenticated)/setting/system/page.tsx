"use client"

import React, { useState, useEffect } from 'react';
import GrantRule from './grantRule';
import { getSystemConfigs, GetSystemConfigsRequest, GetSystemConfigsResponse } from '@/api/getSystemConfigs';
import { getApprovalGroupList, GetApprovalGroupListResponse } from '@/api/getApprovalGroupList';
import ApprovalGroupView from './approvalGroupView';
import { useSearchParams } from 'next/navigation';

export default function SettingSystem() {
  const ITEM = [
    { contentName: "付与日数設定", keyword: "grantRule" },
    { contentName: "承認グループ設定", keyword: "approvalGroup" }
  ]
  const searchParams = useSearchParams();
  const [currentMenu, setCurrentMenu] = useState({
    contentName: "",
    keyword: "",
  });
  const [systemConfigsResponse, setSystemConfigsResponse] = useState<GetSystemConfigsResponse[]>([]);
  const [approvalGroupResponse, setApprovalGroupResponse] = useState<GetApprovalGroupListResponse[]>([]);

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
      const res: GetSystemConfigsResponse[] = await getSystemConfigs(req);
      setSystemConfigsResponse(res);
    } else if(keyword === "approvalGroup") {
      const res: GetApprovalGroupListResponse[] = await getApprovalGroupList();
      setApprovalGroupResponse(res);
    }
  }

  const updateSystemConfigList = async() => {
    getSystemConfig(currentMenu.keyword);
  }

  return (
    <div className="config-system">
      <div className="page-title">
        <h3 className="d-inline-block">システム管理</h3>
        <h5 className="d-inline-block ms-2">-{currentMenu.contentName}-</h5>
      </div>
      <div hidden={currentMenu.keyword !== 'grantRule'}>
        <GrantRule systemConfig={systemConfigsResponse[0]}></GrantRule>
      </div>
      <div hidden={currentMenu.keyword !== 'approvalGroup'}>
        <ApprovalGroupView approvalGroupList={approvalGroupResponse} updateSystemConfigList={updateSystemConfigList}></ApprovalGroupView>
      </div>
    </div>
  );
};
