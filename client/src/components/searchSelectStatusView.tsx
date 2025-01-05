"use client"

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { pageCommonConst } from '@/consts/pageCommonConst';
import { SelectList, searchSelectConst } from '@/consts/searchSelectConst';

type Props = {
  callback: (value: string) => void,
  currentValue: string,
  label?: string,
}
export default function SearchSelectStatusView({ callback, currentValue, label }: Props) {
  const pathname = usePathname();

  const [selectList, setSelectList] = useState<SelectList[]>([]);
  useEffect(() =>{
    if(pathname === pageCommonConst.path.adminApplication) {
      setSelectList(searchSelectConst.adminApplicationSelect);
    }else if(pathname === pageCommonConst.path.application) {
      setSelectList(searchSelectConst.applicationSelect);
    } else {
      setSelectList(searchSelectConst.approvalSelect);
    }
  },[pathname])

  return (
    <>
      <div className="row align-items-center">
        <div className="col-auto text-end search_select_label_width">
          <label className="col-form-label ms-2 me-2" htmlFor="searchStatus">{label ?? searchSelectConst.label.status}</label>
        </div>
        <div className="col">
          <select className="form-select" id="searchStatus" value={currentValue} onChange={(e) => callback(e.target.value)}>
            <option value=''>{searchSelectConst.label.all}</option>
            {
              selectList?.map((item: SelectList, index: number) => (
                <option value={item.value} key={index}>{item.name}</option>
              ))
            }
          </select>
        </div>
      </div>
    </>
  )
};
