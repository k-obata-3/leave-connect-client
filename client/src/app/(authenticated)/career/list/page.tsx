"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useNotificationMessageStore } from '@/store/notificationMessageStore';
import usePageBack from '@/hooks/usePageBack';
import { pageCommonConst } from '@/consts/pageCommonConst';
import { pagerConst } from '@/consts/pagerConst';
import { Career, getCareerList, GetCareerListRequest, GetCareerListResponse } from '@/api/getCareerList';
import Pager from '@/components/pager';
import CareerListView from './careerListView';
import CareerEditView from './careerEditView';

export default function CareerList() {
  const router = useRouter();
  const searchParams = useSearchParams();


  // 共通Store
  const { setNotificationMessageObject } = useNotificationMessageStore();
  // 戻るボタン カスタムフック
  const pageBack = usePageBack();
  const [careerId, setCareerId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [showEditView, setShowEditView] = useState(false);
  const [careerList, setCareerList] = useState<Career[]>([]);

  const [pagerParams, setPagerParams] = useState({
    limit: pagerConst.applicationListLimit,
    totalCount: pagerConst.initialTotalCount,
    currentPage: pagerConst.initialCurrentPage,
  })

  useEffect(() =>{
    (async() => {
      await getCareers(pagerParams.limit, pagerParams.currentPage);
    })()
  },[])

  useEffect(() =>{
    setIsNew(searchParams?.get(pageCommonConst.param.isNew) ? true : false);
    setCareerId(searchParams?.get(pageCommonConst.param.careerId) ? searchParams?.get(pageCommonConst.param.careerId) : null);
  },[searchParams])

  useEffect(() =>{
    setShowEditView(!!(careerId || isNew));
    if(careerId || isNew) {
      pageBack(true).then(() => {
        router.replace(`${pageCommonConst.path.careerList}`, {scroll: true});
      }).catch(() => {
        return true;
      })
    } else {
      pageBack(false);
    }
  },[careerId, isNew])

  const getCareers = async(limit: number, currentPage: number) => {
    const req: GetCareerListRequest = {
      limit: limit,
      offset: (currentPage - 1) * limit,
    }
    const res: GetCareerListResponse = await getCareerList(req);
    if(res.responseResult) {
      setCareerList(res.careerList);
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
    setCareerList([]);
    getCareers(pagerParams.limit, page);
  }

  /**
   * 編集ボタン押下
   * @param id 
   */
  const onEdit = (id: string) => {
    router.push(`${pageCommonConst.path.careerList}?${pageCommonConst.param.careerId}=${id}`, {scroll: true});
    pageBack(true).then(() => {
      router.replace(pageCommonConst.path.careerList, {scroll: true});
    }).catch(() => {
      return true;
    })
  };

  /**
   * 新規作成ボタン押下
   * @param id 
   */
  const onCreateNewCareer = () => {
    router.push(`${pageCommonConst.path.careerList}?${pageCommonConst.param.isNew}=true`, {scroll: true});
  };

  return (
    <div className="career-list-page">
      <div className="page-title pc-only">
        <h3>{showEditView ? isNew ? pageCommonConst.pageName.careerNew : pageCommonConst.pageName.careerEdit : pageCommonConst.pageName.careerList}</h3>
      </div>
      <div className="" hidden={showEditView}>
        <div className="row mb-2">
          <div className="col-4 col-md-2 text-start pc-only">
            <button className="btn btn-outline-primary" onClick={onCreateNewCareer}>{pageCommonConst.pageName.careerNew}</button>
          </div>
        </div>
        <CareerListView careerList={careerList} rowBtnHandler={onEdit}></CareerListView>
        <Pager params={{pageClickFnc: getPageList, limit: pagerParams.limit, totalCount: pagerParams.totalCount, page: pagerParams.currentPage}} />
      </div>
      <div hidden={!showEditView}>
        <CareerEditView careerId={careerId} isNew={isNew} onReload={() => getPageList(pagerConst.initialCurrentPage)}></CareerEditView>
      </div>
      <div className="new-career-btn sp-only" hidden={showEditView}>
          <button className="btn btn-primary" onClick={() => router.push(`${pageCommonConst.path.careerList}?${pageCommonConst.param.isNew}=true`)}><i className="bi bi-plus"></i></button>
        </div>
    </div>
  );
};
