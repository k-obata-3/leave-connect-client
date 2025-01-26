"use client"

import React, { useEffect } from 'react';

import { useUserInfoStore } from '@/store/userInfoStore';
import usePageBack from '@/hooks/usePageBack';
import useSetPageTitle from '@/hooks/useSetPageTitle';
import { pageCommonConst } from '@/consts/pageCommonConst';
import { useRouter } from 'next/navigation';

export default function Career() {
  const router = useRouter();

  // 共通ストア
  const { isAdmin } = useUserInfoStore();

  // カスタムフック
  const pageBack = usePageBack();
  const pageTitle = useSetPageTitle();

  useEffect(() =>{
    pageTitle(pageCommonConst.pageName.career);
    pageBack(false);
  },[])

  return (
    <div className="career">
      <div className="row mb-2">
        <button className="btn btn-primary" onClick={() => router.push(pageCommonConst.path.careerList)}>{pageCommonConst.pageName.careerList}</button>
      </div>
      <div className="row mb-2">
        <button className="btn btn-primary" onClick={() => router.push(pageCommonConst.path.careerMemberList)}>{pageCommonConst.pageName.careerMemberList}</button>
      </div>
    </div>
  );
};
