"use client"

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Application } from '@/api/getApplicationList';
import { UserNameObject } from '@/api/getUserNameList';

type Props = {
  applicationList: Application[] | undefined,
  userNameList: UserNameObject[],
}

export default function ApplicationListView({ applicationList, userNameList }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const isApplicationList = pathname === '/application/list';
  const TABLE_HEADER = [
    { label: '申請日', key: 'application_date', width: '110px' },
    { label: '種類', key: 's_type', width: '130px' },
    { label: '取得日時', key: 'start_end_date', width: '150px' },
    { label: '申請コメント', key: 'comment', width: 'auto' },
    { label: 'ステータス', key: 's_action', width: '100px' },
    { label: '', key: 'action', width: '65px' },
  ];

  const ADMIN_TABLE_HEADER = [
    { label: '申請日', key: 'application_date', width: '110px' },
    { label: '申請者', key: 'application_user', width: 'auto' },
    { label: '種類', key: 's_type', width: '130px' },
    { label: '区分', key: 's_classification', width: '100px' },
    { label: '取得日時', key: 'start_end_date', width: '130px' },
    { label: 'ステータス', key: 's_action', width: '110px' },
    { label: '', key: 'action', width: '65px' },
  ];

  /**
   * 申請者名取得
   * @param id 
   * @returns 
   */
  const getUserName = (id: number) => {
    const user = userNameList.find(user => user.id === id);
    return user ? user.fullName : '';
  }

  /**
   * 編集ボタン押下
   * @param id 
   */
  const onEdit = (id: number) => {
    const nextPath = isApplicationList ? `/application/edit/${id}` : `/admin/application/edit/${id}`
    router.push(nextPath, {scroll: true});
  };

  /**
   * テーブルヘッダー生成
   * @returns 
   */
  const createTableHeader = () => {
    const tableHeader = isApplicationList ? TABLE_HEADER : ADMIN_TABLE_HEADER;
    return (
      <>
        {
          tableHeader.map((header) => (
            <th scope="col" key={header.key} style={{width: header.width}}>{header.label}</th>
          ))
        }
      </>
    )
  }

  const createApplicationTableList = (applicationList: Application[]) => {
    return (
      applicationList?.map((item, index) => (
        <tr key={index + 1}>
          <td className="text-center">
            <p className="text-nowrap">{item.sApplicationDate}</p>
          </td>
          <td className="text-center">
            <p className="text-nowrap">{item.sType}</p>
          </td>
          <td className="text-center">
            <p className="text-nowrap">{item.sStartDate}</p>
            <p className="text-nowrap">{item.startEndTime}</p>
          </td>
          <td>
            <p className="comment_col comment">{item.comment}</p>
          </td>
          <td className="text-center">
            <p className="text-nowrap">{item.sAction}</p>
          </td>
          <td className="text-center">
            {editBtn(item)}
          </td>
        </tr>
      ))
    )
  }

  const createApplicationListForSp = (applicationList: Application[]) => {
    return (
      applicationList?.map((item, index) => (
        <div className="list-row" key={index + 1} onClick={() => router.push(`/application/edit/${item.id}`, {scroll: true})}>
          <p className="row mb-2">
            <span className="col-auto fw-bold">{item.sType}</span>
            <span className="col-auto ms-2 classification-label me-auto">{item.sClassification}</span>
            <span className={`col-3 col-md-2 align-self-end badge status-color ${getStatusColrClassName(item)}`}>{item.sAction}</span>
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

  const createAdminApplicationTableList = (applicationList: Application[]) => {
    return (
      applicationList?.map((item, index) => (
        <tr key={index + 1}>
          <td className="text-center">
            <p className="text-nowrap">{item.sApplicationDate}</p>
          </td>
          <td className="text-start">
            <p className="text-wrap">{getUserName(item['applicationUserId'])}</p>
          </td>
          <td className="text-center">
            <p className="text-nowrap">{item.sType}</p>
          </td>
          <td className="text-center">
            <p className="text-nowrap">{item.sClassification}</p>
          </td>
          <td className="text-center">
            <p className="text-nowrap">{item.sStartDate}</p>
            <p className="text-nowrap">{item.startEndTime}</p>
          </td>
          <td className="text-center">
            <p className="text-nowrap">{item.sAction}</p>
          </td>
          <td className="text-center">
            <button className="btn btn-outline-primary btn-sm" onClick={() => onEdit(item.id)}>確認</button>
          </td>
        </tr>
      ))
    )
  }

  const createAdmnApplicationListForSp = (applicationList: Application[]) => {
    return (
      applicationList?.map((item, index) => (
        <div className="list-row" key={index + 1} onClick={() => router.push(`/admin/application/edit/${item.id}`, {scroll: true})}>
          <p className="row mb-2">
            <span className="col-auto fw-bold">{item.sType}</span>
            <span className="col-auto ms-2 classification-label me-auto">{item.sClassification}</span>
            <span className={`col-3 col-md-2 align-self-end badge status-color ${getStatusColrClassName(item)}`}>{item.sAction}</span>
          </p>
          <p className="row mb-1">
            <span className="col-3">申請者</span>
            <span className="col text-end">{getUserName(item['applicationUserId'])}</span>
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

  const getStatusColrClassName = (item: Application) => {
    if(item.action === 0) {
      // 下書き
      return 'draft';
    } else if(item.action === 1) {
      // 承認待ち
      return 'pending';
    } else if(item.action === 3) {
      // 完了
      return 'complete';
    } else if(item.action === 4) {
      // 差戻
      return 'reject';
    } else if(item.action === 5) {
      // 取消
      return 'cancel';
    }

    return 'none';
  }

  /**
   * 編集ボタン要素取得
   * @param item 
   * @returns 
   */
  const editBtn = (item: any) => {
    if(isApplicationList && (item.action === 0 || item.action ===4)) {
      return (
        <button className="btn btn-outline-warning btn-sm" value={item.id} onClick={() => onEdit(item.id)}>編集</button>
      )
    }

    return (
      <button className="btn btn-outline-primary btn-sm" value={item.id} onClick={() => onEdit(item.id)}>確認</button>
    )
  }

  if(applicationList) {
    return (
      <>
        <div className="pc-only">
          <p className="text-center" hidden={!!applicationList.length}>取得結果 0件</p>
          <table className="table" hidden={!applicationList.length}>
            <thead className="table-light">
              <tr className="text-center">
                {
                  createTableHeader()
                }
              </tr>
            </thead>
            <tbody hidden={!isApplicationList}>
              {createApplicationTableList(applicationList)}
            </tbody>
            <tbody hidden={isApplicationList}>
              {createAdminApplicationTableList(applicationList)}
            </tbody>
          </table>
        </div>
        <div className="sp-only mt-4 mb-4">
          <p className="text-center" hidden={!!applicationList.length}>取得結果 0件</p>
          <div className="" hidden={!isApplicationList}>
            {createApplicationListForSp(applicationList)}
          </div>
          <div className="" hidden={isApplicationList}>
            {createAdmnApplicationListForSp(applicationList)}
          </div>
        </div>
      </>
    )
  } {
    return(
      <></>
    );
  }
};
