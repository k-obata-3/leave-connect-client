"use client"

import React from 'react'

import { commonConst } from '@/consts/commonConst';
import { User } from '@/api/getUserList';

type Props = {
  userList: User[] | undefined,
  rowBtnHandler: (userId: string) => void,
}

export default function UserListView({ userList, rowBtnHandler }: Props) {
  const TABLE_HEADER_FIRST_ROW = [
    { label: 'ユーザ名', key: 'name', width: 'auto' },
    { label: '基準日', key: 'referenceDate', width: '130px' },
    { label: '付与日数', key: 'totalAddDays', width: '80px' },
    { label: '残日数', key: 'totalRemainingDays', width: '80px' },
    { label: '対象期間', key: 'period', width: '260px' },
    { label: '', key: 'action', width: '80px' },
  ];

  const TABLE_HEADER_SECOND_ROW = [
    { label: '取得日数', key: 'totalDeleteDays', width: '80px' },
    { label: '時間取得', key: 'totalDeleteTimes', width: '80px' },
  ];

  if(userList?.length) {
    return (
      <>
        <div className="user-list-legend">
          <p>
            <i className="bi bi-exclamation-circle-fill text-warning pe-1"></i><span>今年度の付与日数が未設定</span>
            <i className="bi bi-ban-fill text-danger ps-4 pe-1"></i><span>無効なユーザ</span>
          </p>
        </div>
        <table className="table table-sm">
          <thead className="table-light">
            <tr className="text-center align-middle">
              <th scope="row" rowSpan={2} key={TABLE_HEADER_FIRST_ROW[0].key} style={{width: TABLE_HEADER_FIRST_ROW[0].width}}>{TABLE_HEADER_FIRST_ROW[0].label}</th>
              <th scope="row" rowSpan={2} key={TABLE_HEADER_FIRST_ROW[1].key} style={{width: TABLE_HEADER_FIRST_ROW[1].width}}>{TABLE_HEADER_FIRST_ROW[1].label}</th>
              <th scope="row" rowSpan={2} key={TABLE_HEADER_FIRST_ROW[2].key} className="text-nowrap" style={{width: TABLE_HEADER_FIRST_ROW[2].width}}>{TABLE_HEADER_FIRST_ROW[2].label}</th>
              <th scope="row" rowSpan={2} key={TABLE_HEADER_FIRST_ROW[3].key} className="text-nowrap" style={{width: TABLE_HEADER_FIRST_ROW[3].width}}>{TABLE_HEADER_FIRST_ROW[3].label}</th>
              <th scope="row" colSpan={2} key={TABLE_HEADER_FIRST_ROW[4].key} style={{width: TABLE_HEADER_FIRST_ROW[4].width}}>{TABLE_HEADER_FIRST_ROW[4].label}</th>
              <th scope="row" rowSpan={2} key={TABLE_HEADER_FIRST_ROW[5].key} style={{minWidth: TABLE_HEADER_FIRST_ROW[5].width, width: TABLE_HEADER_FIRST_ROW[5].width}}>{TABLE_HEADER_FIRST_ROW[5].label}</th>
            </tr>
            <tr className="text-center align-middle">
            <th scope="row" key={TABLE_HEADER_SECOND_ROW[0].key} className="text-nowrap" style={{width: TABLE_HEADER_SECOND_ROW[0].width}}>{TABLE_HEADER_SECOND_ROW[0].label}</th>
            <th scope="row" key={TABLE_HEADER_SECOND_ROW[1].key} className="text-nowrap" style={{width: TABLE_HEADER_SECOND_ROW[1].width}}>{TABLE_HEADER_SECOND_ROW[1].label}</th>
            </tr>
          </thead>
          <tbody>
            {
              userList?.map((user, index) => (
                <React.Fragment key={index}>
                <tr className="">
                  <td className="align-middle" rowSpan={2}>
                    <p className="text-wrap">
                      <span className={user.isUpdateGrant && user.status == commonConst.USER_EFFECTIVE_STATUS ? "opacity-0" : "opacity-100"}>
                        <i className="bi bi-exclamation-circle-fill text-warning" hidden={user.status != commonConst.USER_EFFECTIVE_STATUS}></i>
                        <i className="bi bi-ban-fill text-danger" hidden={user.status == commonConst.USER_EFFECTIVE_STATUS}></i>
                      </span>
                      <span className="ms-2 me-2">{user.lastName}</span>
                      <span>{user.firstName}</span>
                    </p>
                  </td>
                  <td className="text-center" rowSpan={2}>
                    <p className="text-nowrap">{user.referenceDate}</p>
                  </td>
                  <td className="text-center" rowSpan={2}>
                    <p className="text-nowrap">{user.totalAddDays}日</p>
                  </td>
                  <td className="text-center" rowSpan={2}>
                    <p className="text-nowrap">{user.totalRemainingDays}日</p>
                  </td>
                  <td className="text-center" colSpan={2}>
                    <p className="text-nowrap" hidden={!user.periodStart}><span>{user.periodStart}</span><span className="ms-1 me-1">～</span><span>{user.periodEnd}</span></p>
                    <p className="text-nowrap" hidden={!!user.periodStart}><span>-</span></p>
                  </td>
                  <td className="text-center" rowSpan={2}>
                    <button className="btn btn-outline-primary btn-sm" onClick={() => rowBtnHandler(user.id.toString())}>編集</button>
                  </td>
                </tr>
                <tr className="">
                  <td className="text-center">
                    <p className="text-nowrap">{user.totalDeleteDays}日</p>
                  </td>
                  <td className="text-center">
                    <p className="text-nowrap">{user.totalDeleteTimes}時間</p>
                  </td>
                </tr>
                </React.Fragment>
              ))
            }
          </tbody>
        </table>
      </>
    )
  } {
    return(
      <>
        <p className="text-center">取得結果 0件</p>
      </>
    );
  }
};
