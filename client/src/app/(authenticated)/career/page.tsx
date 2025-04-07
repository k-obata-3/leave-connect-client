"use client"

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import '@/assets/styles/career.css';
import { useUserInfoStore } from '@/store/userInfoStore';
import usePageBack from '@/hooks/usePageBack';
import useSetPageTitle from '@/hooks/useSetPageTitle';
import { pageCommonConst } from '@/consts/pageCommonConst';
import { CareerDictionary, CareerItemMap, getAggregateCareerResults, GetAggregateCareerResultsRequest, GetAggregateCareerResultsResponse } from '@/api/getAggregateCareerResults';

export default function CareerPage() {
  const pathname = usePathname();
  const router = useRouter();

  // 共通ストア
  const { isAdmin } = useUserInfoStore();

  // カスタムフック
  const pageBack = usePageBack();
  const pageTitle = useSetPageTitle();

  const [careerDictionary, setCareerDictionary] = useState<CareerDictionary>();
  const [loadCompleted, setLoadCompleted] = useState(false);

  useEffect(() =>{
    pageTitle(pageCommonConst.pageName.career);
    pageBack(false);
  },[])

  useEffect(() =>{
    (async() => {

      // setApiErrors([]);
      // setGrantPeriods([])

      const request: GetAggregateCareerResultsRequest = {
        // userId: userDetails.id.toString(),
      }

      await getAggregateCareerResults(request).then((res: GetAggregateCareerResultsResponse) => {
        if(res.responseResult) {
          console.log(res.careerDictionary);
          setCareerDictionary(res.careerDictionary);
          // setGrantPeriods(res.grantPeriods);
          setLoadCompleted(true);
        } else {
          // setApiErrors(res.message ? [res.message] : [])
        }
      });
    })()
  },[])

  const drawDonutGraph = (score: number) => {
    const strokeWidth = 3;
    const r = 100 / (2 * Math.PI);
    const textPointX = score < 10 ? "15" : "13"
    return (
      <svg width="100%" height="100%" viewBox="0 0 40 40" style={{marginTop: "-0.5rem"}}>
        <defs>
          <linearGradient id="circle-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="30%" stopColor="#2fb6f0" />
            <stop offset="60%" stopColor="#396de7" />
            <stop offset="100%" stopColor="#3a39e7" />
          </linearGradient>
        </defs>
        <path
          d={`M20 ${(40 - (r + r)) / 2}
          a ${r} ${r} 0 0 1 0 ${r + r}
          a ${r} ${r} 0 0 1 0 -${r + r}`}
          fill="none"
          stroke="#E5E5E5"
          strokeWidth={strokeWidth}
          strokeDasharray="100"
          className="circle"
        />
        <path
          d={`M20 ${(40 - (r + r)) / 2}
          a ${r} ${r} 0 0 1 0 ${r + r}
          a ${r} ${r} 0 0 1 0 -${r + r}`}
          fill="none"
          stroke="url('#circle-gradient')"
          // stroke="#2fb6f0"
          strokeWidth={strokeWidth}
          strokeDasharray={`${score} 100`}
          className="circle"
        />
        <text x={textPointX} y="23" fontSize="0.5em" lengthAdjust="spacing" textAnchor="center">
          {score}%
        </text>
      </svg>
    )
  }

  const createGraphView = (careerItemMap: CareerItemMap[] | undefined) => {
    if(!careerItemMap) {
      return(
        <></>
      )
    }

    const el: JSX.Element[] = [];
    let sum = 0;
    let sumOther = 0;
    let values: any[] = [];
    Object.entries(careerItemMap).forEach(([key, value], index) => {
      sum += Number(value);
      if(index < 5) {
        values.push({
          name: key,
          val: Number(value),
          index: index,
        })
      } else {
        sumOther += Number(value);
      }

      if(index == 5) {
        values.push({
          name: "その他",
          val: 0,
          index: index,
        })
      }
    })

    if(sum == 0) {
      return(
        <p className="text-center m-0">未登録</p>
      )
    }

    values.forEach((item) => {
      const val = item.val > 0 ? item.val : sumOther;
      el.push(
        <div className="col-4 col-md-2" key={item.index}>
          <h6 className="text-center m-0 text-truncate pt-1">{item.name}</h6>
          {drawDonutGraph(Math.round((val / sum) * 100))}
        </div>
      )
    })

    return el;
  }


  return (
    <div className="career-page">
      <div className="custom-card mb-2">
        <div className="custom-card-header">
          <h6 className="ps-2">言語</h6>
        </div>
        <div className="custom-card-body">
          <div className="row pb-4">
            {createGraphView(careerDictionary?.language)}
          </div>
        </div>
      </div>
      <div className="custom-card mb-2">
        <div className="custom-card-header">
          <h6 className="ps-2">データベース</h6>
        </div>
        <div className="custom-card-body">
          <div className="row pb-4">
            {createGraphView(careerDictionary?.database)}
          </div>
        </div>
      </div>
      <div className="custom-card">
        <div className="custom-card-header">
          <h6 className="ps-2">フレームワーク</h6>
        </div>
        <div className="custom-card-body">
          <div className="row pb-4">
            {createGraphView(careerDictionary?.framework)}
          </div>
        </div>
      </div>
    </div>
  );
};
