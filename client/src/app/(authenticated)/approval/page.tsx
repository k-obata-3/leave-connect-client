"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useUserInfoStore } from '@/store/userInfoStore';
import { useNotificationMessageStore } from '@/store/notificationMessageStore';
import usePageBack from '@/hooks/usePageBack';
import { pageCommonConst } from '@/consts/pageCommonConst';
import { searchSelectConst } from '@/consts/searchSelectConst';
import { pagerConst } from '@/consts/pagerConst';
import { Approval, GetApprovalTaskListRequest, GetApprovalTaskListResponse, getApprovalTaskList } from '@/api/getApprovalTaskList';
import Pager from '@/components/pager';
import ApprovalListView from '@/components/approvalListView';
import ApprovalEditView from '@/components/approvalEditView';
import SearchSelectUserView from '@/components/searchSelectUserView';
import SearchSelectStatusView from '@/components/searchSelectStatusView';

export default function ApprovalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 共通Store
  const { getUserInfo } = useUserInfoStore();
  const { setNotificationMessageObject } = useNotificationMessageStore();
  // 戻るボタン カスタムフック
  const pageBack = usePageBack();
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [showEditView, setShowEditView] = useState(false);
  const [approvalList, setApprovalList] = useState<Approval[]>([]);
  const [currentSearchParams, setCurrentSearchParams] = useState({
    currentSearchYear: '',
    currentSearchUser: '',
    currentSearchStatus: '1'
  });
  const [searchHandler, setSearchHandler] = useState({
    changeSearchYear: (val: string) => {},
    changeSearchUser: (val: string) => {
      currentSearchParams.currentSearchUser = val;
      getApprovalTasks(val, currentSearchParams.currentSearchStatus, pagerParams.limit, pagerConst.initialCurrentPage);
    },
    changeSearchStatus: (val: string) => {
      currentSearchParams.currentSearchStatus = val;
      getApprovalTasks(currentSearchParams.currentSearchUser, val, pagerParams.limit, pagerConst.initialCurrentPage);
    },
  });
  const [pagerParams, setPagerParams] = useState({
    limit: pagerConst.approvalListLimit,
    totalCount: pagerConst.initialTotalCount,
    currentPage: pagerConst.initialCurrentPage,
  })

  useEffect(() =>{
    (async() => {
      await getApprovalTasks(currentSearchParams.currentSearchUser, currentSearchParams.currentSearchStatus, pagerParams.limit, pagerParams.currentPage);
    })();
  },[])

  useEffect(() =>{
    setTaskId(searchParams?.get(pageCommonConst.param.taskId) ? searchParams?.get(pageCommonConst.param.taskId) : null);
    setApplicationId(searchParams?.get(pageCommonConst.param.applicationId) ? searchParams?.get(pageCommonConst.param.applicationId) : null);
  },[searchParams])

  useEffect(() =>{
    setShowEditView(!!taskId);
    if(taskId) {
      pageBack(true).then(() => {
        router.replace(`${pageCommonConst.path.approval}`, {scroll: true});
      }).catch(() => {
        return true;
      })
    } else {
      pageBack(false);
    }
  },[taskId])

  /**
   * 承認一覧取得
   * @param applicationUserId 
   * @param searchAction 
   * @param limit 
   * @param currentPage 
   * @returns 
   */
  const getApprovalTasks = async(applicationUserId: string, searchAction: string, limit: number, currentPage: number) => {
    const req: GetApprovalTaskListRequest = {
      searchUserId: applicationUserId,
      searchAction: searchAction,
      limit: limit,
      offset: (currentPage - 1) * limit,
    }

    const res: GetApprovalTaskListResponse = await getApprovalTaskList(req);
    if(res.responseResult) {
      setApprovalList(res.approvalList);
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
    setApprovalList([]);
    getApprovalTasks(currentSearchParams.currentSearchUser, currentSearchParams.currentSearchStatus, pagerParams.limit, page);
  }

  /**
   * 編集ボタン押下
   * @param taskId 
   * @param applicationId 
   */
  const onEdit = (taskId: string, applicationId: string) => {
    router.push(`${pageCommonConst.path.approval}?${pageCommonConst.param.taskId}=${taskId}&${pageCommonConst.param.applicationId}=${applicationId}`, {scroll: true});
    pageBack(true).then(() => {
      router.replace(`${pageCommonConst.path.approval}`, {scroll: true});
    }).catch(() => {
      return true;
    })
  };

  return (
    <div className="approval-list">
      <div className="page-title pc-only">
        <h3>{showEditView ? pageCommonConst.pageName.approvalEdit : pageCommonConst.pageName.approval}</h3>
      </div>
      <div className="" hidden={!!showEditView}>
        <div className="row mb-2">
          {/* 検索条件 */}
          <div className="col row d-flex justify-content-end">
            <div className="col-12 search_select_status_width">
              <SearchSelectStatusView callback={searchHandler.changeSearchStatus} currentValue={currentSearchParams.currentSearchStatus} label={searchSelectConst.label.action}></SearchSelectStatusView>
            </div>
            <div className="col-12 search_select_user_width">
              <SearchSelectUserView callback={searchHandler.changeSearchUser} currentValue={currentSearchParams.currentSearchUser}></SearchSelectUserView>
            </div>
          </div>
        </div>
        <ApprovalListView approvalList={approvalList} rowBtnHandler={onEdit}></ApprovalListView>
        <Pager params={{pageClickFnc: getPageList, limit: pagerParams.limit, totalCount: pagerParams.totalCount, page: pagerParams.currentPage}} />
      </div>
      <div hidden={!showEditView}>
        <ApprovalEditView taskId={taskId} applicationId={applicationId} onReload={() => getPageList(pagerConst.initialCurrentPage)}></ApprovalEditView>
      </div>
    </div>
  );
};
