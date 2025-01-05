"use client"

import React from 'react';
import { useSearchParams } from 'next/navigation';

import { pageCommonConst } from '@/consts/pageCommonConst';
import ApplicationEditView from '@/components/applicationEditView';

export default function ApplicationEdit() {
  const searchParams = useSearchParams();

  return (
    <div className="">
      <div className="page-title pc-only">
        <h3>{pageCommonConst.pageName.applicationNew}</h3>
      </div>
      <ApplicationEditView isAdminFlow={false} isNew={true} selectDate={searchParams?.get(pageCommonConst.param.selectDate)} applicationId={null} onReload={() => {}}></ApplicationEditView>
    </div>
  );
};
