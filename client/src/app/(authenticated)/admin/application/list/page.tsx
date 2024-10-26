"use client"

import React, { useEffect, useState } from 'react';
import { getUserNameList, getUserNameListResponse } from '@/api/getUserNameList';
import { Application, getApplicationList, GetApplicationListRequest, GetApplicationListResponse } from '@/api/getApplicationList';
import ApplicationListView from '@/components/applicationListView';
import ListSearchView from '@/components/listSearchView';
import Pager from '@/components/pager';

export default function AdminApplicationList() {
  const SEARCH_ACTIONS = [
    { value: '', name: 'すべて'},
    { value: '1', name: '承認待ち'},
    { value: '3', name: '完了'},
    { value: '4', name: '却下'},
    { value: '5', name: '取消'},
  ];

  const [userNameList, setUserNameList] = useState<getUserNameListResponse[]>([]);
  const [applicationList, setApplicationList] = useState<Application[]>();
  const [currentSearchParams, setCurrentSearchParams] = useState({
    currentSearchYear: new Date().getFullYear().toString(),
    currentSearchUser: '',
    currentSearchAction: ''
  });
  const [searchHandler, setSearchHandler] = useState({
    changeSearchYear: (val: string) => {
      currentSearchParams.currentSearchYear = val;
      getApplications(val, currentSearchParams.currentSearchUser, currentSearchParams.currentSearchAction, pagerParams.limit, 1);
    },
    changeSearchUser: (val: string) => {
      currentSearchParams.currentSearchUser = val;
      getApplications(currentSearchParams.currentSearchYear, val, currentSearchParams.currentSearchAction, pagerParams.limit, 1);
    },
    changeSearchAction: (val: string) => {
      currentSearchParams.currentSearchAction = val;
      getApplications(currentSearchParams.currentSearchYear, currentSearchParams.currentSearchUser, val, pagerParams.limit, 1);
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
      await getApplications(currentSearchParams.currentSearchYear, currentSearchParams.currentSearchUser, currentSearchParams.currentSearchAction, pagerParams.limit, pagerParams.currentPage);

      setUserNameList(userNameList);
    })()
  },[])

  /**
   * 申請一覧取得
   * @param searchUserId 
   * @param searchAction 
   * @param searchYear 
   * @param limit 
   * @param currentPage 
   * 
   * @returns 
   */
  const getApplications = async(searchYear: string, searchUserId: string, searchAction: string, limit: number, currentPage: number) => {
    if(isLoading) {
      return;
    }

    setIsLoading(true);
    const req: GetApplicationListRequest = {
      searchUserId: searchUserId,
      searchAction: searchAction,
      searchYear: searchYear,
      limit: limit,
      offset: (currentPage - 1) * limit,
      isAdmin: true,
    }

    const applicationListResponse: GetApplicationListResponse = await getApplicationList(req);
    setApplicationList(applicationListResponse.applicationList);
    setPagerParams({
      ...pagerParams,
      totalCount: applicationListResponse.page.total,
      currentPage: currentPage,
    });
    setIsLoading(false);
  }

  /**
   * ページ表示内容取得
   * @param page 
   */
  const getPageList = (page : any) => {
    getApplications(currentSearchParams.currentSearchYear, currentSearchParams.currentSearchUser, currentSearchParams.currentSearchAction, pagerParams.limit, page);
  }

  return (
    <div className="application-list">
      <div className="page-title">
        <h3>申請管理</h3>
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
        <ApplicationListView applicationList={applicationList} userNameList={userNameList}></ApplicationListView>
        <Pager params={{pageClickFnc: getPageList, limit: pagerParams.limit, totalCount: pagerParams.totalCount, page: pagerParams.currentPage}} />
      </div>
    </div>
  );
};