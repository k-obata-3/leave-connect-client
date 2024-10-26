"use client"

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation'
import ApplicationEditView from '@/components/applicationEditView';
import ApprovalListView from '@/components/approvalListView';
import { getApplication, getApplicationRequest, getApplicationResponse } from '@/api/getApplication';
import { useCommonStore } from '@/app/store/CommonStore';

export default function ApprovalEdit() {
  const params = useParams();
  const searchParams = useSearchParams();

    // 共通Sore
    const { setCommonObject, getCommonObject } = useCommonStore();
    const [application, setApplication] = useState<getApplicationResponse>();

  useEffect(() =>{
    const applicationId = searchParams.get("applicationId");
    if(!params || !params.id || !applicationId) {
      return;
    }

    (async() => {
      const req: getApplicationRequest = {
        id: applicationId
      }
      await getApplication(req).then(async(res: getApplicationResponse) => {
        setApplication(res);
      }).catch(async(err) => {
        setCommonObject({
          errorMessage: err?.message,
          actionRequiredApplicationCount: getCommonObject().actionRequiredApplicationCount,
          approvalTaskCount: getCommonObject().approvalTaskCount,
          activeApplicationCount: getCommonObject().actionRequiredApplicationCount,
        })
      })
    })();
  }, [])

  return (
    <div className="approval-edit">
      <div className="page-title">
        <h3>承認</h3>
      </div>
      <div className="row" hidden={!application}>
        <div className="col-xxl-6">
          <ApplicationEditView isAdmin={false} selectDate={null} application={application} approvalId={Number(params.id[0])}></ApplicationEditView>
        </div>
        <div className="col">
          <ApprovalListView tasks={application?.approvalTtasks}></ApprovalListView>
        </div>
      </div>
    </div>
  );
};
