"use client"

import React from 'react'

import { commonConst } from '@/consts/commonConst';
import { Approval } from '@/api/getApprovalTaskList';

type Props = {
  approvalList: Approval[] | undefined,
  rowBtnHandler: (taskId: string, applicationId: string) => void
}

export default function ApprovalListView({ approvalList, rowBtnHandler }: Props) {
  const TABLE_HEADER = [
    { label: '種類', key: 'type_str', width: '130px' },
    { label: '取得日時', key: 'start_end_date', width: '150px' },
    { label: '申請者', key: 'application_user_name', width: '200px' },
    { label: '承認者コメント', key: 'comment', width: 'auto' },
    { label: 'アクション', key: 'step_str', width: '100px' },
    { label: '', key: 'action', width: '65px' },
  ];

  const createApprovalTableList = () => {
    return (
      <table className="table" hidden={!approvalList?.length}>
        <thead className="table-light">
          <tr className="text-center">
            {
              TABLE_HEADER.map((header) => (
                <th scope="col" key={header.key} style={{width: header.width}}>{header.label}</th>
              ))
            }
          </tr>
        </thead>
        <tbody>
          {
            approvalList?.map((item, index) => (
              <tr key={index + 1}>
                <td className="text-center">
                  <p className="text-nowrap">{item.sType}</p>
                </td>
                <td className="text-center">
                  <p className="text-nowrap">{item.sStartDate}</p>
                  <p className="text-nowrap">{item.sStartEndTime}</p>
                </td>
                <td>
                  <p className="text-start text-wrap">{item.applicationUserName}</p>
                </td>
                <td>
                  <p className="comment_col comment">{item.comment}</p>
                </td>
                <td className="text-center">
                  <p className="text-nowrap">{item.sAction}</p>
                </td>
                <td className="text-center">
                  <button className="btn btn-outline-secondary btn-sm" value={item.id} onClick={() => rowBtnHandler(item.id.toString(), item.applicationId.toString())}>詳細</button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    )
  }

  const createApprovalListForSp = () => {
    return (
      approvalList?.map((item, index) => (
        <div className="list-row" key={index + 1} onClick={() =>rowBtnHandler(item.id.toString(), item.applicationId.toString())}>
          <p className="row mb-2">
            <span className={`col-3 col-md-2 align-self-center badge status-color ${getActionColrClassName(item)}`}>{item.sAction}</span>
            <span className="col-auto ms-1 me-auto fw-bold">{item.sType}</span>
          </p>
          <p className="row mb-1">
            <span className="col-3">申請者</span>
            <span className="col text-end">{item.applicationUserName}</span>
          </p>
          <p className="row mb-1">
            <span className="col-3">申請日</span>
            <span className="col text-end">{item.sApplicationDate}</span>
          </p>
          <p className="row mb-1">
            <span className="col-3">取得日</span>
            <span className="col text-end">{item.sStartDate}</span>
          </p>
          <p className="row">
            <span className="col-3">取得時間</span>
            <span className="col text-end">{item.sStartTime}～{item.sEndTime}</span>
          </p>
        </div>
      ))
    )
  }

  const getActionColrClassName = (item: Approval) => {
    if(item.action === commonConst.actionValue.panding) {
      // 承認待ち
      return 'pending';
    } else if(item.action === commonConst.actionValue.approval) {
      // 承認
      return 'approval';
    } else if(item.action === commonConst.actionValue.reject) {
      // 差戻
      return 'reject';
    } else {
      return 'none';
    }
  }

  if(approvalList) {
    return (
      <>
        <div className="pc-only">
          <p className="text-center" hidden={!!approvalList.length}>取得結果 0件</p>
          {createApprovalTableList()}
        </div>
        <div className="sp-only mt-4 mb-4">
          <p className="text-center" hidden={!!approvalList.length}>取得結果 0件</p>
          {createApprovalListForSp()}
        </div>
      </>
    )
  } {
    return(
      <></>
    );
  }
};
