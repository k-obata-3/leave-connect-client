"use client"

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import usePageBack from '@/hooks/usePageBack';
import useSetPageTitle from '@/hooks/useSetPageTitle';
import { pageCommonConst } from '@/consts/pageCommonConst';
import ApplicationEditView from '@/components/applicationEditView';

export default function ApplicationNewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // カスタムフック
  const pageBack = usePageBack();
  const pageTitle = useSetPageTitle();

  useEffect(() =>{
    pageTitle(pageCommonConst.pageName.applicationNew);
    const ref = searchParams.get(pageCommonConst.param.ref);
    if(ref) {
      pageBack(true).then(() => {
        const ref = searchParams.get(pageCommonConst.param.ref);
        router.replace(`${ref}`, {scroll: true});
      }).catch(() => {
        return true;
      })
    } else {
      pageBack(false);
    }
  },[])

  return (
    <div className="application-new-page">
      <ApplicationEditView isAdminFlow={false} isNew={true} selectDate={searchParams?.get(pageCommonConst.param.selectDate)} applicationId={null} onReload={() => {}}></ApplicationEditView>
    </div>
  );
};
