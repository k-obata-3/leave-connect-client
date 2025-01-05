"use client"

import React from 'react'

import { useUserNameListStore } from '@/store/userNameListStore';
import { UserNameObject } from '@/api/getUserNameList';
import { searchSelectConst } from '@/consts/searchSelectConst';

type Props = {
  callback: (value: string) => void,
  currentValue: string,
  label?: string,
}

export default function SearchSelectUserView({ callback, currentValue, label }: Props) {
  const { getUserNameList } = useUserNameListStore();

  return (
    <>
      <div className="row align-items-center">
        <div className="col-auto text-end search_select_label_width">
          <label className="col-form-label ms-2 me-2" htmlFor="searchUser">{label ? label : searchSelectConst.label.user}</label>
        </div>
        <div className="col">
          <select className="form-select" id="searchUser" value={currentValue} onChange={(e) => callback(e.target.value)}>
            <option value=''>{searchSelectConst.label.all}</option>
            {
              getUserNameList()?.map((user: UserNameObject, index: number) => (
                <option value={user.id} key={index}>{user.fullName}</option>
              ))
            }
          </select>
        </div>
      </div>
    </>
  )
};
