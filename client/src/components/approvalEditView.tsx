"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useCommonStore } from '@/store/commonStore';
import { useNotificationMessageStore } from '@/store/notificationMessageStore';
import useConfirm from '@/hooks/useConfirm';
import { pageCommonConst } from '@/consts/pageCommonConst';
import { confirmModalConst } from '@/consts/confirmModalConst';
import { Application, ApprovalTtask, AvailableOperation, getApplication, getApplicationRequest, getApplicationResponse } from '@/api/getApplication';
import { approve, ApproveRequest } from '@/api/approve';
import { getNotification, GetNotificationResponse } from '@/api/getNotification';
import { ApprovalGroupObject } from '@/api/getApprovalGroupList';
import ApprovalStatusListView from './approvalStatusListView';
import { commonConst } from '@/consts/commonConst';

type Props = {
  taskId: string | null,
  applicationId: string | null,
  onReload: () => void,
}

export default function ApprovalEditView({ taskId, applicationId, onReload }: Props) {
  const router = useRouter();
  // 共通Store
  const { setCommonObject } = useCommonStore();
  const { setNotificationMessageObject } = useNotificationMessageStore();
  // モーダル表示 カスタムフック
  const confirm = useConfirm();

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
      if(!(taskId && applicationId)) {
        return;
      }

      setApplication(null);
      setApprovalTtasks([]);
      setAvailableOperation(null);
      setApprovalGroup(null);
      setInputError({ ...inputError,
        approvalComment: '',
      })

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
          setNotificationMessageObject({
            errorMessageList: res.message ? [res.message] : [],
            inputErrorMessageList: [],
          })
        }
      })
    })()
  }, [taskId, applicationId])

  const handleOnChange = (e: any) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value});
  }

  /**
   * 承認ボタン押下
   * @param action 
   */
  const onSubmit = async(action: string) => {
    const requiredErrors = {
      ...inputError,
      ['approvalComment']: !inputValues.approvalComment.trim() ? '承認者コメントは必須入力です。' : '',
    };

    for (const value of Object.values(requiredErrors)) {
      if(value.length) {
        setInputError(requiredErrors);
        setNotificationMessageObject({
          errorMessageList: [],
          inputErrorMessageList: ['入力内容が不正です。'],
        })
        return;
      }
    }

    const cancel = await confirm({
      description: `${action == commonConst.actionValue.approval.toString() ? confirmModalConst.message.approvalApplication : confirmModalConst.message.rejectApplication}`,
    }).then(async() => {
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
          onReload();
          router.replace(pageCommonConst.path.approval, {scroll: true});
        } else {
          setErrorMessage(approveRes.message);
        }
      })
    }).catch(() => {
      return true
    })
    if (cancel) {
    }
  };

  /**
   * 通知情報更新
   * @returns 
   */
  const updateNotificationObject = async() => {
    return await getNotification().then((res: GetNotificationResponse) => {
      if(res.responseResult) {
        setCommonObject({
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
    setNotificationMessageObject({
      errorMessageList: message ? [message] : [],
      inputErrorMessageList: [],
    })
  }

  if(application) {
    return (
      <div className="row approval-edit">
        <div className="col-xxl-6 ps-1 pe-1">
          <div className="operation-btn-parent-view" hidden={!availableOperation?.isApproval}>
            <div className="pc-only operation-btn-view-pc">
              <button className="btn btn-outline-warning" onClick={() => onSubmit(commonConst.actionValue.reject.toString())}>差戻</button>
              <button className="btn btn-outline-success ms-2" onClick={() => onSubmit(commonConst.actionValue.approval.toString())}>承認</button>
            </div>
            <div className="sp-only operation-btn-view-sp">
              <div className="operation-btn-view-sp">
                <button className="btn btn-warning flex-grow-1 m-1" onClick={() => onSubmit(commonConst.actionValue.reject.toString())}>差戻</button>
                <button className="btn btn-success flex-grow-1 m-1" onClick={() => onSubmit(commonConst.actionValue.approval.toString())}>承認</button>
              </div>
            </div>
          </div>
          {/* ステータス */}
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
              <label className="col-form-label fw-medium">申請種類</label>
            </div>
            <div className="col ps-3">
              <p className="mb-0">{application.sType}</p>
            </div>
          </div>
          {/* 区分 */}
          <div className="row align-items-center mb-3 g-3">
            <div className="col-md-2">
              <label className="col-form-label fw-medium">区分</label>
            </div>
            <div className="col ps-3">
              <p className="mb-0">
                <span className="me-3">{application.sClassification}</span>
                <span>{application.totalTime}時間</span>
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
                  <span className="me-3">{application.sStartDate}<span hidden={application.sStartDate == application.sEndDate}> ～ {application.sEndDate}</span></span>
                  <span hidden={application.sStartDate != application.sEndDate}>{application.sStartTime} ～ {application.sEndTime}</span>
                </p>
            </div>
          </div>
          {/* 備考 */}
          <div className="row mb-3 g-3">
            <div className="col-md-2">
              <label className="col-form-label fw-medium">備考</label>
            </div>
            <div className="col ps-3">
              <p className="mb-0 comment">{application.remarks}</p>
            </div>
          </div>
          {/* 申請コメント */}
          <div className="row mb-3 g-3">
            <div className="col-md-2">
              <label className="col-form-label fw-medium">申請コメント</label>
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
              <label className="col-form-label fw-medium">承認グループ</label>
            </div>
            <div className="col ps-3 pe-3">
              <p className="mb-0">{approvalGroup?.groupName}</p>
            </div>
          </div>
          {/* 承認グループ 詳細表示 */}
          <div className="row align-items-center g-3 mb-2">
            <ol className="list-group list-group-numbered col-md-10 offset-md-2">
              {
                approvalGroup?.approver?.map((user: any, index: number) => (
                  <li className="list-group-item" key={index}>{user.name}</li>
                ))
              }
            </ol>
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
