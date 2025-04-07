"use client"

import React, { useEffect, useState } from 'react';

import { useNotificationMessageStore } from '@/store/notificationMessageStore';
import usePageBack from '@/hooks/usePageBack';
import useSetPageTitle from '@/hooks/useSetPageTitle';
import { pageCommonConst } from '@/consts/pageCommonConst';
import SearchSelectUserView from '@/components/searchSelectUserView';
import { searchSelectConst } from '@/consts/searchSelectConst';
import { AcquisitionResult, getAggregateResults, GetAggregateResultsRequest, Period } from '@/api/getAggregateResults';
import { commonConst } from '@/consts/commonConst';

export default function AdminBookPage() {
  // 共通Store
  const { setNotificationMessageObject } = useNotificationMessageStore();
  // カスタムフック
  const pageBack = usePageBack();
  const pageTitle = useSetPageTitle();

  const [periodList, setPeriodList] = useState<Period[]>([]);
  const [currentSearchParams, setCurrentSearchParams] = useState({
    currentSearchUser: '',
    currentSearchMonths: '',
  });

  const [searchHandler, setSearchHandler] = useState({
    changeSearchUser: (val: string) => {
      currentSearchParams.currentSearchUser = val;
      setPeriodList([]);
      setCurrentSearchParams({
        ...currentSearchParams,
        currentSearchUser: val,
        currentSearchMonths: '',
      });
      getGrantPeriodList(val);
    },
    changeSearchPeriod: (val: string, periodList: Period[]) => {
      currentSearchParams.currentSearchMonths = val;
      const period = val.split("-");
      periodList?.forEach(item => {
        item.isShow = !val || item.months.toString() == val ? true : false;
      });
      setPeriodList(periodList);
      setCurrentSearchParams({
        ...currentSearchParams,
        currentSearchUser: currentSearchParams.currentSearchUser,
        currentSearchMonths: val,
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

    const req: GetAggregateResultsRequest = {
      userId: userId,
    }
    const res = await getAggregateResults(req);
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
   * 出力ボタン押下
   */
  const onOutput = () => {
    let url = `${pageCommonConst.path.adminBookDownload}?${pageCommonConst.param.userId}=${currentSearchParams.currentSearchUser}`;;
    if(currentSearchParams.currentSearchMonths) {
      url += `&${pageCommonConst.param.months}=${currentSearchParams.currentSearchMonths}`;
    }

    window.open(url, '_blank')
  };

    /**
   * 申請情報を別タブ表示
   */
    const onEditApplication = (applicationId: string) => {
      window.open(`${pageCommonConst.path.adminApplication}?${pageCommonConst.param.applicationId}=${applicationId}`, '_blank')
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
                  <select className="form-select" id="searchPeriod" value={currentSearchParams.currentSearchMonths} onChange={(e) => searchHandler.changeSearchPeriod(e.target.value, periodList)} disabled={!currentSearchParams.currentSearchUser}>
                    <option value=''>{searchSelectConst.label.all}</option>
                    {
                      periodList?.map((period: Period, index: number) => 
                        <option value={period.months} key={index}>{period.startDate}～{period.endDate}</option>
                      )
                    }
                  </select>
                </div>
              </div>
            </div>
            <div className="col-auto ms-2">
              <button className="btn btn-outline-primary" onClick={onOutput} disabled={!currentSearchParams.currentSearchUser}>出力</button>
            </div>
            <div className="col ps-4 text-end" style={{marginTop: "-0.25rem"}}>
              <div className="row m-0">
                <p>
                  <span className="pe-1"><i className="bi bi-calendar3 text-info pe-1"></i>全休/半休</span>
                  <span className="ps-2 pe-3"><i className="bi bi-clock-history text-warning pe-1"></i>時間単位</span>
                </p>
                <p>
                  <span className=""><i className="bi bi-check-circle-fill text-success pe-1"></i>承認完了</span>
                  <span className="ps-3"><i className="bi bi-check opacity-25 pe-1"></i>承認未完了</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-2" hidden={!periodList.length}>
          {
            periodList?.map((period: Period, index: number) =>
              <div key={index} hidden={!period.isShow}>
                <div className="row border-bottom pb-1">
                  <h6 className="col ps-2">{period.startDate}～{period.endDate}</h6>
                  <p className="col-auto pe-4 m-0">
                    <span className="text-info"><i className="bi bi-calendar3"></i></span>
                    <span className="ps-1"><i className="bi bi-check-circle-fill text-success pe-1"></i>:</span>
                    <span className="ps-2 pe-4">{period.currentYearTotalDeleteTime}時間({period.currentYearTotalDeleteDays}日)</span>
                    <span className="text-warning"><i className="bi bi-clock-history"></i></span>
                    <span className="ps-1"><i className="bi bi-check-circle-fill text-success pe-1"></i>:</span>
                    <span className="ps-2">{period.currentYearTotalDeleteTimeHourUnit}時間</span>
                  </p>
                  <p className="col-auto m-0"><span className="badge text-bg-primary" hidden={!(period.isGranted && period.isValid)}>有効</span></p>
                  <p className="col-auto m-0"><span className="badge text-bg-secondary" hidden={!(period.isGranted && !period.isValid)}>無効</span></p>
                  <p className="col-auto m-0"><span className="badge text-bg-warning" hidden={!!period.isGranted}>未設定</span></p>
                  <p className="col-auto m-0 ps-1" style={{width: "8rem"}}>付与日数<span className="pe-1"></span>{period.grantRuleAddDays}<span>日</span></p>
                </div>
                <p className="ps-2 pb-1 m-0" hidden={!!period.acquisitionResults.length}>-</p>
                <div className="overflow-auto pt-1">
                  <table className="table" style={{width: `auto`}} hidden={!period.acquisitionResults.length}>
                    <thead className="table-light">
                      <tr className="text-center" style={{lineHeight: "0.75rem"}}>
                        {
                          period?.acquisitionResults?.map((acquisitionResult: AcquisitionResult, i: number) =>
                            <th scope="row" key={i}>
                              <span>{acquisitionResult.acquisitionDate}</span>
                              <span className="ps-1">({acquisitionResult.weekday})</span>
                            </th>
                          )
                        }
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {
                          period?.acquisitionResults?.map((acquisitionResult: AcquisitionResult, i: number) =>
                            <React.Fragment key={i}>
                              <td className="text-center cursor-pointer" style={{lineHeight: "1rem"}} onClick={() => onEditApplication(acquisitionResult.applicationId)}>
                                <p className="text-nowrap pb-1">
                                  <span className="text-info" hidden={acquisitionResult.classification === commonConst.APPLICATION_CLASSIFICATION_TIME_VALUE}><i className="bi-calendar3"></i></span>
                                  <span className="text-warning" hidden={acquisitionResult.classification !== commonConst.APPLICATION_CLASSIFICATION_TIME_VALUE}><i className="bi bi-clock-history"></i></span>
                                  <span className="ps-1">{acquisitionResult.totalTime}時間</span>
                                </p>
                                <p className="border-top pt-2">
                                  <span className="opacity-25" hidden={acquisitionResult.action === commonConst.actionValue.complete}><i className="bi bi-check"></i></span>
                                  <span className="text-success" hidden={acquisitionResult.action !== commonConst.actionValue.complete}><i className="bi bi-check-circle-fill"></i></span>
                                </p>
                              </td>
                            </React.Fragment>
                          )
                        }
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};
