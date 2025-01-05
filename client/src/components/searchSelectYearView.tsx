"use client"

import React, { useEffect, useState } from 'react'

import { searchSelectConst } from '@/consts/searchSelectConst';

type Props = {
  callback: (value: string) => void,
  currentValue: string,
  label?: string,
}

export default function SearchSelectYearView({ callback, currentValue, label }: Props) {
  const [searchYearList, setSearchYearList] = useState<string[]>([]);

  useEffect(() =>{
    let yearList = [];
    const currentYear: number = new Date().getFullYear();
    for (let index: number = 0; index < 20; index++) {
      const val = (currentYear + 1) - index
      yearList.push(val.toString());
    }
    setSearchYearList(yearList);
  },[])

  return (
    <>
      <div className="row align-items-center">
        <div className="col-auto text-end search_select_label_width">
          <label className="control-label ms-2 me-2" htmlFor="searchYear">{label ? label : searchSelectConst.label.year}</label>
        </div>
        <div className="col">
          <select className="form-select" id="searchYear" value={currentValue} onChange={(e) => callback(e.target.value)}>
            {
              searchYearList.map((year: string, index: number) => (
                <option value={year.toString()} key={index}>{year}年</option>
              ))
            }
          </select>
        </div>
      </div>
    </>
  )
};
