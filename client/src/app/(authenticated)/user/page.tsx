"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useNotificationMessageStore } from '@/store/notificationMessageStore';
import usePageBack from '@/hooks/usePageBack';
import useSetPageTitle from '@/hooks/useSetPageTitle';
import { pageCommonConst } from '@/consts/pageCommonConst';
import { pagerConst } from '@/consts/pagerConst';
import { GetUserListRequest, GetUserListResponse, User, getUserList } from '@/api/getUserList';
import Pager from '@/components/pager';
import UserListView from './userListView';
import UserEditView from './userEditView';

export default function UserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 共通Store
  const { setNotificationMessageObject } = useNotificationMessageStore();
  // カスタムフック
  const pageBack = usePageBack();
  const pageTitle = useSetPageTitle();

  const [userId, setUserId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [showEditView, setShowEditView] = useState(false);
  const [userList, setUserList] = useState<User[]>([]);
  const [pagerParams, setPagerParams] = useState({
    limit: pagerConst.userListLimit,
    totalCount: pagerConst.initialTotalCount,
    currentPage: pagerConst.initialCurrentPage,
  })

  useEffect(() =>{
    (async() => {
      await getList(pagerParams.limit, pagerParams.currentPage);
    })();
  },[])

  useEffect(() =>{
    setIsNew(searchParams?.get(pageCommonConst.param.isNew) ? true : false);
    setUserId(searchParams?.get(pageCommonConst.param.userId) ? searchParams?.get(pageCommonConst.param.userId) : null);
  },[searchParams])

  useEffect(() =>{
    const isEdit = userId || isNew;
    setShowEditView(!!isEdit);
    pageTitle(!!isEdit ? isNew ? pageCommonConst.pageName.userNew : pageCommonConst.pageName.userEdit : pageCommonConst.pageName.user);
    if(isEdit) {
      pageBack(true).then(() => {
        router.replace(pageCommonConst.path.user, {scroll: true});
      }).catch(() => {
        return true;
      })
    } else {
      pageBack(false);
    }
  },[userId, isNew])

  /**
   * ユーザ一覧取得
   * @param searchStep 
   * @param limit 
   * @param currentPage 
   * @returns 
   */
  const getList = async(limit: number, currentPage: number) => {
    const req: GetUserListRequest = {
      limit: limit,
      offset: (currentPage - 1) * limit,
    }

    const res: GetUserListResponse = await getUserList(req);
    if(res.responseResult) {
      setUserList(res.userList);
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
    setUserList([]);
    getList(pagerParams.limit, page);
  }

  /**
   * 編集ボタン押下
   * @param userId 
   */
  const onEdit = (userId: string) => {
    router.push(`${pageCommonConst.path.user}?${pageCommonConst.param.userId}=${userId}`, {scroll: true});
    pageBack(true).then(() => {
      router.replace(pageCommonConst.path.user, {scroll: true});
    }).catch(() => {
      return true;
    })
  };

  /**
   * 新規登録ボタン押下
   * @param id 
   */
  const onCreateNewUser = () => {
    router.push(`${pageCommonConst.path.user}?${pageCommonConst.param.isNew}=true`, {scroll: true});
  };

  return (
    <div className="user-list">
      <div className="sp-only text-center">{pageCommonConst.notSupportMessage}</div>
      <div className="pc-only">
        <div className="" hidden={!!showEditView}>
          <div className="row mb-2">
            <div className="col-4 col-md-2 text-start pc-only">
              <button className="btn btn-outline-primary" onClick={onCreateNewUser}>{pageCommonConst.pageName.userNew}</button>
            </div>
          </div>
          <UserListView userList={userList} rowBtnHandler={onEdit}></UserListView>
          <Pager params={{pageClickFnc: getPageList, limit: pagerParams.limit, totalCount: pagerParams.totalCount, page: pagerParams.currentPage}} />
        </div>
        <div className="col-xl-10 offset-xl-1" hidden={!showEditView}>
          <UserEditView userPrimaryId={userId} isNew={isNew} onReload={() => getPageList(pagerConst.initialCurrentPage)}></UserEditView>
        </div>
      </div>
    </div>
  );
};
