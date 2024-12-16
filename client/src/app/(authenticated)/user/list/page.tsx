"use client"

import React, { useEffect, useState } from 'react';
import Pager from '@/components/pager';
import { GetUserListRequest, GetUserListResponse, User, getUserList } from '@/api/getUserList';
import UserListView from './userListView';

export default function UserList() {
  const [userList, setUserList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagerParams, setPagerParams] = useState({
    limit: 10,
    totalCount: 0,
    currentPage: 1,
  })

  useEffect(() =>{
    (async() => {
      await getList(pagerParams.limit, pagerParams.currentPage);
    })();
  },[])

  /**
   * ユーザ一覧取得
   * @param searchStep 
   * @param limit 
   * @param currentPage 
   * @returns 
   */
  const getList = async(limit: number, currentPage: number) => {
    if(isLoading) {
      return;
    }

    setIsLoading(true);
    const req: GetUserListRequest = {
      limit: limit,
      offset: (currentPage - 1) * limit,
    }

    const userListResponse: GetUserListResponse = await getUserList(req);
    setUserList(userListResponse.userList);
    setPagerParams({
      ...pagerParams,
      totalCount: userListResponse.page.total,
      currentPage: currentPage,
    });
    setIsLoading(false);
  }

  /**
   * ページ表示内容取得
   * @param page 
   */
  const getPageList = (page : any) => {
    setUserList([]);
    getList(pagerParams.limit, page);
  }

  return (
    <div className="user-list">
      <div className="page-title pc-only">
        <h3>ユーザ管理</h3>
      </div>
      <div className="sp-only text-center">Not supported</div>
      <div className="pc-only">
        <UserListView userList={userList}></UserListView>
        <Pager params={{pageClickFnc: getPageList, limit: pagerParams.limit, totalCount: pagerParams.totalCount, page: pagerParams.currentPage}} />
      </div>
    </div>
  );
};
