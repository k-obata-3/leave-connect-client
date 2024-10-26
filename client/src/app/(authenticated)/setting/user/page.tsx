"use client"

import React, { useState, useEffect } from 'react';
import { getUserDetails, getUserDetailsRequest, getUserDetailsResponse,  } from '@/api/getUserDetails';
import { useUserInfoStore } from '@/app/store/UserInfoStore';
import { useSearchParams } from 'next/navigation';
import EditPersonal from './editPersonal';
import EditPassword from './editPassword';

export default function SettingUser() {
  const ITEM = [
    { contentName: "個人情報編集", keyword: "editPersonal" },
    { contentName: "パスワード変更", keyword: "editPassword" }
  ]
  const searchParams = useSearchParams();
  const [currentMenu, setCurrentMenu] = useState({
    contentName: "",
    keyword: "",
  });
  const { getUserInfo } = useUserInfoStore();

  useEffect(() =>{
    const tab = searchParams?.get("tab") ?? '';
    const item = ITEM.find((item: any) => item.keyword === tab);
    if(item) {
      setCurrentMenu(item)
    }

    getUser(getUserInfo().id);
  },[searchParams])

  /**
   * ユーザ情報取得
   * @param id 
   */
  const getUser = async(id: string) => {
      const req: getUserDetailsRequest = {
        id: id
      }
      const user: getUserDetailsResponse = await getUserDetails(req);
  }

  return (
    <div className="config-user">
      <div className="page-title">
        <h3 className="d-inline-block">個人設定</h3>
        <h5 className="d-inline-block ms-2">-{currentMenu.contentName}-</h5>
      </div>
      <div hidden={currentMenu.keyword !== 'editPersonal'}>
        <EditPersonal></EditPersonal>
      </div>
      <div hidden={currentMenu.keyword !== 'editPassword'}>
        <EditPassword></EditPassword>
      </div>
    </div>
  );

};
