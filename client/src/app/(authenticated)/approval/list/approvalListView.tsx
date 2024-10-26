"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { Approval } from '@/api/getApprovalTaskList';

type Props = {
  approvalList: Approval[] | undefined,
}

export default function ApprovalListView({ approvalList }: Props) {
  const router = useRouter();
  const TABLE_HEADER = [
    { label: '種類', key: 'type_str', width: '130px' },
    { label: '取得日時', key: 'start_end_date', width: '150px' },
    { label: '申請者', key: 'application_user_name', width: '200px' },
    { label: '承認者コメント', key: 'comment', width: 'auto' },
    { label: '承認状況', key: 'step_str', width: '100px' },
    { label: '', key: 'action', width: '65px' },
  ];

  if(approvalList) {
    return (
      <table className="table">
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
            approvalList.map((item, index) => (
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
                  <button className="btn btn-outline-warning btn-sm" value={item.id} onClick={() => router.push(`/approval/edit/${item.id}?applicationId=${item.applicationId}`, {scroll: true})}>詳細</button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    )
  } {
    return(
      <></>
    );
  }
};
