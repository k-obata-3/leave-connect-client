"use client"

import React, { useEffect, useState } from 'react';
import { Approval, GetApprovalTaskListRequest, GetApprovalTaskListResponse, getApprovalTaskList } from '@/api/getApprovalTaskList';
import Pager from '@/components/pager';
import ApprovalListView from './approvalListView';
import { getUserNameList, getUserNameListResponse } from '@/api/getUserNameList';
import ListSearchView from '@/components/listSearchView';
import { useUserInfoStore } from '@/app/store/UserInfoStore';

export default function ApprovalList() {
  const SEARCH_ACTIONS = [
    { value: '', name: 'すべて'},
    { value: '1', name: '承認待ち'},
    { value: '2', name: '承認'},
    { value: '4', name: '却下'},
  ];

  const { getUserInfo } = useUserInfoStore();
  const [userNameList, setUserNameList] = useState<getUserNameListResponse[]>([]);
  const [approvalList, setApprovalList] = useState<Approval[]>([]);
  const [currentSearchParams, setCurrentSearchParams] = useState({
    currentSearchYear: '',
    currentSearchUser: '',
    currentSearchAction: '1'
  });
  const [searchHandler, setSearchHandler] = useState({
    changeSearchYear: (val: string) => {},
    changeSearchUser: (val: string) => {
      currentSearchParams.currentSearchUser = val;
      getApprovalTasks(val, currentSearchParams.currentSearchAction, pagerParams.limit, 1);
    },
    changeSearchAction: (val: string) => {
      currentSearchParams.currentSearchAction = val;
      getApprovalTasks(currentSearchParams.currentSearchUser, val, pagerParams.limit, 1);
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [pagerParams, setPagerParams] = useState({
    limit: 10,
    totalCount: 0,
    currentPage: 1,
  })

  useEffect(() =>{
    (async() => {
      const userNameList: getUserNameListResponse[] = await getUserNameList();
      await getApprovalTasks(currentSearchParams.currentSearchUser, currentSearchParams.currentSearchAction, pagerParams.limit, pagerParams.currentPage);
      setUserNameList(userNameList.filter(user => user.id !== Number(getUserInfo().id)));
    })();
  },[])

  /**
   * 承認一覧取得
   * @param applicationUserId 
   * @param searchAction 
   * @param limit 
   * @param currentPage 
   * @returns 
   */
  const getApprovalTasks = async(applicationUserId: string, searchAction: string, limit: number, currentPage: number) => {
    if(isLoading) {
      return;
    }

    setIsLoading(true);
    const req: GetApprovalTaskListRequest = {
      searchUserId: applicationUserId,
      searchAction: searchAction,
      limit: limit,
      offset: (currentPage - 1) * limit,
    }

    const approvalTaskListResponse: GetApprovalTaskListResponse = await getApprovalTaskList(req);
    setApprovalList(approvalTaskListResponse.approvalList);
    setPagerParams({
      ...pagerParams,
      totalCount: approvalTaskListResponse.page.total,
      currentPage: currentPage,
    });
    setIsLoading(false);
  }

  /**
   * ページ表示内容取得
   * @param page 
   */
  const getPageList = (page : any) => {
    getApprovalTasks(currentSearchParams.currentSearchUser, currentSearchParams.currentSearchAction, pagerParams.limit, page);
  }

  return (
    <div className="approval-list">
      <div className="page-title">
        <h3>承認一覧</h3>
      </div>
      <div className="">
        <div className="row mb-2">
          <ListSearchView
            searchActions={SEARCH_ACTIONS}
            userNameList={userNameList}
            currentSearchParams={currentSearchParams}
            searchHandler={searchHandler}>
          </ListSearchView>
        </div>
        <ApprovalListView approvalList={approvalList}></ApprovalListView>
        <Pager params={{pageClickFnc: getPageList, limit: pagerParams.limit, totalCount: pagerParams.totalCount, page: pagerParams.currentPage}} />
      </div>
    </div>
  );
};
