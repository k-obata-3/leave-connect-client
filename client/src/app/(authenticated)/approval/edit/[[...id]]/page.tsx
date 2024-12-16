"use client"

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation'
import ApplicationConfirmView from '@/components/applicationConfirmView';


export default function ApprovalEdit() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);

  useEffect(() =>{
    const paramsApplicationId = searchParams.get("applicationId");
    if(params && params['id'] && paramsApplicationId) {
      setApplicationId(paramsApplicationId)
      setTaskId(params['id'].toString())
    }
  }, [])

  return (
    <div className="approval-edit">
      <div className="page-title pc-only">
        <h3>承認</h3>
      </div>
      <ApplicationConfirmView applicationId={applicationId} taskId={taskId}></ApplicationConfirmView>
    </div>
  );
};
