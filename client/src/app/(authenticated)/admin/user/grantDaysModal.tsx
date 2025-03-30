"use client"

import { useEffect, useState } from "react";

import { getGrantDays, GetGrantDaysRequest, GetGrantDaysResponse, GrantPeriod } from "@/api/getGrantDays";
import { updateGrantDays, UpdateGrantDaysRequest, UpdateGrantDaysResponse } from "@/api/updateGrantDays";
import { confirmModalConst } from "@/consts/confirmModalConst";
import { UserDetails } from "@/api/getUserDetails";

type Props = {
  userDetails: UserDetails | undefined,
  isShow: boolean,
  callback: (reload: boolean) => void,
}

export default function GrantDaysModal({ userDetails, isShow, callback }: Props) {
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  const [grantPeriods, setGrantPeriods] = useState<GrantPeriod[] | []>();

  useEffect(() =>{
    (async() => {
      if(!(userDetails && isShow)) {
        callback(false);
        return;
      }

      setApiErrors([]);
      setGrantPeriods([])

      const request: GetGrantDaysRequest = {
        userId: userDetails.id.toString(),
      }

      await getGrantDays(request).then(async(res: GetGrantDaysResponse) => {
        if(res.responseResult) {
          setGrantPeriods(res.grantPeriods);
        } else {
          setApiErrors(res.message ? [res.message] : [])
        }
      });
    })()
  },[isShow])

  /**
   * 更新ボタン押下
   * @returns 
   */
  const onUpdateGrantDays = async() => {
    if(!userDetails) {
      return;
    }

    const request: UpdateGrantDaysRequest = {
      userId: userDetails.id.toString(),
    }

    await updateGrantDays(request).then(async(res: UpdateGrantDaysResponse) => {
      if(res.responseResult) {
        callback(true);
      } else {
        setApiErrors(res.message ? [res.message] : [])
      }
    });
  };

  return (
    <div className={isShow ? "custom-modal-overview modal-show" : "custom-modal-overview"}>
      <div className="custom-modal-content col-12 col-md-10 offset-md-1" hidden={!isShow}>
        <div className="custom-modal-header">
          <div className="me-1"><i className="bi bi-question-circle-fill text-primary fs-4"></i></div>
            <h5 className="flex-grow-1 m-0">{confirmModalConst.label.confirm}</h5>
          <button className="btn btn-outline-default" onClick={() => callback(false)}><i className="bi bi-x-lg"></i></button>
        </div>
        <div className="custom-modal-content-body">
          <div className="alert alert-danger pt-2 pb-2 mt-1 ms-3 me-3 mb-2" role="alert" hidden={!apiErrors.length}>
            {
              apiErrors.filter(msg => msg).map((msg, index) => {
                return<p className="m-0" key={index}>{msg}</p>
              })
            }
          </div>
          <p className=" text-center m-0">{confirmModalConst.message.settingGrantDays}</p>
          <p className="text-center text-warning mt-2" hidden={!!apiErrors.length || !!grantPeriods?.length}>基準日を迎えていないため設定できません。</p>
          <p className="text-center text-warning mt-2" hidden={!grantPeriods?.length || !!grantPeriods?.filter(period => !period.isGranted).length}>設定は不要です。</p>
          <div>
            <table className="table" style={{width: "28rem"}}>
              <thead></thead>
              <tbody className="">
                <tr className="text-center" style={{lineHeight: "0.75rem"}}>
                  <th scope="col" className="table-light" style={{width: "6rem"}}>基準日</th>
                  <td style={{width: "8rem"}}>{userDetails?.referenceDate}</td>
                  <th scope="col" className="table-light" style={{width: "6rem"}}>稼働日数</th>
                  <td style={{width: "8rem"}}>{userDetails?.workingDays}日</td>
                </tr>
              </tbody>
            </table>
            <table className="table" hidden={!grantPeriods?.length}>
              <thead className="table-light">
                <tr className="text-center" style={{lineHeight: "0.75rem"}}>
                  <th scope="row">勤続期間</th>
                  <th scope="row">通算月数</th>
                  <th scope="row">対象期間</th>
                  <th scope="row">規定付与日数</th>
                  <th scope="row">付与状況</th>
                </tr>
              </thead>
              <tbody>
                {
                  grantPeriods?.map((period: GrantPeriod, index: number) =>
                    <tr key={index}>
                      <td className="text-center" style={{lineHeight: "0.5rem", width: "6rem"}}>
                        <p className="text-nowrap">{period.totalYear}</p>
                      </td>
                      <td className="text-center" style={{lineHeight: "0.5rem", width: "6rem"}}>
                        <p className="text-nowrap">{period.months}</p>
                      </td>
                      <td className="text-center" style={{lineHeight: "0.5rem", width: "14rem"}}>
                        <p className="text-nowrap">
                          <span>{period.startDate}</span>
                          <span className="ps-1 pe-1">～</span>
                          <span>{period.endDate}</span>
                        </p>
                      </td>
                      <td className="text-center" style={{lineHeight: "0.5rem", width: "8rem"}}>
                        <p className="text-nowrap">{period.grantRuleAddDays}</p>
                      </td>
                      <td className="text-center" style={{lineHeight: "0.5rem", width: "6rem"}}>
                        <span className="badge text-bg-primary" hidden={!(period.isGranted && period.isValid)}>有効</span>
                        <span className="badge text-bg-secondary" hidden={!(period.isGranted && !period.isValid)}>無効</span>
                        <span className="badge text-bg-warning" hidden={!!period.isGranted}>未設定</span>
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>
        </div>
        <div className="custom-modal-footer">
          <button className="btn btn-secondary col-auto col-md-5" onClick={() => callback(false)}>{confirmModalConst.button.close}</button>
          <button className='btn btn-primary col-auto col-md-5 ms-3' onClick={onUpdateGrantDays} disabled={!grantPeriods?.filter(period => !period.isGranted).length}>{confirmModalConst.button.update}</button>
        </div>
      </div>
    </div>
  )
};
