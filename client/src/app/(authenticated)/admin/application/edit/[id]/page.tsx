"use client"

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ApplicationEditView from '@/components/applicationEditView';

export default function AdminApplicationEdit() {
  const params = useParams();
  const [applicationId, setApplicationId] = useState<string | null>(null);

  useEffect(() =>{
    if(params && params['id']) {
      setApplicationId(params['id'].toString())
    }
  }, [])

  return (
    <div className="application-edit">
      <div className="page-title">
        <h3>申請確認</h3>
      </div>
      <ApplicationEditView isAdminFlow={true} isNew={false} selectDate={null} applicationId={applicationId}></ApplicationEditView>
    </div>
  );
};
