"use client"

import React, { useEffect } from 'react'

import { commonConst } from '@/consts/commonConst';
import { ApprovalTtask } from '@/api/getApplication';

type Props = {
  tasks: ApprovalTtask[],
}

export default function ApprovalStatusListView({ tasks }: Props) {
  const TABLE_HEADER = [
    { label: '', key: 'progress' },
    { label: 'アクション', key: 'action' },
    { label: '確認者', key: 'operationUserName' },
    { label: 'コメント', key: 'comment' },
    { label: '確認日時', key: 'operationDate' },
  ];

  useEffect(() =>{

  }, [])

  const createListViewForPc = () => {
    return (
      <table className="table table-responsive">
        <thead className="table-light">
          <tr className="text-center">
            {
              TABLE_HEADER.map((header) => (
                <th scope="col" key={header.key}>{header.label}</th>
              ))
            }
          </tr>
        </thead>
        <tbody>
          {
            tasks.map((item: any, index: number) => (
              <tr key={index + 1}>
                <td className="col-2 text-center">
                  <p className="text-nowrap">{item.status==2 ? '-' : item.sStatus}</p>
                </td>
                <td className="col-2 text-center">
                  <p className="text-nowrap">{item.sAction}</p>
                </td>
                <td className="col-3 text-start">
                  <p className="text-wrap">{item.userName}</p>
                </td>
                <td className="col text-start">
                  <p className="comment_col comment">{item.comment}</p>
                </td>
                <td className="col-2 text-center">
                  <p className="text-nowrap">{item.operationDate}</p>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    )
  }

  const createListViewForSp = () => {
    return (
      tasks.map((item, index) => (
        <div className={`${item.status==2 ? 'row approval-status-list-row approval-history' : 'row approval-status-list-row'}`} key={index + 1} onClick={() => {
          if(item.comment) {
            alert(item.comment)
          }
        }}>
          <div className="col-8 col-md-10 approval-status-list-col approval-status-list-name pe-2">
            <span className="text-truncate">{item.userName}</span>
          </div>
          <div className="col-4 col-md-2 align-self-end approval-status-list-col" hidden={item.action==1}>
            <p className="text-center mb-0">{`${item.operationDate ? item.operationDate?.substring(0, 10): ''}`}</p>
            <span className={`col-12 badge status-color ${getStatusColrClassName(item)}`}>{item.sAction}</span>
          </div>
          <div className="col approval-status-list-col approval-status-list-pending" hidden={item.action!=1}>
            <i className="bi bi-exclamation-triangle"></i>
          </div>
        </div>
      ))
    )
  }

  const getStatusColrClassName = (item: ApprovalTtask) => {
    if(item.action === commonConst.actionValue.panding) {
      // 承認待ち
      return 'pending';
    } else if(item.action === commonConst.actionValue.approval) {
      // 承認
      return 'approval';
    } else if(item.action === commonConst.actionValue.reject) {
      // 差戻
      return 'reject';
    } else if(item.action === commonConst.actionValue.cancel) {
      // 取消
      return 'cancel';
    } else {
      return 'none';
    }
  }

  return (
    <>
      <div className="" id="approval-status-list">
        <div className="">
          <h6>承認状況</h6>
        </div>
        <div className='pc-only'>
          {createListViewForPc()}
        </div>
        <div className='sp-only'>
          {createListViewForSp()}
        </div>
      </div>
    </>
  );
};
