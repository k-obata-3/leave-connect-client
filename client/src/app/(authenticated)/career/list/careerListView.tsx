"use client"

import React from 'react';
import { Career } from '@/api/getCareerList';


type Props = {
  careerList: Career[] | undefined,
  rowBtnHandler: (careerId: string) => void
}

export default function CareerListView({ careerList, rowBtnHandler }: Props) {
  const TABLE_HEADER = [
    { label: '案件名', key: 'project_name', width: '300px' },
    { label: '概要', key: 'overview', width: 'auto' },
    { label: '開始日', key: 'start_end_date', width: '110px' },
    { label: '終了日', key: 'comment', width: '110px' },
    { label: '', key: 'action', width: '65px' },
  ];

  /**
   * テーブルヘッダー生成
   * @returns 
   */
  const createTableHeader = () => {
    return (
      <>
        {
          TABLE_HEADER.map((header) => (
            <th scope="col" key={header.key} style={{width: header.width}}>{header.label}</th>
          ))
        }
      </>
    )
  }

  const createCareerTableList = (careerList: Career[]) => {
    return (
      careerList?.map((item, index) => (
        <tr key={index + 1}>
          <td className="">
            <p className="text-nowrap">{item.projectName}</p>
          </td>
          <td className="">
            <p className="text-nowrap">{item.overview}</p>
          </td>
          <td className="text-center">
            <p className="text-nowrap">{item.startDate}</p>
          </td>
          <td className="text-center">
            <p className="text-nowrap">{item.endDate}</p>
          </td>
          <td className="text-center">
            <button className="btn btn-outline-primary btn-sm" value={item.id} onClick={() => rowBtnHandler(item.id.toString())}>編集</button>
          </td>
        </tr>
      ))
    )
  }

  const createCareerTableListForSp = (careerList: Career[]) => {
    return (
      careerList?.map((item, index) => (
        <div className="list-row" key={index + 1} onClick={() => rowBtnHandler(item.id.toString())}>
          <p className="row mb-2">
            <span className="col-auto ms-1 me-auto fw-bold text-truncate">{item.projectName}</span>
          </p>
          <p className="row mb-1">
            <span className="col ms-3 me-3 text-truncate">{item.overview}</span>
          </p>
          <p className="row mb-1 justify-content-end text-center" hidden={!(item.startDate || item.endDate)}>
            <span className="" style={{width: '100px'}}>{item.startDate}</span>
            <span className="col-auto">～</span>
            <span className="" style={{width: '100px'}}>{item.endDate}</span>
          </p>
        </div>
      ))
    )
  }

  if(careerList) {
    return (
      <>
        <div className="pc-only">
          <p className="text-center" hidden={!!careerList.length}>取得結果 0件</p>
          <table className="table" hidden={!careerList.length}>
            <thead className="table-light">
              <tr className="text-center">
                {createTableHeader()}
              </tr>
            </thead>
            <tbody>
              {createCareerTableList(careerList)}
            </tbody>
          </table>
        </div>
        <div className="sp-only mt-4 mb-4">
          <p className="text-center" hidden={!!careerList.length}>取得結果 0件</p>
          <div className="">
            {createCareerTableListForSp(careerList)}
          </div>
        </div>
      </>
    );
  } else {
    return(
      <></>
    );
  }
}