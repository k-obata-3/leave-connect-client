"use client"

import React, { useState, useEffect } from 'react';
import { getUserDetails, getUserDetailsRequest, getUserDetailsResponse,  } from '@/api/getUserDetails';
import { useUserInfoStore } from '@/app/store/UserInfoStore';
import { useRouter, useSearchParams } from 'next/navigation';
import EditPersonal from './editPersonal';
import EditPassword from './editPassword';

export default function SettingUser() {
  const ITEM = [
    { contentName: "個人情報編集", keyword: "editPersonal" },
    { contentName: "パスワード変更", keyword: "editPassword" }
  ]
  const router = useRouter();
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
        <h3 className="pc-only">{currentMenu.contentName}</h3>
        <h3 className="sp-only">個人設定</h3>
      </div>

      <div className="sp-only mb-2 config-user-tab">
        <nav className="nav nav-underline nav-justified">
          <div className={currentMenu.keyword===ITEM[0].keyword ? "col-6 nav-link active" : "col-6 nav-link"} onClick={() => router.replace('/setting/user?tab=editPersonal', {scroll: true})}>
            <span>{ITEM[0].contentName}</span>
          </div>
          <div className={currentMenu.keyword===ITEM[1].keyword ? "col-6 nav-link active" : "col-6 nav-link"} onClick={() => router.replace('/setting/user?tab=editPassword', {scroll: true})}>
            <span>{ITEM[1].contentName}</span>
          </div>
        </nav>
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
