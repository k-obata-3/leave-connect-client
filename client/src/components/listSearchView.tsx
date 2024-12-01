"use client"

import React, { useEffect, useState } from 'react'
import { GetUserNameListResponse, UserNameObject } from '@/api/getUserNameList';

type Props = {
  searchActions:{}[]
  userNameList: UserNameObject[],
  currentSearchParams: CurrentSearchParams,
  searchHandler: SearchHandler,
}

interface CurrentSearchParams {
  currentSearchYear: string,
  currentSearchUser: string,
  currentSearchAction: string,
}

interface SearchHandler {
  changeSearchYear(value: string): void | null;
  changeSearchUser(value: string): void | null;
  changeSearchAction(value: string): void | null;
}

interface Year {
  [year: string]: number
}

export default function ListSearchView({ searchActions, userNameList, currentSearchParams, searchHandler }: Props) {
  let currentYear: number = new Date().getFullYear();
  const [searchYearList, setSearchYearList] = useState<Year[]>([]);

  useEffect(() =>{
    let yearList = [];
    for (let index: number = 0; index < 20; index++) {
      const year = {
        'year': (currentYear + 1) - index
      }
      yearList.push(year);
    }
    setSearchYearList(yearList);
  },[])

  const createSearchYearSelect = () => {
    return (
      <select className="form-select inline-block" id="searchYear" value={currentSearchParams.currentSearchYear} onChange={(e) => searchHandler.changeSearchYear(e.target.value)}>
        {
          searchYearList.map((year: any, index: number) => (
            <option value={year.year.toString()} key={index}>{year.year}年</option>
          ))
        }
      </select>
    )
  }

  const createSearchUserSelect = () => {
    return (
      <select className="form-select inline-block" id="searchUser" value={currentSearchParams.currentSearchUser} onChange={(e) => searchHandler.changeSearchUser(e.target.value)}>
        <option value=''>すべて</option>
        {
          userNameList.map((user: any, index: number) => (
            <option value={user.id} key={index}>{user.fullName}</option>
          ))
        }
      </select>
    )
  }

  const createSearchTypeSelect = () => {
    return (
      <select className="form-select" id="searchType" value={currentSearchParams.currentSearchAction} onChange={(e) => searchHandler.changeSearchAction(e.target.value)}>
        {
          searchActions.map((action: any, index: number) => (
            <option value={action.value} key={index}>{action.name}</option>
          ))
        }
      </select>
    )
  }

  return (
    <>
      <div className="row d-flex flex-row justify-content-end">
        <label className="col-2 col-md-auto col-form-label ms-2" htmlFor="searchYear" hidden={!currentSearchParams.currentSearchYear}>取得年</label>
        <div className="col-9 col-md-2 ms-2" hidden={!currentSearchParams.currentSearchYear}>
          {createSearchYearSelect()}
        </div>

        <label className="col-2 col-md-auto col-form-label ms-2" htmlFor="searchUser" hidden={!userNameList.length}>申請者</label>
        <div className="col-9 col-md-4 ms-2" hidden={!userNameList.length}>
          {createSearchUserSelect()}
        </div>

        <label className="col-2 col-md-auto col-form-label ms-2" htmlFor="searchType" hidden={!searchActions.length}>状況</label>
        <div className="col-9 col-md-3 ms-2" hidden={!searchActions.length}>
          {createSearchTypeSelect()}
        </div>
      </div>
    </>
  )
};
