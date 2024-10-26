"use client"

import React, { useEffect, useState } from 'react'
import { ApprovalTtasks } from '@/api/getApplication';

type Props = {
  tasks: ApprovalTtasks[] | undefined
}

export default function ApprovalListView({ tasks }: Props) {
  const TABLE_HEADER = [
    { label: '', key: 'progress' },
    { label: '操作', key: 'action' },
    { label: '操作者', key: 'operationUserName' },
    { label: 'コメント', key: 'comment' },
    { label: '更新日時', key: 'operationDate' },
  ];
  const [approvalTasks, setApprovalTasks] = useState<ApprovalTtasks[]>([]);

  useEffect(() =>{
    if(tasks) {
      setApprovalTasks(tasks);
    }
  }, [tasks])

  return (
    <>
      <div className="" id="modal-approval-list">
        <div className="">
          <div className="">
            <h5>承認状況</h5>
          </div>
          <div>
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
                  approvalTasks.map((item: any, index: number) => (
                    <tr key={index + 1}>
                      <td className="col-2 text-center">
                        <p className="text-nowrap">{item['sStatus']}</p>
                      </td>
                      <td className="col-2 text-center">
                        <p className="text-nowrap">{item['sAction']}</p>
                      </td>
                      <td className="col-3 text-start">
                        <p className="text-wrap">{item['userName']}</p>
                      </td>
                      <td className="col text-start">
                        <p className="comment_col comment">{item['comment']}</p>
                      </td>
                      <td className="col-2 text-center">
                        <p className="text-nowrap">{item['operationDate']}</p>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
        <div className="modal-footer">

        </div>
      </div>
    </>
  );
};
