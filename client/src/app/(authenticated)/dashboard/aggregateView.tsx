"use client"

import React, { useEffect, useState } from 'react';

import { useUserInfoStore } from '@/store/userInfoStore';
import { commonConst } from '@/consts/commonConst';
import { pageCommonConst } from '@/consts/pageCommonConst';
import { AcquisitionResult, getAggregateResults, GetAggregateResultsRequest, GetAggregateResultsResponse, Period } from '@/api/getAggregateResults';

type Props = {

}

export default function AggregateView({ }: Props) {
  const { getUserInfo } = useUserInfoStore();
  const [periods, setPeriods] = useState<Period[] | []>();
  const [message, setMessage] = useState<string>("");

  useEffect(() =>{
    (async() => {
      setPeriods([])

      const req: GetAggregateResultsRequest = {
        userId: getUserInfo().id
      }
      await getAggregateResults(req).then(async(res: GetAggregateResultsResponse) => {
        if(res.responseResult) {
          if(res.periods.length) {
            setPeriods(res.periods?.filter(period => period.isValid));
          } else {
            setMessage("休暇情報が存在しません");
          }
        } else {
          setMessage(res.message!);
        }
      });
    })()
  },[])

  const getStatusColrClassName = (acquisitionResult: AcquisitionResult) => {
    if(acquisitionResult.action === commonConst.actionValue.panding) {
      // 承認待ち
      return 'pending';
    } else if(acquisitionResult.action === commonConst.actionValue.complete) {
      // 完了
      return 'complete';
    } else if(acquisitionResult.action === commonConst.actionValue.reject) {
      // 差戻
      return 'reject';
    } else {
      return 'none';
    }
  }

  return (
    <div className="custom-card">
      <div className="custom-card-header">
        <h6>{pageCommonConst.pageName.aggregateApplication}</h6>
      </div>
      <div className="custom-card-body text-danger text-center">{message}</div>
      <div className="custom-card-body" hidden={!periods?.length}>
        {
          periods?.map((period: Period, index: number) =>
            <div key={index}>
              <div className="row pb-1 ps-1">
                <h6 className="col">{period.startDate}～{period.endDate}</h6>
                <p className="col-auto m-0 pe-3"><span className="pe-2">{period.isGranted ? "付与日数" : "付与予定日数"}:</span>{period.grantRuleAddDays}<span>日</span></p>
                </div>
              <p className="ps-2 pb-2 mb-0" hidden={!!period.acquisitionResults.length}>-</p>
              <div className="ps-2 pe-2" hidden={!period.acquisitionResults.length}>
                <table className="table">
                  <thead className="table-light">
                    <tr className="text-center" style={{lineHeight: "1rem"}}>
                      <th scope="row" className="text-nowrap">取得日</th>
                      <th scope="row" className="text-nowrap">曜日</th>
                      <th scope="row" className="text-nowrap">取得時間</th>
                      <th scope="row" className="text-nowrap">ステータス</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      period?.acquisitionResults?.map((acquisitionResult: AcquisitionResult, i: number) => (
                        <tr key={i} style={{lineHeight: "1rem"}}>
                          <td className="col-auto text-center">
                            <p className="text-nowrap">{acquisitionResult.acquisitionDate}</p>
                          </td>
                          <td className="col-auto text-center">
                            <p className="text-nowrap">{acquisitionResult.weekday}</p>
                          </td>
                          <td className="col-auto text-center">
                            <p className="text-wrap">{acquisitionResult.totalTime}時間</p>
                          </td>
                          <td className="col text-center">
                            <span className="col-12" hidden={acquisitionResult.applicationType !== commonConst.PAID_HOLIDAY_REGULATE_TYPE_VALUE}>{acquisitionResult.applicationTypeName}</span>
                            <span className={`col-12 badge status-color ${getStatusColrClassName(acquisitionResult)}`} hidden={acquisitionResult.applicationType === commonConst.PAID_HOLIDAY_REGULATE_TYPE_VALUE}>{acquisitionResult.actionName}</span>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
};
