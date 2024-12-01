"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@/api/getUserList';

type Props = {
  userList: User[] | undefined,
}

export default function UserListView({ userList }: Props) {
  const router = useRouter();

  const TABLE_HEADER = [
    { label: 'ユーザ名', key: 'name', width: 'auto' },
    { label: '基準日', key: 'referenceDate', width: '110px' },
    { label: '付与日数', key: 'totalAddDays', width: '100px' },
    { label: '有給取得日数', key: 'currentDays', width: '130px' },
    { label: '有給残日数', key: 'remainingDays', width: '130px' },
    { label: '有給残日数（自動計算）', key: 'autoCalc', width: '120px' },
    { label: '', key: 'action', width: '110px' },
  ];

  /**
   * 編集ボタン押下
   * @param id 
   */
  const onEdit = (id: any) => {
    router.push(`/user/edit/${id}`, {scroll: true});
  };

  if(userList?.length) {
    return (
      <table className="table">
        <thead className="table-light">
          <tr className="text-center align-middle">
            {
              TABLE_HEADER.map((header) => (
                <th scope="col" key={header.key} style={{width: header.width}}>{header.label}</th>
              ))
            }
          </tr>
        </thead>
        <tbody>
          {
            userList?.map((user, index) => (
              <tr key={index + 1}>
                <td className="align-middle">
                  <p className="text-wrap">
                    <span className="me-2">{user.lastName}</span>
                    <span>{user.firstName}</span>
                  </p>
                </td>
                <td className="text-center">
                  <p className="text-nowrap">{user.referenceDate}</p>
                </td>
                <td className="text-center">
                  <p className="text-nowrap">{user.totalAddDays}</p>
                </td>
                <td className="text-center">
                  <p className="text-nowrap">{user.totalDeleteDays}</p>
                </td>
                <td className="text-center">
                  <p className="text-nowrap">{user.totalRemainingDays}</p>
                </td>
                <td className="text-center">
                  <p className="text-nowrap">{user.autoCalcRemainingDays}</p>
                </td>
                <td className="text-center">
                  <button className="btn btn-outline-warning btn-sm" onClick={() => onEdit(user.id)}>編集</button>
                </td>
              </tr>
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
