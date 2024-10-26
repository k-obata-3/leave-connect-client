"use client"

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';

import ApprovalListView from '@/components/approvalListView';
import { getApplication, getApplicationRequest, getApplicationResponse } from '@/api/getApplication';
import ApplicationEditView from '@/components/applicationEditView';
import { useCommonStore } from '@/app/store/CommonStore';

export default function ApplicationEdit() {
  const params = useParams();
  const searchParams = useSearchParams();

  // 共通Sore
  const { setCommonObject, getCommonObject } = useCommonStore();
  const [application, setApplication] = useState<getApplicationResponse>();
  const [showApplicationEdit, setShowApplicationEdit] = useState(false);

  useEffect(() =>{
    (async() => {
      if(params && params.id) {
        const req: getApplicationRequest = {
          id: params.id
        }
        await getApplication(req).then(async(res: getApplicationResponse) => {
          setShowApplicationEdit(true);
          setApplication(res);
        }).catch(async(err) => {
          setCommonObject({
            errorMessage: err?.message,
            actionRequiredApplicationCount: getCommonObject().actionRequiredApplicationCount,
            approvalTaskCount: getCommonObject().approvalTaskCount,
            activeApplicationCount: getCommonObject().activeApplicationCount,
          })
        });
      } else {
        setShowApplicationEdit(true);
      }
    })()
  }, [])

  return (
    <div className="application-edit">
      <div className="page-title">
        <h3>申請</h3>
      </div>
      <div className="row" hidden={!showApplicationEdit}>
        <div className="col-xxl-6">
          <ApplicationEditView isAdmin={false} selectDate={searchParams?.get("selectDate")} application={application} approvalId={undefined}></ApplicationEditView>
        </div>
        <div className="col" hidden={!application || application.action == 0}>
          <ApprovalListView tasks={application?.approvalTtasks}></ApprovalListView>
        </div>
      </div>
    </div>
  );
};
