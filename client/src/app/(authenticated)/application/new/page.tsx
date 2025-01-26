"use client"

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import usePageBack from '@/hooks/usePageBack';
import useSetPageTitle from '@/hooks/useSetPageTitle';
import { pageCommonConst } from '@/consts/pageCommonConst';
import ApplicationEditView from '@/components/applicationEditView';

export default function ApplicationEdit() {
  const searchParams = useSearchParams();
    // カスタムフック
    const pageBack = usePageBack();
    const pageTitle = useSetPageTitle();

  useEffect(() =>{
    pageBack(false);
    pageTitle(pageCommonConst.pageName.applicationNew);
  },[])

  return (
    <div className="">
      <ApplicationEditView isAdminFlow={false} isNew={true} selectDate={searchParams?.get(pageCommonConst.param.selectDate)} applicationId={null} onReload={() => {}}></ApplicationEditView>
    </div>
  );
};
