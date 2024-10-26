"use client"

import React, { useState, useEffect } from 'react';
import { GetSystemConfigsResponse } from '@/api/getSystemConfigs';

type Props = {
  systemConfig: GetSystemConfigsResponse | undefined,
}

export default function GrantRule({ systemConfig }: Props) {
  const [grantRule, setGrantRule] = useState("");
  const [yearsOfService, setYearsOfService] = useState([]);
  const [workingDays, setWorkingDays] = useState([]);

  useEffect(() =>{
    if(!systemConfig || !systemConfig.value || systemConfig.key !== "grantRule") { 
      return;
    }

    const value = JSON.parse(systemConfig.value);
    // console.log(value)
    // setGrantRule(JSON.stringify(value));
    setYearsOfService(value['sectionMonth']);
    setWorkingDays(value['workingDays'])
    // console.log(value['sectionMonth'])
    // console.log(value['workingDays'])
  },[systemConfig])

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
  );
};
