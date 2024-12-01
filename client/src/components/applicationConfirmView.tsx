"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Application, ApprovalTtask, AvailableOperation, getApplication, getApplicationRequest, getApplicationResponse } from '@/api/getApplication';
import { approve, ApproveRequest } from '@/api/approve';
import { useCommonStore } from '@/app/store/CommonStore';
import { getNotification, GetNotificationResponse } from '@/api/getNotification';
import { ApprovalGroupObject } from '@/api/getApprovalGroupList';
import ApprovalStatusListView from './approvalStatusListView';

type Props = {
  applicationId: string | null,
  taskId: string | null,
}

export default function ApplicationConfirmView({ applicationId, taskId }: Props) {
  const router = useRouter();
  // 共通Sore
  const { setCommonObject, getCommonObject } = useCommonStore();

  const [application, setApplication] = useState<Application | null>(null);
  const [approvalTtasks, setApprovalTtasks] = useState<ApprovalTtask[]>([]);
  const [availableOperation, setAvailableOperation] = useState<AvailableOperation | null>(null);
  const [approvalGroup, setApprovalGroup] = useState<ApprovalGroupObject | null>(null);
  const [inputValues, setInputValues] = useState({
    approvalComment: '',
  });
  const [inputError, setInputError] = useState({
    approvalComment: '',
  });

  useEffect(() =>{
    (async() => {
      if(!applicationId && !taskId) {
        return;
      }

      const req: getApplicationRequest = {
        applicationId: applicationId,
        taskId: taskId,
        isAdminFlow: applicationId && taskId ? false : true,
      }
      await getApplication(req).then(async(res: getApplicationResponse) => {
        if(res.responseResult) {
          setApplication(res.application);
          setApprovalTtasks(res.approvalTtasks);
          setAvailableOperation(res.availableOperation);
          setApprovalGroup({
            groupId: res.application.approvalGroupId,
            groupName: res.application.approvalGroupName,
            approver: res.application.approvers,
          })

          const approvalTask = res.approvalTtasks?.findLast((task: any) => task.id == taskId);
          setInputValues({ ...inputValues,
            approvalComment: approvalTask?.comment ? approvalTask.comment : ''
          })
        } else {
          setCommonObject({
            errorMessage: res.message ? res.message : "",
            actionRequiredApplicationCount: getCommonObject().actionRequiredApplicationCount,
            approvalTaskCount: getCommonObject().approvalTaskCount,
            activeApplicationCount: getCommonObject().activeApplicationCount,
          })
        }
      })
    })()
  }, [applicationId, taskId])

  const handleOnChange = (e: any) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value});
  }

  /**
   * 承認ボタン押下
   * @param action 
   */
  const onSubmit = async(action: string) => {
    setInputError({ ...inputError,
      ['approvalComment']: !inputValues.approvalComment ? '承認者コメントは必須入力です。' : '',
    });

    if(!inputValues.approvalComment) {
      return;
    }

    const request: ApproveRequest = {
      application_id: Number(application?.id),
      task_id: Number(taskId),
      comment: inputValues.approvalComment,
      action: Number(action),
    }

    await approve(request).then(async(approveRes) => {
      if(approveRes.responseResult) {
        // 通知情報の更新
        updateNotificationObject();
        router.push('/approval/list', {scroll: true});
      } else {
        setErrorMessage(approveRes.message);
      }
    })
  };

  /**
   * 通知情報更新
   * @returns 
   */
  const updateNotificationObject = async() => {
    return await getNotification().then((res: GetNotificationResponse) => {
      if(res.responseResult) {
        setCommonObject({
          errorMessage: getCommonObject().errorMessage,
          actionRequiredApplicationCount: res.actionRequiredApplicationCount,
          approvalTaskCount: res.approvalTaskCount,
          activeApplicationCount: res.activeApplicationCount,
        })
      }
    })
  }

  /**
   * エラーメッセージ設定
   * @param message 
   */
  const setErrorMessage = (message: string | undefined) => {
    setCommonObject({
      errorMessage: message ? message : "",
      actionRequiredApplicationCount: getCommonObject().actionRequiredApplicationCount,
      approvalTaskCount: getCommonObject().approvalTaskCount,
      activeApplicationCount: getCommonObject().activeApplicationCount,
    })
  }

  if(application) {
    return (
      <div className="row">
        <div className="col-xxl-6 ps-1 pe-1">
          {/* 状況 */}
          <div className="row align-items-center mb-3 g-3">
            <div className="col-md-2">
              <label className="col-form-label fw-medium">ステータス</label>
            </div>
            <div className="col ps-3">
              <p className="mb-0">{application.sAction}</p>
            </div>
          </div>
          {/* 申請日 */}
          <div className="row align-items-center mb-3 g-3">
            <div className="col-md-2">
              <label className="col-form-label fw-medium">申請日</label>
            </div>
            <div className="col ps-3">
              <p className="mb-0">{application.sApplicationDate}</p>
            </div>
          </div>
          {/* 申請者 */}
          <div className="row align-items-center mb-3 g-3">
            <div className="col-md-2">
              <label className="col-form-label fw-medium">申請者</label>
            </div>
            <div className="col ps-3">
              <p className="mb-0">{application.applicationUserName}</p>
            </div>
          </div>
          {/* 申請種類 */}
          <div className="row align-items-center mb-3 g-3">
            <div className="col-md-2">
              <label className="col-form-label fw-medium" htmlFor="type">申請種類</label>
            </div>
            <div className="col ps-3">
              <p className="mb-0">{application.sType}</p>
            </div>
          </div>
          {/* 区分 */}
          <div className="row align-items-center mb-3 g-3">
            <div className="col-md-2">
              <label className="col-form-label fw-medium" htmlFor="classification">区分</label>
            </div>
            <div className="col ps-3">
              <p className="mb-0">
                <span className="me-3">{application.sClassification}</span>
                <span hidden={application.classification != '3'}>{application.totalTime}時間</span>
              </p>
            </div>
          </div>
          {/* 取得日時 */}
          <div className="row align-items-center mb-3 g-3">
            <div className="col-md-2">
              <label className="col-form-label fw-medium">取得日時</label>
            </div>
            <div className="col ps-3">
              <p className="mb-0">
                  <span className="me-3">{application.sStartDate}</span>
                  <span>{application.sStartTime} ～ {application.sEndTime}</span>
                </p>
            </div>
          </div>
          {/* 申請コメント */}
          <div className="row mb-3 g-3">
            <div className="col-md-2">
              <label className="col-form-label fw-medium" htmlFor="comment">申請コメント</label>
            </div>
            <div className="col ps-3">
              <p className="mb-0 comment">{application.comment}</p>
            </div>
          </div>
          {/* 承認者コメント */}
          <div className="row mb-3 g-3" hidden={!taskId}>
            <div className="col-md-2">
              <label className="col-form-label fw-medium" htmlFor="approvalComment">承認者コメント</label>
            </div>
            <div className="col-12" hidden={!availableOperation?.isApproval}>
              <textarea className="form-control non-resize" id="approvalComment" rows={5} placeholder="コメントを入力してください。"
                value={inputValues.approvalComment} name="approvalComment" onChange={(e) => handleOnChange(e)}></textarea>
              <p className="input_error">{inputError.approvalComment}</p>
            </div>
            <div className="col ps-3" hidden={availableOperation?.isApproval}>
              <p className="mb-0 comment">{inputValues.approvalComment}</p>
            </div>
          </div>
          {/* 承認グループ */}
          <div className="row align-items-center mb-3 g-3">
            <div className="col-md-2">
              <label className="col-form-label fw-medium" htmlFor="approvalGroup">承認グループ</label>
            </div>
            <div className="col ps-3 pe-3">
                <p className="mb-0">{approvalGroup?.groupName}</p>
            </div>
          </div>
          {/* 承認グループ 詳細表示 */}
          <div className="row align-items-center g-3">
            <ol className="list-group list-group-numbered col-md-10 offset-md-2">
              {
                approvalGroup?.approver?.map((user: any, index: number) => (
                  <li className="list-group-item" key={index}>{user.name}</li>
                ))
              }
            </ol>
          </div>
          <div className="row col-12 mt-4" hidden={!availableOperation?.isApproval}>
            <div className="col-1 text-start"></div>
            <div className="col text-end">
              <button className="btn btn-outline-danger me-5" onClick={() => onSubmit('4')}>差戻</button>
              <button className="btn btn-outline-success" onClick={() => onSubmit('2')}>承認</button>
            </div>
          </div>
        </div>
        {/* 承認状況表示エリア */}
        <div className="col ps-1 pe-1" hidden={!application || availableOperation?.isSave}>
          <ApprovalStatusListView tasks={approvalTtasks}></ApprovalStatusListView>
        </div>
      </div>
    )
  }
};
