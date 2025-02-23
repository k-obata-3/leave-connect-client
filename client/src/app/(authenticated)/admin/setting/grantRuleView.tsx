"use client"

import React, { useState, useEffect } from 'react';

import { useNotificationMessageStore } from '@/store/notificationMessageStore';
import { pageCommonConst } from '@/consts/pageCommonConst';
import { getSystemSettings, GetSystemSettingRequest, GetSystemSettingResponse } from '@/api/getSystemSettings';

type Props = {
  isShow: boolean,
}

export default function GrantRuleView({ isShow }: Props) {
  // 共通Store
  const { setNotificationMessageObject } = useNotificationMessageStore();

  const [yearsOfService, setYearsOfService] = useState([]);
  const [workingDays, setWorkingDays] = useState([]);

  useEffect(() =>{
    (async() => {
      if(!isShow) {
        return;
      }

      await getGrantRule();
    })()
  },[isShow])

    const getGrantRule = async() => {
      const req: GetSystemSettingRequest = {
        key: pageCommonConst.tabName.grantRule,
      }
  
      const res: GetSystemSettingResponse = await getSystemSettings(req);
      if(res.responseResult) {
        if(res.SystemSettings.length) {
          const grantRule = JSON.parse(res.SystemSettings[0].value);
          setYearsOfService(grantRule['sectionMonth']);
          setWorkingDays(grantRule['workingDays'])
        }
      } else {
        setNotificationMessageObject({
          errorMessageList: res.message ? [res.message] : [],
          inputErrorMessageList: [],
        })
      }
    }

  if(yearsOfService.length) {
    return (
      <>
        <table className="table">
          <thead className="table-light">
            <tr className="text-center align-middle">
              <th scope="row" rowSpan={2}>所定労働日数</th>
              <th scope="col" colSpan={7}>継続勤務期間</th>
            </tr>
            <tr className="text-center align-middle">
              {
                yearsOfService?.map((sectionMonth: any, index: number) => (
                  <th scope="col" key={sectionMonth}>
                    <span hidden={Math.floor(sectionMonth / 12) === 0}>{Math.floor(sectionMonth / 12)}年</span>
                    <span>{sectionMonth % 12}ヶ月</span>
                    <span hidden={index !== yearsOfService.length - 1}>以上</span>
                    <span hidden={Math.floor(sectionMonth / 12) === 0}>（{sectionMonth}）</span>
                  </th>
                ))
              }
            </tr>
          </thead>
          <tbody>
            {
              workingDays?.map((workingDay: any, index: number) => (
                <tr key={index}>
                  <td className="text-center">
                    <p className="text-wrap">週{workingDay.day}日</p>
                  </td>
                  <td className="text-center">
                    <p className="text-nowrap">{workingDay.grantDays[0]}</p>
                  </td>
                  <td className="text-center">
                    <p className="text-nowrap">{workingDay.grantDays[1]}</p>
                  </td>
                  <td className="text-center">
                    <p className="text-nowrap">{workingDay.grantDays[2]}</p>
                  </td>
                  <td className="text-center">
                    <p className="text-nowrap">{workingDay.grantDays[3]}</p>
                  </td>
                  <td className="text-center">
                    <p className="text-nowrap">{workingDay.grantDays[4]}</p>
                  </td>
                  <td className="text-center">
                    <p className="text-nowrap">{workingDay.grantDays[5]}</p>
                  </td>
                  <td className="text-center">
                    <p className="text-nowrap">{workingDay.grantDays[6]}</p>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </>
    )
  } {
    return (
      <>
        <p className="text-center">付与日数設定なし</p>
      </>
    )
  }
};
