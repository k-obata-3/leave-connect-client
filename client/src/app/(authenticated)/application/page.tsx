"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'

import { useNotificationMessageStore } from '@/store/notificationMessageStore';
import usePageBack from '@/hooks/usePageBack';
import { pageCommonConst } from '@/consts/pageCommonConst';
import { pagerConst } from '@/consts/pagerConst';
import { Application, GetApplicationListRequest, GetApplicationListResponse, getApplicationList } from '@/api/getApplicationList';
import Pager from '@/components/pager';
import ApplicationListView from '@/components/applicationListView';
import ApplicationEditView from '@/components/applicationEditView';
import SearchSelectYearView from '@/components/searchSelectYearView';
import SearchSelectStatusView from '@/components/searchSelectStatusView';
import SearchSelectTypeView from '@/components/searchSelectTypeView';

export default function ApplicationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 共通Store
  const { setNotificationMessageObject } = useNotificationMessageStore();
  // 戻るボタン カスタムフック
  const pageBack = usePageBack();
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [showEditView, setShowEditView] = useState(false);
  const [applicationList, setApplicationList] = useState<Application[]>([]);
  const [currentSearchParams, setCurrentSearchParams] = useState({
    currentSearchYear: new Date().getFullYear().toString(),
    currentSearchUser: '',
    currentSearchStatus: '',
    currentSearchType: '0'
  });
  const [searchHandler, setSearchHandler] = useState({
    changeSearchYear: (val: string) => {
      currentSearchParams.currentSearchYear = val;
      getApplications(val, currentSearchParams.currentSearchStatus, currentSearchParams.currentSearchType, pagerParams.limit, pagerConst.initialCurrentPage);
    },
    changeSearchUser: (val: string) => {},
    changeSearchStatus: (val: string) => {
      currentSearchParams.currentSearchStatus = val;
      getApplications(currentSearchParams.currentSearchYear, val, currentSearchParams.currentSearchType, pagerParams.limit, pagerConst.initialCurrentPage);
    },
    changeSearchType: (val: string) => {
      currentSearchParams.currentSearchType = val;
      getApplications(currentSearchParams.currentSearchYear, currentSearchParams.currentSearchStatus, val, pagerParams.limit, pagerConst.initialCurrentPage);
    },
  });

  const [pagerParams, setPagerParams] = useState({
    limit: pagerConst.applicationListLimit,
    totalCount: pagerConst.initialTotalCount,
    currentPage: pagerConst.initialCurrentPage,
  })

  useEffect(() =>{
    (async() => {
      await getApplications(currentSearchParams.currentSearchYear, currentSearchParams.currentSearchStatus, currentSearchParams.currentSearchType, pagerParams.limit, pagerParams.currentPage);
    })()
  },[])

  useEffect(() =>{
    setIsNew(searchParams?.get(pageCommonConst.param.isNew) ? true : false);
    setApplicationId(searchParams?.get(pageCommonConst.param.applicationId) ? searchParams?.get(pageCommonConst.param.applicationId) : null);
  },[searchParams])

  useEffect(() =>{
    setShowEditView(!!(applicationId || isNew));
    if(applicationId) {
      pageBack(true).then(() => {
        const ref = searchParams.get(pageCommonConst.param.ref);
        router.replace(`${ref ? ref : pageCommonConst.path.application}`, {scroll: true});
      }).catch(() => {
        return true;
      })
    } else {
      pageBack(false);
    }
  },[applicationId, isNew])

  /**
   * 申請一覧取得
   * @param searchYear 
   * @param searchAction 
   * @param limit 
   * @param currentPage 
   * @returns 
   */
  const getApplications = async(searchYear: string, searchAction: string, searchType: string, limit: number, currentPage: number) => {
    const req: GetApplicationListRequest = {
      searchUserId: null,
      searchAction: searchAction,
      searchYear: searchYear,
      searchType: searchType,
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
    } else {
      setNotificationMessageObject({
        errorMessageList: res.message ? [res.message] : [],
        inputErrorMessageList: [],
      })
    }
  }

  /**
   * ページ表示内容取得
   * @param page 
   */
  const getPageList = (page : any) => {
    setApplicationList([]);
    getApplications(currentSearchParams.currentSearchYear, currentSearchParams.currentSearchStatus, currentSearchParams.currentSearchType, pagerParams.limit, page);
  }

  /**
   * 編集ボタン押下
   * @param id 
   */
  const onEdit = (id: string) => {
    router.push(`${pageCommonConst.path.application}?${pageCommonConst.param.applicationId}=${id}`, {scroll: true});
    pageBack(true).then(() => {
      router.replace(pageCommonConst.path.application, {scroll: true});
    }).catch(() => {
      return true;
    })
  };

  /**
   * 新規作成ボタン押下
   * @param id 
   */
  const onCreateNewApplication = () => {
    router.push(pageCommonConst.path.applicationNew, {scroll: true});
  };

  return (
    <div className="application-page">
      <div className="page-title pc-only">
        <h3>{showEditView ? pageCommonConst.pageName.applicationEdit : pageCommonConst.pageName.application}</h3>
      </div>
      <div className="" hidden={showEditView}>
        <div className="row mb-2">
          <div className="col-4 col-md-2 text-start pc-only">
            <button className="btn btn-outline-primary" onClick={onCreateNewApplication}>{pageCommonConst.pageName.applicationNew}</button>
          </div>
          {/* 検索条件 */}
          <div className="col row d-flex justify-content-end">
            <div className="col-12 search_select_year_width">
              <SearchSelectYearView callback={searchHandler.changeSearchYear} currentValue={currentSearchParams.currentSearchYear}></SearchSelectYearView>
            </div>
            <div className="col-12 search_select_status_width">
              <SearchSelectStatusView callback={searchHandler.changeSearchStatus} currentValue={currentSearchParams.currentSearchStatus}></SearchSelectStatusView>
            </div>
            <div className="col-12 search_select_type_width">
              <SearchSelectTypeView callback={searchHandler.changeSearchType} currentValue={currentSearchParams.currentSearchType}></SearchSelectTypeView>
            </div>
          </div>
        </div>
        <ApplicationListView applicationList={applicationList} rowBtnHandler={onEdit}></ApplicationListView>
        <Pager params={{pageClickFnc: getPageList, limit: pagerParams.limit, totalCount: pagerParams.totalCount, page: pagerParams.currentPage}} />
        {/*
        <div className="new-application-btn sp-only">
          <button className="btn btn-primary" onClick={() => router.push(pageCommonConst.path.applicationNew)}><i className="bi bi-plus"></i></button>
        </div>
        */}
      </div>
      <div hidden={!showEditView}>
        <ApplicationEditView isAdminFlow={false} isNew={isNew} selectDate={searchParams?.get(pageCommonConst.param.selectDate)} applicationId={applicationId} onReload={() => getPageList(pagerConst.initialCurrentPage)}></ApplicationEditView>
      </div>
    </div>
  );
};
