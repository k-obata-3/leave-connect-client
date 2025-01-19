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
import SearchSelectUserView from '@/components/searchSelectUserView';
import SearchSelectYearView from '@/components/searchSelectYearView';
import SearchSelectStatusView from '@/components/searchSelectStatusView';
import SearchSelectTypeView from '@/components/searchSelectTypeView';

export default function AdminApplicationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 共通Store
  const { setNotificationMessageObject } = useNotificationMessageStore();
  // 戻るボタン カスタムフック
  const pageBack = usePageBack();
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [showEditView, setShowEditView] = useState(false);
  const [applicationList, setApplicationList] = useState<Application[]>([]);
  const [currentSearchParams, setCurrentSearchParams] = useState({
    currentSearchYear: new Date().getFullYear().toString(),
    currentSearchUser: '',
    currentSearchStatus: '',
    currentSearchType: '',
  });

  const [searchHandler, setSearchHandler] = useState({
    changeSearchYear: (val: string) => {
      currentSearchParams.currentSearchYear = val;
      getApplications(val, currentSearchParams.currentSearchUser, currentSearchParams.currentSearchStatus, currentSearchParams.currentSearchType, pagerParams.limit, pagerConst.initialCurrentPage);
    },
    changeSearchUser: (val: string) => {
      currentSearchParams.currentSearchUser = val;
      getApplications(currentSearchParams.currentSearchYear, val, currentSearchParams.currentSearchStatus, currentSearchParams.currentSearchType, pagerParams.limit, pagerConst.initialCurrentPage);
    },
    changeSearchStatus: (val: string) => {
      currentSearchParams.currentSearchStatus = val;
      getApplications(currentSearchParams.currentSearchYear, currentSearchParams.currentSearchUser, val, currentSearchParams.currentSearchType, pagerParams.limit, pagerConst.initialCurrentPage);
    },
    changeSearchType: (val: string) => {
      currentSearchParams.currentSearchType = val;
      getApplications(currentSearchParams.currentSearchYear, currentSearchParams.currentSearchUser, currentSearchParams.currentSearchStatus, val, pagerParams.limit, pagerConst.initialCurrentPage);
    },
  });

  const [pagerParams, setPagerParams] = useState({
    limit: pagerConst.adminApplicationListLimit,
    totalCount: pagerConst.initialTotalCount,
    currentPage: pagerConst.initialCurrentPage,
  })

  useEffect(() =>{
    (async() => {
      await getApplications(currentSearchParams.currentSearchYear, currentSearchParams.currentSearchUser, currentSearchParams.currentSearchStatus, currentSearchParams.currentSearchType, pagerParams.limit, pagerParams.currentPage);
    })()
  },[])

  useEffect(() =>{
    setApplicationId(searchParams?.get(pageCommonConst.param.applicationId) ? searchParams?.get(pageCommonConst.param.applicationId) : null);
  },[searchParams])

  useEffect(() =>{
    setShowEditView(!!applicationId);
    if(applicationId) {
      pageBack(true).then(() => {
        router.replace(pageCommonConst.path.adminApplication, {scroll: true});
      }).catch(() => {
        return true;
      })
    } else {
      pageBack(false);
    }
  },[applicationId])

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
  const getApplications = async(searchYear: string, searchUserId: string, searchAction: string, searchType: string, limit: number, currentPage: number) => {
    const req: GetApplicationListRequest = {
      searchUserId: searchUserId,
      searchAction: searchAction,
      searchYear: searchYear,
      searchType: searchType,
      limit: limit,
      offset: (currentPage - 1) * limit,
      isAdmin: true,
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
    getApplications(currentSearchParams.currentSearchYear, currentSearchParams.currentSearchUser, currentSearchParams.currentSearchStatus, currentSearchParams.currentSearchType, pagerParams.limit, page);
  }

  /**
   * 編集ボタン押下
   * @param id 
   */
  const onEdit = (id: string) => {
    router.push(`${pageCommonConst.path.adminApplication}?${pageCommonConst.param.applicationId}=${id}`, {scroll: true});
    pageBack(true).then(() => {
      router.replace(pageCommonConst.path.adminApplication, {scroll: true});
    }).catch(() => {
      return true;
    })
  };

  return (
    <div className="application-list">
      <div className="page-title pc-only">
        <h3>{showEditView ? pageCommonConst.pageName.applicationConfirm : pageCommonConst.pageName.adminApplication}</h3>
      </div>
      <div className="" hidden={showEditView}>
        <div className="row mb-2">
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
            <div className="col-12 search_select_user_width">
              <SearchSelectUserView callback={searchHandler.changeSearchUser} currentValue={currentSearchParams.currentSearchUser}></SearchSelectUserView>
            </div>
          </div>
        </div>
        <ApplicationListView applicationList={applicationList} rowBtnHandler={onEdit}></ApplicationListView>
        <Pager params={{pageClickFnc: getPageList, limit: pagerParams.limit, totalCount: pagerParams.totalCount, page: pagerParams.currentPage}} />
      </div>
      <div hidden={!showEditView}>
        <ApplicationEditView isAdminFlow={true} isNew={false} selectDate={null} applicationId={applicationId} onReload={() => getPageList(pagerConst.initialCurrentPage)}></ApplicationEditView>
      </div>
    </div>
  );
};
