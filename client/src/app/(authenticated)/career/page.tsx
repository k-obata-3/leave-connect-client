"use client"

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useUserInfoStore } from '@/store/userInfoStore';
import usePageBack from '@/hooks/usePageBack';
import useSetPageTitle from '@/hooks/useSetPageTitle';
import { pageCommonConst } from '@/consts/pageCommonConst';

export default function CareerPage() {
  const pathname = usePathname();
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
    <div className="career-page">

    </div>
  );
};
