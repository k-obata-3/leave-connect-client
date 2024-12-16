"use client"

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import ApplicationEditView from '@/components/applicationEditView';

export default function ApplicationEdit() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() =>{
    if(params && params['id'] && params['id'] != 'new') {
      setApplicationId(params['id'].toString());
      setIsNew(false);
    } else if(!params || !params['id'] || params['id'] == 'new') {
      setApplicationId(null);
      setIsNew(true);
    }
  }, [])

  return (
    <div className="application-edit">
      <div className="page-title pc-only">
        <h3>申請</h3>
      </div>
      <ApplicationEditView isAdminFlow={false} isNew={isNew} selectDate={searchParams?.get("selectDate")} applicationId={applicationId}></ApplicationEditView>
    </div>
  );
};
