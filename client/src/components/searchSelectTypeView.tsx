"use client"

import React from 'react'
import { usePathname } from 'next/navigation';

import { ApplicationTypeObject, useApplicationSettingStore } from '@/store/applicationSettingStore';
import { pageCommonConst } from '@/consts/pageCommonConst';
import { searchSelectConst } from '@/consts/searchSelectConst';

type Props = {
  callback: (value: string) => void,
  currentValue: string,
  label?: string,
}

export default function SearchSelectTypeView({ callback, currentValue, label }: Props) {
  const pathname = usePathname();
  // 共通Store
  const { getApplicationTypeObject } = useApplicationSettingStore();

  return (
    <>
      <div className="row align-items-center">
        <div className="col-auto text-end search_select_label_width">
          <label className="control-label ms-2 me-2" htmlFor="searchType">{label ? label : searchSelectConst.label.type}</label>
        </div>
        <div className="col">
          <select className="form-select" id="searchType" value={currentValue} onChange={(e) => callback(e.target.value)}>
            <>
            {
              pathname === pageCommonConst.path.application ? '' : (<option value=''>{searchSelectConst.label.all}</option>)
            }
            </>
            {
              getApplicationTypeObject()?.map((item: ApplicationTypeObject, index: number) => {
                return <option value={item.value} key={index}>{item.name}</option>
              })
            }
          </select>
        </div>
      </div>
    </>
  )
};
