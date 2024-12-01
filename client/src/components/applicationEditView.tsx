"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Flatpickr from 'react-flatpickr';
import { Japanese } from 'flatpickr/dist/l10n/ja.js';
import 'flatpickr/dist/flatpickr.min.css';
import "flatpickr/dist/themes/material_blue.css";

import { Application, ApprovalTtask, AvailableOperation, getApplication, getApplicationRequest, getApplicationResponse } from '@/api/getApplication';
import { SaveApplicationRequest, SaveApplicationResponse, saveApplication } from '@/api/saveApplication';
import { DeleteApplicationRequest, deleteApplication } from '@/api/deleteApplication';
import { CancelApplicationRequest, cancelApplication } from '@/api/cancelApplication';
import { useCommonStore } from '@/app/store/CommonStore';
import { getNotification, GetNotificationResponse } from '@/api/getNotification';
import { ApprovalGroupObject, getApprovalGroupList, GetApprovalGroupListResponse } from '@/api/getApprovalGroupList';
import ApprovalStatusListView from './approvalStatusListView';

type Props = {
  isAdminFlow: boolean,
  isNew: boolean,
  selectDate: string | null,
  applicationId: string | null,
}

export default function ApplicationEditView({ isAdminFlow, isNew, selectDate, applicationId }: Props) {
  const router = useRouter();
  const today = new Date();
  let dateOption = {
    locale: Japanese,
    dateFormat: 'Y/m/d(D)',
  };

  let timeOption = {
    locale: Japanese,
    dateFormat: "H:i",
    enableTime: true,
    noCalendar: true,
    time_24hr: true,
    minuteIncrement: 10,
  };

  // 共通Sore
  const { setCommonObject, getCommonObject } = useCommonStore();
  const [application, setApplication] = useState<Application | null>(null);
  const [approvalTtasks, setApprovalTtasks] = useState<ApprovalTtask[]>([]);
  const [availableOperation, setAvailableOperation] = useState<AvailableOperation | null>(null);
  const [approvalGroup, setApprovalGroup] = useState<ApprovalGroupObject[]>([]);
  const [editEnabled, setEditEnabled] = useState(false);
  const [isLoadComplete, setIsLoadComplete] = useState(false);

  const [inputValues, setInputValues] = useState({
    currentDate: today,
    startEndDate: '',
    startTime: '',
    endTime: '',
    totalTime: '8',
    classification: '',
    type: '',
    applicationUserName: '',
    comment: '',
  });

  const [currentSelectApprovalGroup, setCurrentSelectApprovalGroup] = useState({
    id: '',
    name: '',
    users: [{}],
  });

  const [inputError, setInputError] = useState({
    startEndDate: '',
    approvalGroup: '',
    comment: '',
  });

  useEffect(() =>{
    (async() => {
      // 承認グループ設定
      const approvalGroupList = await callGetApprovalGroupList();
      if(!approvalGroupList.length) {
        return;
      }
      setApprovalGroup(approvalGroupList);

      if(applicationId && !isNew) {
        await setApplicationInput();
        setIsLoadComplete(true);
      } else if(isNew && !applicationId) {
        const startDate = selectDate ? new Date(selectDate) : today;
        setInputValues({ ...inputValues,
          type: '0',
          classification: '0',
          startEndDate: startDate.toLocaleDateString('ja-JP'),
          currentDate: startDate,
          startTime: `09:00:00`,
          endTime: `18:00:00`,
        });
        setEditEnabled(true);
        setIsLoadComplete(true);
      }
    })()
  }, [applicationId, isNew])

  const callGetApprovalGroupList = async() => {
    return await getApprovalGroupList().then(async(res: GetApprovalGroupListResponse) => {
      if(res.responseResult) {
        return res.approvalGroupList;
      } else {
        setErrorMessage(res.message);
        return [] as ApprovalGroupObject[];
      }
    });
  }

  const setApplicationInput = async() => {
    const req: getApplicationRequest = {
      applicationId: applicationId,
      taskId: null,
      isAdminFlow: isAdminFlow,
    }
    await getApplication(req).then(async(res: getApplicationResponse) => {
      if(res.responseResult) {
        // console.log(res.application)
        // console.log(res.approvalTtasks)
        console.log(res.availableOperation)
        const startDate = new Date(res.application.startDate);
        const endDate = new Date(res.application.endDate);
        setApplication(res.application);
        setApprovalTtasks(res.approvalTtasks);
        setAvailableOperation(res.availableOperation);
        setEditEnabled(!!res.availableOperation?.isEdit);
        setInputValues({ ...inputValues,
          currentDate: startDate,
          startEndDate: startDate.toLocaleDateString('jp'),
          startTime: `${startDate.getHours()}:${startDate.getMinutes()}:00`,
          endTime: `${endDate.getHours()}:${endDate.getMinutes()}:00`,
          totalTime: res.application.totalTime,
          classification: res.application.classification,
          type: res.application.type,
          applicationUserName: res.application.applicationUserName,
          comment: !res.application.comment || !res.availableOperation?.isEditApprovalGroup || res.availableOperation?.isCancel ? '' : res.application.comment,
        });
        setCurrentSelectApprovalGroup({ ...currentSelectApprovalGroup,
          id: res.application.approvalGroupId.toString(),
          name: res.application.approvalGroupName,
          users: res.application.approvers,
        });
      } else {
        setErrorMessage(res.message);
      }
    })
  }

  const handleOnChange = (e: any) => {
    let targetValue = e.target.value;
    if(e.target.name === 'approvalGroup') {
      inputError.approvalGroup = '';

      const selectedApprovalGroup: ApprovalGroupObject | undefined = approvalGroup.find((w: ApprovalGroupObject) => w.groupId == targetValue);
      if(selectedApprovalGroup && selectedApprovalGroup.groupId) {
        setCurrentSelectApprovalGroup({...currentSelectApprovalGroup,
          id: selectedApprovalGroup.groupId?.toString(),
          name: selectedApprovalGroup.groupName,
          users: selectedApprovalGroup.approver.filter((user) => user.id),
        });
      }
    } else if(e.target.name === 'classification') {
      if(targetValue == '0') {
        inputValues.totalTime = '8';
      } else if(targetValue === '1' || targetValue === '2') {
        inputValues.totalTime = '4';
      } else {
        inputValues.totalTime = '1';
      }
    }

    setInputValues({ ...inputValues, [e.target.name]: targetValue});
  }

  const handleOnDateChange = (date: Date, name: any) => {
    if(date) {
      setInputValues({ ...inputValues, [name]: date.toLocaleDateString('ja-JP')});
    } else {
      setInputValues({ ...inputValues, [name]: null});
    }
  }

  const handleOnStartEndTimeChange = (date: Date, name: any) => {
    setInputValues({ ...inputValues, [name]: date ? date.toLocaleTimeString('ja-JP') : ""});
  }

  /**
   * 申請ボタン押下
   * @param action 
   * @returns 
   */
  const onSave = async(action: string) => {
    setInputError({ ...inputError,
      ['startEndDate']: !inputValues.startEndDate ? '取得日は必須入力です。' : '',
      ['comment']: !inputValues.comment ? '申請コメントは必須入力です。' : '',
      ['approvalGroup']: !currentSelectApprovalGroup.id ? '承認グループを選択してください。' : '',
    });

    if(!inputValues.startEndDate || !inputValues.comment || !currentSelectApprovalGroup.id) {
      return;
    }

    const request: SaveApplicationRequest = {
      id: application?.id,
      type: inputValues.type,
      classification: inputValues.classification,
      startEndDate: inputValues.startEndDate,
      startTime: inputValues.startTime,
      endTime: inputValues.endTime,
      totalTime: inputValues.totalTime,
      comment: inputValues.comment,
      approvalGroupId: Number(currentSelectApprovalGroup.id),
      action: action,
    }

    const saveApplicationRes = await saveApplication(request).then((res: SaveApplicationResponse) => {
      return res;
    })

    if(saveApplicationRes?.responseResult) {
      // 通知情報の更新
      await updateNotificationObject();
      router.push('/application/list', {scroll: true});
    } else {
      setErrorMessage(saveApplicationRes.message);
    }
  }

  /**
   * 削除ボタン押下
   */
  const onDelete = async() => {
    const request: DeleteApplicationRequest = {
      id: application?.id,
    }

    const res = await deleteApplication(request);
    if(res.responseResult) {
      // 通知情報の更新
      await updateNotificationObject();
      router.push(isAdminFlow ? '/admin/application/list' : '/application/list', {scroll: true});
    } else {
      setErrorMessage(res.message);
    }
  };

  /**
   * 取消ボタン押下
   */
  const onCancel = async() => {
    setInputError({ ...inputError,
      ['comment']: !inputValues.comment ? '取消コメントは必須入力です。' : '',
    });

    if(!inputValues.comment) {
      return;
    }

    const request: CancelApplicationRequest = {
      applicationId: application?.id,
      comment: inputValues.comment,
    }

    await cancelApplication(request).then(async(cancelRes) => {
      if(cancelRes.responseResult) {
        // 通知情報の更新
        await updateNotificationObject();
        router.push('/admin/application/list', {scroll: true});
      } else {
        setErrorMessage(cancelRes.message);
      }
    })
  }

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

  return (
    <div className="row" hidden={!isLoadComplete}>
      <div className="col-xxl-6 ps-1 pe-1">
        {/* 状況 */}
        <div className="row align-items-center mb-3 g-3" hidden={!application}>
          <div className="col-md-2">
            <label className="col-form-label fw-medium">ステータス</label>
          </div>
          <div className="col ps-3">
            <p className="mb-0">{application?.sAction}</p>
          </div>
        </div>
        {/* 申請日 */}
        <div className="row align-items-center mb-3 g-3" hidden={!isAdminFlow}>
          <div className="col-md-2">
            <label className="col-form-label fw-medium">申請日</label>
          </div>
          <div className="col ps-3">
            <p className="mb-0">{application?.sApplicationDate}</p>
          </div>
        </div>
        {/* 申請者 */}
        <div className="row align-items-center mb-3 g-3" hidden={!isAdminFlow}>
          <div className="col-md-2">
            <label className="col-form-label fw-medium">申請者</label>
          </div>
          <div className="col ps-3">
            <p className="mb-0">{application?.applicationUserName}</p>
          </div>
        </div>
        {/* 申請種類 */}
        <div className="row align-items-center mb-3 g-3">
          <div className="col-md-2">
            <label className="col-form-label fw-medium" htmlFor="type">申請種類</label>
          </div>
          <div className="col col-md-5" hidden={!editEnabled}>
            <select className="form-select" id="type" value={inputValues.type} name="type" onChange={(e) => handleOnChange(e)}>
              <option value="0">年次有給休暇申請</option>
              <option value="1">休暇申請</option>
            </select>
          </div>
          <div className="col ps-3" hidden={editEnabled}>
            <p className="mb-0">{application?.sType}</p>
          </div>
        </div>
        {/* 区分 */}
        <div className="row align-items-center mb-3 g-3">
          <div className="col-md-2">
            <label className="col-form-label fw-medium" htmlFor="classification">区分</label>
          </div>
          <div className="col col-md-5" hidden={!editEnabled}>
            <select className="form-select" id="classification" value={inputValues.classification} name="classification" onChange={(e) => handleOnChange(e)}>
              <option value="0">全日</option>
              <option value="1">AM半休</option>
              <option value="2">PM半休</option>
              <option value="3">時間単位</option>
            </select>
          </div>
          <div className="col ps-3" hidden={editEnabled}>
            <p className="mb-0">
              <span className="me-3">{application?.sClassification}</span>
              <span hidden={application?.classification != '3'}>{application?.totalTime}時間</span>
            </p>
          </div>
        </div>
        {/* 取得日 */}
        <div className="row align-items-center mb-3 g-3">
          <div className="col-md-2">
            <label className="col-form-label fw-medium" htmlFor="startEndDate">取得日</label>
          </div>
          <div className="col-8 col-md-5" hidden={!editEnabled}>
            <Flatpickr className="form-select" id="startEndDate" options={dateOption}
              value={inputValues.currentDate} name="startEndDate" onChange={([date]: any) => handleOnDateChange(date, "startEndDate")}/>
            <p className="input_error">{inputError.startEndDate}</p>
          </div>
          <div className="col ps-3" hidden={editEnabled}>
            <p className="mb-0">{application?.sStartDate}</p>
          </div>
        </div>
        {/* 取得時間 */}
        <div className="row align-items-center mb-3 g-3">
          <div className="col-md-2 mb-2">
            <label className="col-form-label fw-medium" htmlFor="startDate">取得時間</label>
          </div>
          <div className="col-5 col-md-2 mb-2" hidden={!editEnabled}>
            <Flatpickr className="form-select" id="startDate" options={timeOption}
              value={inputValues.startTime} name="startTime" onChange={([date]: any) => handleOnStartEndTimeChange(date, "startTime")}/>
          </div>
          <div className="col-1 text-center mb-2" hidden={!editEnabled}>
            <span>～</span>
          </div>
          <div className="col-5 col-md-2 mb-2 me-2" hidden={!editEnabled}>
            <Flatpickr className="form-select" id="endDate" options={timeOption}
              value={inputValues.endTime} name="endTime" onChange={([date]: any) => handleOnStartEndTimeChange(date, "endTime")}/>
          </div>
          <div className="col-5 col-md-2 mb-2" hidden={!editEnabled}>
            <select className="form-select" id="totalTime" value={inputValues.totalTime} name="totalTime" onChange={(e) => handleOnChange(e)} disabled={inputValues.classification != '3'}>
              {
                ["1", "2", "3", "4", "5", "6", "7", "8"].map((num: any, index: number) => (
                  <option value={num} key={index}>{num}時間</option>
                ))
              }
            </select>
          </div>
          <div className="col ps-3" hidden={editEnabled}>
            <span>{application?.sStartTime} ～ {application?.sEndTime}</span>
          </div>
        </div>
        {/* 申請コメント */}
        <div className="row mb-3 g-3" hidden={!application || (editEnabled && availableOperation?.isEditApprovalGroup)}>
          <div className="col-md-2">
            <label className="col-form-label fw-medium" htmlFor="comment">{editEnabled && !availableOperation?.isEditApprovalGroup ? '前回申請コメント' : '申請コメント'}</label>
          </div>
          <div className="col ps-3">
            <p className="mb-0 comment">{application?.comment}</p>
          </div>
        </div>
        {/* コメント入力欄 */}
        <div className="row mb-3 g-3" hidden={!editEnabled && !availableOperation?.isCancel}>
          <div className="col-md-2">
            <label className="col-form-label fw-medium" htmlFor="comment">{availableOperation?.isCancel ? '取消コメント' : '申請コメント'}</label>
          </div>
          <div className="col-12">
            <textarea className="form-control non-resize" id="comment" rows={5} placeholder="コメントを入力してください。"
              value={inputValues.comment} name="comment" onChange={(e) => handleOnChange(e)}></textarea>
            <p className="input_error">{inputError.comment}</p>
          </div>
        </div>
        {/* 承認グループ */}
        <div className="row align-items-center mb-3 g-3">
          <div className="col-md-2">
            <label className="col-form-label fw-medium" htmlFor="approvalGroup">承認グループ</label>
          </div>
          <div className="col col-md-5">
            <select className="form-select" id="approvalGroup" value={currentSelectApprovalGroup.id} name="approvalGroup" onChange={(e) => handleOnChange(e)} disabled={!(!application || availableOperation?.isEditApprovalGroup)}>
              <option value=''>未選択</option>
              {
                approvalGroup.map((approvalGroup: any, index: number) => (
                  <option value={approvalGroup.groupId} key={index}>{approvalGroup.groupName}</option>
                ))
              }
            </select>
            <p className="input_error">{inputError.approvalGroup}</p>
          </div>
        </div>
        {/* 承認グループ 詳細表示 */}
        <div className="row align-items-center g-3" hidden={!currentSelectApprovalGroup.id}>
          <ol className="list-group list-group-numbered col-md-10 offset-md-2">
            {
              currentSelectApprovalGroup.users?.map((user: any, index: number) => (
                <li className="list-group-item" key={index}>{user.name}</li>
              ))
            }
          </ol>
        </div>
        <div className="row col-12 mt-4">
          <div className="col-1 text-start"></div>
          <div className="col text-end">
            <button className="btn btn-outline-danger" onClick={() => onCancel()} hidden={!availableOperation?.isCancel}>取消</button>
            <button className="btn btn-outline-danger" onClick={() => onDelete()} hidden={!availableOperation?.isDelete}>削除</button>
            <button className="btn btn-outline-primary ms-5 me-3" onClick={() => onSave('0')} hidden={!(!application || availableOperation?.isSave)}>保存</button>
            <button className="btn btn-outline-success ms-3 me-3" onClick={() => onSave('1')} hidden={!(!application || availableOperation?.isEdit)}>申請</button>
          </div>
        </div>
      </div>
      {/* 承認状況表示エリア */}
      <div className="col ps-1 pe-1" hidden={!application || availableOperation?.isSave}>
        <ApprovalStatusListView tasks={approvalTtasks}></ApprovalStatusListView>
      </div>
    </div>
  )
};
