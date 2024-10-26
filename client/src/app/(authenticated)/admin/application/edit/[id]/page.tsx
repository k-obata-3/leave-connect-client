"use client"

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import 'flatpickr/dist/flatpickr.min.css';
import "flatpickr/dist/themes/material_blue.css";

import { getApplication, getApplicationRequest, getApplicationResponse } from '@/api/getApplication';
import ApplicationEditView from '@/components/applicationEditView';
import ApprovalListView from '@/components/approvalListView';
import { useCommonStore } from '@/app/store/CommonStore';

export default function AdminApplicationEdit() {
  const params = useParams();

  // 共通Sore
  const { setCommonObject, getCommonObject } = useCommonStore();
  const [application, setApplication] = useState<getApplicationResponse>();

  useEffect(() =>{
    if(params && params.id) {
      (async() => {
        const req: getApplicationRequest = {
          id: params.id
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
      })()
    }
  }, [])

  return (
    <div className="application-edit">
      <div className="page-title">
        <h3>申請</h3>
      </div>
      <div className="row" hidden={!application}>
        <div className="col-xxl-6">
          <ApplicationEditView isAdmin={true} selectDate={null} application={application} approvalId={undefined}></ApplicationEditView>
        </div>
        <div className="col">
          <ApprovalListView tasks={application?.approvalTtasks}></ApprovalListView>
        </div>
      </div>
    </div>
  );
};
