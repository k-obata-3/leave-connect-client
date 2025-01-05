"use client"

import React from 'react'

import { User } from '@/api/getUserList';

type Props = {
  userList: User[] | undefined,
  rowBtnHandler: (userId: string) => void,
}

export default function UserListView({ userList, rowBtnHandler }: Props) {
  const TABLE_HEADER_FIRST_ROW = [
    { label: 'ユーザ名', key: 'name', width: 'auto' },
    { label: '基準日', key: 'referenceDate', width: '130px' },
    { label: '付与日最終更新', key: 'lastGrantDate', width: '260px' },
    { label: '繰越日数', key: 'totalCarryoverDays', width: '130px' },
    { label: '付与日数', key: 'totalAddDays', width: '130px' },
    { label: '', key: 'action', width: '110px' },
  ];

  const TABLE_HEADER_SECOND_ROW = [
    { label: '対象期間', key: 'period', width: '260px' },
    { label: '取得日数', key: 'currentDays', width: '130px' },
    { label: '残日数', key: 'remainingDays', width: '130px' },
  ];

  if(userList?.length) {
    return (
      <table className="table table-sm">
        <thead className="table-light">
          <tr className="text-center align-middle">
            <th scope="row" rowSpan={2} key={TABLE_HEADER_FIRST_ROW[0].key} style={{width: TABLE_HEADER_FIRST_ROW[0].width}}>{TABLE_HEADER_FIRST_ROW[0].label}</th>
            <th scope="row" rowSpan={2} key={TABLE_HEADER_FIRST_ROW[1].key} style={{width: TABLE_HEADER_FIRST_ROW[1].width}}>{TABLE_HEADER_FIRST_ROW[1].label}</th>
            <th scope="row" className="border-bottom-0" colSpan={2} key={TABLE_HEADER_FIRST_ROW[2].key} style={{width: TABLE_HEADER_FIRST_ROW[2].width}}>{TABLE_HEADER_FIRST_ROW[2].label}</th>
            <th scope="row" key={TABLE_HEADER_FIRST_ROW[3].key} style={{width: TABLE_HEADER_FIRST_ROW[3].width}}>{TABLE_HEADER_FIRST_ROW[3].label}</th>
            <th scope="row" key={TABLE_HEADER_FIRST_ROW[4].key} style={{width: TABLE_HEADER_FIRST_ROW[4].width}}>{TABLE_HEADER_FIRST_ROW[4].label}</th>
            <th scope="row" rowSpan={2} key={TABLE_HEADER_FIRST_ROW[5].key} style={{width: TABLE_HEADER_FIRST_ROW[5].width}}>{TABLE_HEADER_FIRST_ROW[5].label}</th>
          </tr>
          <tr className="text-center align-middle">
            <th scope="row" className="border-top-0" colSpan={2} key={TABLE_HEADER_SECOND_ROW[0].key} style={{width: TABLE_HEADER_SECOND_ROW[0].width}}>{TABLE_HEADER_SECOND_ROW[0].label}</th>
            <th scope="row" key={TABLE_HEADER_SECOND_ROW[1].key} style={{width: TABLE_HEADER_SECOND_ROW[1].width}}>{TABLE_HEADER_SECOND_ROW[1].label}</th>
            <th scope="row" key={TABLE_HEADER_SECOND_ROW[2].key} style={{width: TABLE_HEADER_SECOND_ROW[2].width}}>{TABLE_HEADER_SECOND_ROW[2].label}</th>
          </tr>
        </thead>
        <tbody>
          {
            userList?.map((user, index) => (
              <React.Fragment key={index}>
              <tr className={user.status != 1 ? "opacity-50" : ""}>
                <td className="align-middle" rowSpan={2}>
                  <p className="text-wrap">
                    <span className={user.isUpdateGrant ? "opacity-0" : "opacity-100"}><i className="bi bi-exclamation-circle-fill text-danger"></i></span>
                    <span className="ms-2 me-2">{user.lastName}</span>
                    <span>{user.firstName}</span>
                  </p>
                </td>
                <td className="text-center" rowSpan={2}>
                  <p className="text-nowrap">{user.referenceDate}</p>
                </td>
                <td className="text-center border-bottom-0" colSpan={2}>
                  <p className="text-nowrap">{user.lastGrantDate ? user.lastGrantDate : '-'}</p>
                </td>
                <td className="text-center">
                  <p className="text-nowrap">{user.totalCarryoverDays}</p>
                </td>
                <td className="text-center">
                  <p className="text-nowrap">{user.totalAddDays}</p>
                </td>
                <td className="text-center" rowSpan={2}>
                  <button className="btn btn-outline-primary btn-sm" onClick={() => rowBtnHandler(user.id.toString())}>編集</button>
                </td>
              </tr>
              <tr className={user.status != 1 ? "opacity-50" : ""}>
                <td className="text-center border-top-0" colSpan={2}>
                  <p className="text-nowrap" hidden={!user.periodStart}><span>{user.periodStart}</span><span className="ms-1 me-1">～</span><span>{user.periodEnd}</span></p>
                  <p className="text-nowrap" hidden={!!user.periodStart}><span>-</span></p>
                </td>
                <td className={user.totalDeleteDays < 5 ? "text-center bg-danger bg-gradient" : "text-center"}>
                  <p className="text-nowrap">{user.totalDeleteDays}</p>
                </td>
                <td className={user.totalRemainingDays < 40 ? user.totalRemainingDays < 5 ? "text-center bg-warning bg-gradient" : "text-center" : "text-center bg-info bg-gradient"}>
                  <p className="text-nowrap">{user.totalRemainingDays}</p>
                </td>
              </tr>
              </React.Fragment>
            ))
          }
        </tbody>
      </table>
    )
  } {
    return(
      <>
        <p className="text-center">取得結果 0件</p>
      </>
    );
  }
};
