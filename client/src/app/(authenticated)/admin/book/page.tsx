"use client"

import React, { useEffect, useState } from 'react';

import { useNotificationMessageStore } from '@/store/notificationMessageStore';
import usePageBack from '@/hooks/usePageBack';
import useSetPageTitle from '@/hooks/useSetPageTitle';
import { pageCommonConst } from '@/consts/pageCommonConst';
import SearchSelectUserView from '@/components/searchSelectUserView';
import { searchSelectConst } from '@/consts/searchSelectConst';
import { AcquisitionResult, getGrantPeriods, GetGrantPeriodsRequest, Period } from '@/api/getGrantPeriods';

export default function AdminBookPage() {
  // 共通Store
  const { setNotificationMessageObject } = useNotificationMessageStore();
  // カスタムフック
  const pageBack = usePageBack();
  const pageTitle = useSetPageTitle();

  const [periodList, setPeriodList] = useState<Period[]>([]);
  const [currentSearchParams, setCurrentSearchParams] = useState({
    currentSearchUser: '',
    currentSearchPeriod: '',
  });

  const [searchHandler, setSearchHandler] = useState({
    changeSearchUser: (val: string) => {
      currentSearchParams.currentSearchUser = val;
      setPeriodList([]);
      setCurrentSearchParams({
        ...currentSearchParams,
        currentSearchUser: val,
        currentSearchPeriod: '',
      });
      getGrantPeriodList(val);
    },
    changeSearchPeriod: (val: string, periodList: Period[]) => {
      currentSearchParams.currentSearchPeriod = val;
      const period = val.split("-");
      if(period.length == 2) {
        periodList?.forEach(item => {
          item.isShow = item.startDate == period[0] && item.endDate == period[1] ? true : false;
        });
      } else {
        periodList?.forEach(item => {
          item.isShow = true;
        });
      }
      setPeriodList(periodList);
      setCurrentSearchParams({
        ...currentSearchParams,
        currentSearchUser: currentSearchParams.currentSearchUser,
        currentSearchPeriod: val,
      });
    },
  });

  useEffect(() =>{
    pageTitle(pageCommonConst.pageName.adminBook);
    pageBack(false);
  },[])

  const getGrantPeriodList = async(userId: string) => {
    if(!userId) {
      return;
    }

    const req: GetGrantPeriodsRequest = {
      userId: userId,
    }

    const res = await getGrantPeriods(req);
    if(res.responseResult) {
      res.periods?.forEach(item => {
        item.isShow = true
      });
      setPeriodList(res.periods);
    } else {
      setNotificationMessageObject({
        errorMessageList: res.message ? [res.message] : [],
        inputErrorMessageList: [],
      })
    }
  }

  /**
   * 集計ボタン押下
   */
  const onOutput = () => {
    window.open(`${pageCommonConst.path.adminBookDownload}?${pageCommonConst.param.userId}=${currentSearchParams.currentSearchUser}`, '_blank')
  };

  return (
    <div className="admin-book-page">
      <div className="sp-only text-center">{pageCommonConst.notSupportMessage}</div>
      <div className="pc-only">
        <div className="row mb-2">
          {/* 検索条件 */}
          <div className="col row d-flex justify-content-start">
            <div className="col-12 search_select_user_width">
              <SearchSelectUserView callback={searchHandler.changeSearchUser} currentValue={currentSearchParams.currentSearchUser} label="ユーザ" hiddenSelectAll={true}></SearchSelectUserView>
            </div>
            <div className="col-auto">
              <div className="row align-items-center">
                <div className="col-auto text-end search_select_label_width">
                  <label className="col-form-label ms-2 me-2" htmlFor="searchPeriod">対象期間</label>
                </div>
                <div className="col-auto" style={{width: "250px"}}>
                  <select className="form-select" id="searchPeriod" value={currentSearchParams.currentSearchPeriod} onChange={(e) => searchHandler.changeSearchPeriod(e.target.value, periodList)} disabled={!currentSearchParams.currentSearchUser}>
                    <option value=''>{searchSelectConst.label.all}</option>
                    {
                      periodList?.map((period: Period, index: number) => 
                        <option value={`${period.startDate}-${period.endDate}`} key={index}>{period.startDate}～{period.endDate}</option>
                      )
                    }
                  </select>
                </div>
              </div>
            </div>
            <div className="col-auto ms-2">
              <button className="btn btn-outline-primary" onClick={onOutput} disabled={!currentSearchParams.currentSearchUser}>出力</button>
            </div>
          </div>
        </div>
        <div className="pt-2" hidden={!periodList.length}>
          {
            periodList?.map((period: Period, index: number) =>
              <div key={index} hidden={!period.isShow}>
                <h6 className='border-bottom ps-4'>{period.startDate}～{period.endDate}</h6>
                <p className="ps-2 pb-2 mb-0" hidden={!!period.acquisitionResults.length}>-</p>
                <table className="table" style={{width: `${period.acquisitionResults.length * 5}rem`}} hidden={!period.acquisitionResults.length}>
                  <thead className="table-light">
                    <tr className="text-center" style={{lineHeight: "0.75rem"}}>
                      {
                        period?.acquisitionResults?.map((acquisitionResult: AcquisitionResult, i: number) =>
                          <th scope="col" key={i}>{acquisitionResult.acquisitionDate.substring(5)}</th>
                        )
                      }
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {
                        period?.acquisitionResults?.map((acquisitionResult: AcquisitionResult, i: number) =>
                          <td className="text-center" key={i} style={{lineHeight: "0.5rem"}}>
                            <p className="text-nowrap">{acquisitionResult.totalTime}時間</p>
                          </td>
                        )
                      }
                    </tr>
                  </tbody>
                </table>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};
