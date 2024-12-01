"use client"

import React, { useState, useEffect } from 'react';
import { GetSystemConfigsResponse, SystemConfigObject } from '@/api/getSystemConfigs';

type Props = {
  systemConfigs: SystemConfigObject[],
}

export default function GrantRule({ systemConfigs }: Props) {
  const [grantRule, setGrantRule] = useState("");
  const [yearsOfService, setYearsOfService] = useState([]);
  const [workingDays, setWorkingDays] = useState([]);

  useEffect(() =>{
    if(systemConfigs?.length && systemConfigs[0].key === "grantRule") {
      const value = JSON.parse(systemConfigs[0].value);
      // console.log(value)
      // setGrantRule(JSON.stringify(value));
      setYearsOfService(value['sectionMonth']);
      setWorkingDays(value['workingDays'])
    }
  },[systemConfigs])

  if(systemConfigs.length) {
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
