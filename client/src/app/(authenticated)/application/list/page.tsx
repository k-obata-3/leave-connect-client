"use client"

import React, { useEffect, useState } from 'react';
import { Application, GetApplicationListRequest, GetApplicationListResponse, getApplicationList } from '@/api/getApplicationList';
import { useRouter } from 'next/navigation'
import { useUserInfoStore } from '@/app/store/UserInfoStore';
import ApplicationListView from '@/components/applicationListView';
import ListSearchView from '@/components/listSearchView';
import Pager from '@/components/pager';
import { useCommonStore } from '@/app/store/CommonStore';

export default function ApplicationList() {
  const router = useRouter();
  const SEARCH_ACTIONS = [
    { value: '', name: 'すべて'},
    { value: '0', name: '下書き'},
    { value: '1', name: '承認待ち'},
    { value: '3', name: '完了'},
    { value: '4', name: '差戻'},
    { value: '5', name: '取消'},
  ];

  // 共通Sore
  const { setCommonObject, getCommonObject } = useCommonStore();
  const { getUserInfo } = useUserInfoStore();
  const [applicationList, setApplicationList] = useState<Application[]>([]);
  const [currentSearchParams, setCurrentSearchParams] = useState({
    currentSearchYear: '',
    currentSearchUser: '',
    currentSearchAction: ''
  });
  const [searchHandler, setSearchHandler] = useState({
    changeSearchYear: (val: string) => {},
    changeSearchUser: (val: string) => {},
    changeSearchAction: (val: string) => {
      currentSearchParams.currentSearchAction = val;
      getApplications(val, pagerParams.limit, 1);
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
      await getApplications(currentSearchParams.currentSearchAction, pagerParams.limit, pagerParams.currentPage);
    })();
  },[])

  /**
   * 申請一覧取得
   * @param searchAction 
   * @param limit 
   * @param currentPage 
   * @returns 
   */
  const getApplications = async(searchAction: string, limit: number, currentPage: number) => {
    if(isLoading) {
      return;
    }

    setIsLoading(true);
    const req: GetApplicationListRequest = {
      searchUserId: null,
      searchAction: searchAction,
      searchYear: null,
      limit: limit,
      offset: (currentPage - 1) * limit,
      isAdmin: false,
    }
    const res: GetApplicationListResponse = await getApplicationList(req);
    if(res.responseResult) {
      setApplicationList(res.applicationList);
      setPagerParams({
        ...pagerParams,
        totalCount: res.page.total,
        currentPage: currentPage,
      });
      setIsLoading(false);
    }

    setCommonObject({
      errorMessage: res.message ? res.message : "",
      actionRequiredApplicationCount: getCommonObject().actionRequiredApplicationCount,
      approvalTaskCount: getCommonObject().approvalTaskCount,
      activeApplicationCount: getCommonObject().activeApplicationCount,
    })
  }

  /**
   * ページ表示内容取得
   * @param page 
   */
  const getPageList = (page : any) => {
    getApplications(currentSearchParams.currentSearchAction, pagerParams.limit, page);
  }

  return (
    <div className="application-list">
      <div className="page-title">
        <h3>申請一覧</h3>
      </div>
      <div className="">
        <div className="row mb-2">
          <div className="col-4 col-md-2 text-start pc-only">
            <button className="btn btn-outline-primary" onClick={() => router.push('/application/edit', {scroll: true})}>新規申請</button>
          </div>
          <div className="col text-end">
            <ListSearchView
              searchActions={SEARCH_ACTIONS}
              userNameList={[]}
              currentSearchParams={currentSearchParams}
              searchHandler={searchHandler}>
            </ListSearchView>
          </div>
        </div>
        <ApplicationListView applicationList={applicationList} userNameList={[]}></ApplicationListView>
        <Pager params={{pageClickFnc: getPageList, limit: pagerParams.limit, totalCount: pagerParams.totalCount, page: pagerParams.currentPage}} />
      </div>
    </div>
  );
};
