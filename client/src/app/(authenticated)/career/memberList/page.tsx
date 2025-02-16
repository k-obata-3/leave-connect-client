"use client"

import React, { useEffect, useState } from 'react';

import { useNotificationMessageStore } from '@/store/notificationMessageStore';
import { useUserInfoStore } from '@/store/userInfoStore';
import usePageBack from '@/hooks/usePageBack';
import useSetPageTitle from '@/hooks/useSetPageTitle';
import { commonConst } from '@/consts/commonConst';
import { pageCommonConst } from '@/consts/pageCommonConst';
import { pagerConst } from '@/consts/pagerConst';
import { CareerDictionary, getCareerDictionary, GetCareerDictionaryRequest, GetCareerDictionaryResponse } from '@/api/getCareerDictionary';
import { CareerUser, getCareerUserList, GetCareerUserListRequest } from '@/api/getCareerUserList';
import { outputSkillsheet, OutputSkillsheetRequest } from '@/api/outputSkillsheet';
import Pager from '@/components/pager';
import CareerDetailView from './careerDetailView';

export default function CareerMemberList() {
  // 共通Store
  const { setNotificationMessageObject } = useNotificationMessageStore();
  const { getUserInfo, isAdmin } = useUserInfoStore();

  // カスタムフック
  const pageBack = usePageBack();
  const pageTitle = useSetPageTitle();

  const [showDetailView, setShowDetailView] = useState(false);
  const [isDownload, setIsDownload] = useState(false);
  const [careerUserList, setCareerUserList] = useState<CareerUser[]>([]);
  const [selectCareerUser, setSelectCareerUser] = useState<CareerUser | null>(null);
  const [careerDetail, setCareerDetail] = useState<CareerDictionary | null>(null);

  const [pagerParams, setPagerParams] = useState({
    limit: pagerConst.applicationListLimit,
    totalCount: pagerConst.initialTotalCount,
    currentPage: pagerConst.initialCurrentPage,
  })

  useEffect(() =>{
    pageTitle(pageCommonConst.pageName.career);
    pageBack(false);
  },[])

  useEffect(() =>{
    (async() => {
      await getUserList(pagerParams.limit, pagerParams.currentPage);
    })()
  },[])

  const getUserList = async(limit: number, currentPage: number) => {
    const req: GetCareerUserListRequest = {
      limit: limit,
      offset: (currentPage - 1) * limit,
    }
    const res = await getCareerUserList(req);
    if(res.responseResult) {
      setCareerUserList(res.careerUserList);
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
    setCareerUserList([]);
    getUserList(pagerParams.limit, page);
  }

  const callback = async(reload: boolean) => {
    setShowDetailView(false);
  };

  const showCareerDetailView = async(careerUser: CareerUser) => {
    const req: GetCareerDictionaryRequest = {
      userId: careerUser.userId.toString(),
    }
    const res: GetCareerDictionaryResponse = await getCareerDictionary(req);
    if(res.responseResult) {
      setSelectCareerUser(careerUser);
      setCareerDetail(res.careerDictionary);
      setShowDetailView(true);
    } else {
      setNotificationMessageObject({
        errorMessageList: res.message ? [res.message] : [],
        inputErrorMessageList: [],
      })
    }
  }

  const onOutput = (careerUser: CareerUser) => {
    // window.open(pageCommonConst.path.login)
    fileOutput(careerUser);
  }

  const fileOutput = async(careerUser: CareerUser) => {
    setIsDownload(true);
    const req: OutputSkillsheetRequest = {
      userId: careerUser.userId.toString(),
    }
    const res = await outputSkillsheet(req);
    if(res.responseResult) {
      const url = window.URL.createObjectURL(res.result.blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = res.result.fileName;
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setIsDownload(false);
    } else {
      setIsDownload(false);
      setNotificationMessageObject({
        errorMessageList: res.message ? [res.message] : [],
        inputErrorMessageList: [],
      })
    }
  }

  return (
    <div className="career-member-list-page">
      <div className="row pb-2">
        {
          careerUserList?.map((careerUser: CareerUser, index: number) => (
            <div className="col-12 col-xl-3 col-md-4 p-2" key={index}>
              <div className="custom-card mb-2">
                <div className="custom-card-header row ps-2 pe-2">
                  <h6 className="col text-truncate">{careerUser.fullName}</h6>
                  <span className="col-auto me-1" hidden={careerUser.status == commonConst.userEffectiveStatus}>
                    <i className="bi bi-ban-fill text-danger"></i>
                  </span>
                  <div className="col-auto" hidden={!isAdmin() && getUserInfo().id != careerUser.userId.toString()}>
                    <button className="btn btn-outline-secondary btn-sm me-auto" onClick={() => onOutput(careerUser)}>出力</button>
                  </div>
                </div>
                <div className="custom-card-body career-member-card-body" onClick={() => showCareerDetailView(careerUser)} style={{cursor: 'pointer'}}>
                  <div className="text-truncate text-wrap" style={{maxHeight: '100%', width: '100%'}}>
                    {
                      careerUser.careerItem?.map((item: string, i: number) => {
                        return (
                        <div className="career-item-badge bg-primary-subtle" key={i}>
                          <span>{item}</span>
                        </div>
                        )
                      })
                    }
                    <span className="" hidden={!!careerUser.careerItem.length}>未登録</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
      <Pager params={{pageClickFnc: getPageList, limit: pagerParams.limit, totalCount: pagerParams.totalCount, page: pagerParams.currentPage}} />
      <CareerDetailView isShow={showDetailView} user={selectCareerUser} detail={careerDetail} callback={callback}></CareerDetailView>
    </div>
  );
};
