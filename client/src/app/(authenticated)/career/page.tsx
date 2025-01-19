"use client"

import React, { useEffect } from 'react';

import usePageBack from '@/hooks/usePageBack';
import { pageCommonConst } from '@/consts/pageCommonConst';
import { useRouter } from 'next/navigation';

export default function Career() {
  const router = useRouter();
  // 戻るボタン カスタムフック
  const pageBack = usePageBack();

  useEffect(() =>{
    pageBack(false);
  },[])

  return (
    <div className="career">
      <div className="page-title pc-only">
        <h3>{pageCommonConst.pageName.career}</h3>
      </div>
      <div className="row mb-2">
        <button className="btn btn-primary" onClick={() => router.push(pageCommonConst.path.careerList)}>{pageCommonConst.pageName.careerList}</button>
      </div>
      <div className="row mb-2">
        <button className="btn btn-primary" onClick={() => router.push(pageCommonConst.path.careerSetting)}>{pageCommonConst.pageName.careerSetting}</button>
      </div>
    </div>
  );
};
