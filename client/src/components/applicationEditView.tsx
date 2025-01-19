"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Flatpickr from 'react-flatpickr';
import { Japanese } from 'flatpickr/dist/l10n/ja.js';
import 'flatpickr/dist/flatpickr.min.css';
import "flatpickr/dist/themes/material_blue.css";

import { useCommonStore } from '@/store/commonStore';
import { useNotificationMessageStore } from '@/store/notificationMessageStore';
import useConfirm from '@/hooks/useConfirm';
import { commonConst } from '@/consts/commonConst';
import { pageCommonConst } from '@/consts/pageCommonConst';
import { confirmModalConst } from '@/consts/confirmModalConst';
import { ApplicationClassificationObject, ApplicationTypeFormat, ApplicationTypeObject, useApplicationSettingStore } from '@/store/applicationSettingStore';
import { Application, ApprovalTtask, AvailableOperation, getApplication, getApplicationRequest, getApplicationResponse } from '@/api/getApplication';
import { SaveApplicationRequest, SaveApplicationResponse, saveApplication } from '@/api/saveApplication';
import { DeleteApplicationRequest, deleteApplication } from '@/api/deleteApplication';
import { CancelApplicationRequest, cancelApplication } from '@/api/cancelApplication';
import { getNotification, GetNotificationResponse } from '@/api/getNotification';
import { ApprovalGroupObject, getApprovalGroupList, GetApprovalGroupListResponse } from '@/api/getApprovalGroupList';
import ApprovalStatusListView from './approvalStatusListView';

type Props = {
  isAdminFlow: boolean,
  isNew: boolean,
  selectDate: string | null,
  applicationId: string | null,
  onReload: () => void,
}

export default function ApplicationEditView({ isAdminFlow, isNew, selectDate, applicationId, onReload }: Props) {
  const router = useRouter();
  // モーダル表示 カスタムフック
  const confirm = useConfirm();

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

  // 共通Store
  const { setCommonObject } = useCommonStore();
  const { setNotificationMessageObject } = useNotificationMessageStore();
  const { getApplicationTypeObject } = useApplicationSettingStore();
  const [application, setApplication] = useState<Application | null>(null);
  const [approvalTtasks, setApprovalTtasks] = useState<ApprovalTtask[]>([]);
  const [availableOperation, setAvailableOperation] = useState<AvailableOperation | null>(null);
  const [approvalGroup, setApprovalGroup] = useState<ApprovalGroupObject[]>([]);
  const [editEnabled, setEditEnabled] = useState(false);
  const [isTimeFormat, setIsTimeFormat] = useState(false);
  const [isPeriodFormat, setIsPeriodFormat] = useState(false);
  const [currentTotalTimeArray, setCurrentTotalTimeArray] = useState<string[]>([]);
  const [isLoadComplete, setIsLoadComplete] = useState(false);

  const [inputValues, setInputValues] = useState({
    // currentDate: today,
    currentStartDate: today,
    currentEndDate: today,
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    totalTime: '',
    classification: '',
    type: '',
    applicationUserName: '',
    comment: '',
    remarks: '',
  });

  const [currentSelectApprovalGroup, setCurrentSelectApprovalGroup] = useState({
    id: '',
    name: '',
    users: [{}],
  });

  const [inputError, setInputError] = useState({
    startEndDateObj: '',
    startEndTime: '',
    approvalGroup: '',
    comment: '',
  });

  useEffect(() =>{
    (async() => {
      if(!(applicationId || isNew)) {
        return;
      }

      setApplication(null);
      setApprovalTtasks([]);
      setAvailableOperation(null);
      setApprovalGroup([]);
      setEditEnabled(false);
      setIsTimeFormat(false);
      setIsPeriodFormat(false);
      setCurrentTotalTimeArray([]);
      setIsLoadComplete(false);
      setInputError({ ...inputError,
        startEndDateObj: '',
        startEndTime: '',
        approvalGroup: '',
        comment: '',
      });

      // 承認グループ設定
      const approvalGroupList = await callGetApprovalGroupList();
      if(!approvalGroupList?.length) {
        return;
      }
      setApprovalGroup(approvalGroupList);

      if(applicationId && !isNew) {
        await setApplicationInput();
      } else if(isNew && !applicationId) {
        const initialDate = selectDate ? new Date(selectDate) : today;
        inputValues.startDate = initialDate.toLocaleDateString('ja-JP');
        inputValues.endDate = initialDate.toLocaleDateString('ja-JP');
        inputValues.currentStartDate = initialDate;
        inputValues.currentEndDate = initialDate;
        inputValues.comment = "";
        inputValues.remarks = "";
        resetSelectApplicationType(commonConst.initialApplicationTypeValues);
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
        // console.log(res.availableOperation)
        const startDateObj = new Date(res.application.startDate);
        const endDateObj = new Date(res.application.endDate);
        setApplication(res.application);
        setApprovalTtasks(res.approvalTtasks);
        setAvailableOperation(res.availableOperation);
        setEditEnabled(!!res.availableOperation?.isEdit);
        setInputValues({ ...inputValues,
          currentStartDate: startDateObj,
          currentEndDate: endDateObj,
          startDate: startDateObj.toLocaleDateString('jp'),
          endDate: endDateObj.toLocaleDateString('jp'),
          startTime: `${startDateObj.getHours()}:${startDateObj.getMinutes()}:00`,
          endTime: `${endDateObj.getHours()}:${endDateObj.getMinutes()}:00`,
          totalTime: res.application.totalTime,
          classification: res.application.classification,
          type: res.application.type,
          applicationUserName: res.application.applicationUserName,
          comment: !res.application.comment || !res.availableOperation?.isEditApprovalGroup || res.availableOperation?.isCancel ? '' : res.application.comment,
          remarks: !res.application.remarks ? '' : res.application.remarks,
        });
        setCurrentSelectApprovalGroup({ ...currentSelectApprovalGroup,
          id: res.application.approvalGroupId.toString(),
          name: res.application.approvalGroupName,
          users: res.application.approvers,
        });
        resetSelectApplicationType(res.application.type);
        setIsLoadComplete(true);
      } else {
        setErrorMessage(res.message);
      }
    })
  }

  const getApplicationType = (applicationType: string) => {
    const typeObject = getApplicationTypeObject()?.find(item => item.value?.toString() == applicationType);
    if(!typeObject){
      return null;
    }

    return typeObject;
  }

  const getApplicationClassifications = (applicationType: string) => {
    const typeObject = getApplicationType(applicationType);
    if(!typeObject){
      return [];
    }

    return typeObject.classifications;
  }

  const resetSelectApplicationType = (applicationType: string) => {
    const typeObject = getApplicationTypeObject()?.find(item => item.value?.toString() == applicationType);
    if(!typeObject){
      return null;
    }

    inputValues.type = applicationType;
    inputValues.classification = typeObject.initialValue?.classification.toString();
    inputValues.startTime = typeObject.initialValue?.startTime;
    inputValues.endTime = typeObject.initialValue?.endTime;
    inputValues.totalTime = typeObject.initialValue?.totalTime.toString();
    setIsTimeFormat(typeObject.format == ApplicationTypeFormat.time);
    setIsPeriodFormat(typeObject.format == ApplicationTypeFormat.period);
    const classificationObject = typeObject.classifications?.find(item => item.value == typeObject.initialValue?.classification);
    if(classificationObject) {
      setCurrentTotalTimeArray(getSelectTotalTimeArray(classificationObject));
    }

    return typeObject;
  }

  const resetSelectClassification = (applicationClassification: string) => {
    const classifications = getApplicationClassifications(inputValues.type);
    const classificationObject = classifications?.find(item => item.value.toString() == applicationClassification);
    if(classificationObject) {
      inputValues.totalTime = classificationObject?.min.toString();
      setCurrentTotalTimeArray(getSelectTotalTimeArray(classificationObject));
    }
  }

  const getSelectTotalTimeArray = (classification: ApplicationClassificationObject) => {
    let totalTimes = [];
    for(let i = classification.min; i <= classification.max; i++){
      totalTimes.push(i.toString());
    }

    return totalTimes
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
    } else if(e.target.name === 'type') {
      resetSelectApplicationType(targetValue);
    } else if(e.target.name === 'classification') {
      resetSelectClassification(targetValue);
    }

    setInputValues({ ...inputValues, [e.target.name]: targetValue});
  }

  const handleOnDateChange = (date: Date, name: any) => {
    if(isPeriodFormat) {
      setInputValues({ ...inputValues, [name]: date ? date.toLocaleDateString('ja-JP') : null});
    } else {
      setInputValues({
        ...inputValues,
        ['startDate']: date ? date.toLocaleDateString('ja-JP') : '',
        ['endDate']: date ? date.toLocaleDateString('ja-JP') : '',
      });
    }
  }

  const handleOnStartEndTimeChange = (date: Date, name: any) => {
    if(date) {
      setInputValues({ ...inputValues, [name]: date.toLocaleTimeString('ja-JP')});
    } else {
      setInputValues({ ...inputValues, [name]: null});
    }
  }

  /**
   * 申請ボタン押下
   * @param action 
   * @returns 
   */
  const onSave = async(action: string) => {
    const requiredErrors = {
      ...inputError,
      ['startEndDateObj']: inputValues.startDate && inputValues.endDate ? '' : '取得日は必須入力です。',
      ['startEndTime']: inputValues.startTime && inputValues.endTime ? '' : '取得時間は必須入力です。',
      ['comment']: inputValues.comment.trim() ? '' : '申請コメントは必須入力です。',
      ['approvalGroup']: currentSelectApprovalGroup.id ? '' : '承認グループを選択してください。',
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
      description: `${action == commonConst.actionValue.draft.toString() ? confirmModalConst.message.saveApplication : confirmModalConst.message.submitApplication}`,
    }).then(async() => {
      console.log(inputValues)
      const request: SaveApplicationRequest = {
        id: application?.id,
        type: inputValues.type,
        classification: inputValues.classification,
        startDate: inputValues.startDate,
        endDate: isPeriodFormat ? inputValues.endDate : inputValues.startDate,
        startTime: inputValues.startTime,
        endTime: inputValues.endTime,
        totalTime: inputValues.totalTime,
        comment: inputValues.comment,
        approvalGroupId: Number(currentSelectApprovalGroup.id),
        action: action,
        remarks: inputValues.remarks,
      }

      const saveApplicationRes = await saveApplication(request).then((res: SaveApplicationResponse) => {
        return res;
      })
  
      if(saveApplicationRes?.responseResult) {
        // 通知情報の更新
        await updateNotificationObject();
        onReload();
        router.replace(pageCommonConst.path.application, {scroll: true});
      } else {
        setErrorMessage(saveApplicationRes.message);
      }
    }).catch(() => {
      return true
    })

    if (cancel) {
    }
  }

  /**
   * 削除ボタン押下
   */
  const onDelete = async() => {
    const cancel = await confirm({
      title: confirmModalConst.label.delete,
      icon: 'warn',
      confirmationText: confirmModalConst.button.delete,
      confirmationBtnColor: 'danger',
      description: confirmModalConst.message.deleteApplication,
    }).then(async() => {
      const request: DeleteApplicationRequest = {
        id: application?.id,
      }
  
      const res = await deleteApplication(request);
      if(res.responseResult) {
        // 通知情報の更新
        await updateNotificationObject();
        onReload();
        router.replace(isAdminFlow ? pageCommonConst.path.adminApplication : pageCommonConst.path.application, {scroll: true});
      } else {
        setErrorMessage(res.message);
      }
    }).catch(() => {
      return true
    })

    if (cancel) {
    }
  };

  /**
   * 取消ボタン押下
   */
  const onCancel = async() => {
    const requiredErrors = {
      ...inputError,
      ['comment']: !inputValues.comment.trim() ? '取消コメントは必須入力です。' : '',
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
      title: confirmModalConst.label.applicationCancel,
      icon: 'warn',
      confirmationText: confirmModalConst.button.applicationCancel,
      confirmationBtnColor: 'danger',
      description: confirmModalConst.message.cancelApplication,
    }).then(async() => {
      const request: CancelApplicationRequest = {
        applicationId: application?.id,
        comment: inputValues.comment,
      }

      await cancelApplication(request).then(async(cancelRes) => {
        if(cancelRes.responseResult) {
          // 通知情報の更新
          await updateNotificationObject();
          onReload();
          router.replace(pageCommonConst.path.adminApplication, {scroll: true});
        } else {
          setErrorMessage(cancelRes.message);
        }
      })
    }).catch(() => {
      return true
    })

    if (cancel) {
    }
  }

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

  return (
    <>
      <div className="row application-edit" hidden={!isLoadComplete}>
        <div className="col-xxl-6 ps-1 pe-1">
          <div className="operation-btn-parent-view">
            <div className="pc-only operation-btn-view-pc">
              <button className="btn btn-outline-danger" onClick={() => onCancel()} hidden={!availableOperation?.isCancel}>取消</button>
              <button className="btn btn-outline-danger" onClick={() => onDelete()} hidden={!availableOperation?.isDelete}>削除</button>
              <button className="btn btn-outline-primary ms-2" onClick={() => onSave(commonConst.actionValue.draft.toString())} hidden={!(!application || availableOperation?.isSave)}>保存</button>
              <button className="btn btn-outline-success ms-2" onClick={() => onSave(commonConst.actionValue.panding.toString())} hidden={!(!application || availableOperation?.isEdit)}>申請</button>
            </div>
            <div className="sp-only operation-btn-view-sp">
              <button className="btn btn-danger flex-grow-1 m-1" onClick={() => onCancel()} hidden={!availableOperation?.isCancel}>取消</button>
              <button className="btn btn-danger flex-grow-1 m-1" onClick={() => onDelete()} hidden={!availableOperation?.isDelete}>削除</button>
              <button className="btn btn-primary flex-grow-1 m-1 " onClick={() => onSave(commonConst.actionValue.draft.toString())} hidden={!(!application || availableOperation?.isSave)}>保存</button>
              <button className="btn btn-success flex-grow-1 m-1" onClick={() => onSave(commonConst.actionValue.panding.toString())} hidden={!(!application || availableOperation?.isEdit)}>申請</button>
            </div>
          </div>
          {/* ステータス */}
          <div className="row align-items-center mb-3 g-3" hidden={!application}>
            <div className="col-md-2">
              <label className="col-form-label fw-medium">ステータス</label>
            </div>
            <div className="col-md-3 ps-3">
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
                {
                  getApplicationTypeObject()?.map((item: ApplicationTypeObject, index: number) => {
                    return <option value={item.value} key={index}>{item.name}</option>
                  })
                }
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
              <select className="form-select" id="classification" value={inputValues.classification} name="classification" onChange={(e) => handleOnChange(e)} disabled={!isTimeFormat}>
                {
                  getApplicationClassifications(inputValues.type).map((item: ApplicationClassificationObject, index: number) => {
                    return <option value={item.value} key={index}>{item.name}</option>
                  })
                }
              </select>
            </div>
            <div className="col ps-3" hidden={editEnabled}>
              <p className="mb-0">
                <span className="me-3">{application?.sClassification}</span>
                <span>{application?.totalTime}時間</span>
              </p>
            </div>
          </div>
          {/* 取得日 開始 */}
          <div className="row align-items-center mb-3 g-3">
            <div className="col-md-2">
              <label className="col-form-label fw-medium" htmlFor="startDateObj">{isPeriodFormat ? '取得日開始' : '取得日'}</label>
            </div>
            <div className="col-8 col-md-5" hidden={!editEnabled}>
              <Flatpickr className="form-select" id="startDateObj" options={dateOption}
                value={inputValues.currentStartDate} name="startDate" onChange={([date]: any) => handleOnDateChange(date, "startDate")}/>
            </div>
            <div className="col ps-3" hidden={editEnabled}>
              <p className="mb-0">{application?.sStartDate}</p>
            </div>
          </div>
          {/* 取得日 終了 */}
          <div className="row align-items-center mb-3 g-3" hidden={!isPeriodFormat}>
            <div className="col-md-2">
              <label className="col-form-label fw-medium" htmlFor="endDateObj">取得日終了</label>
            </div>
            <div className="col-8 col-md-5" hidden={!editEnabled}>
              <Flatpickr className="form-select" id="endDateObj" options={dateOption}
                value={inputValues.currentEndDate} name="endDateObj" onChange={([date]: any) => handleOnDateChange(date, "endDate")}/>
            </div>
            <div className="col ps-3" hidden={editEnabled}>
              <p className="mb-0">{application?.sEndDate}</p>
            </div>
          </div>
          <div className="col-12 col-md-8 offset-md-2 mb-3 g-3">
            <span className="input_error">{inputError.startEndDateObj}</span>
          </div>
          {/* 取得時間 */}
          <div className="row align-items-center mb-3 g-3" hidden={!isTimeFormat}>
            <div className="col-md-2 mb-2">
              <label className="col-form-label fw-medium" htmlFor="startTime">取得時間</label>
            </div>
            <div className="col-5 col-md-2 mb-2" hidden={!editEnabled}>
              <Flatpickr className="form-select" id="startTime" options={timeOption}
                value={inputValues.startTime} name="startTime" onChange={([date]: any) => handleOnStartEndTimeChange(date, "startTime")}/>
            </div>
            <div className="col-1 text-center mb-2" hidden={!editEnabled}>
              <span>～</span>
            </div>
            <div className="col-5 col-md-2 mb-2 me-2" hidden={!editEnabled}>
              <Flatpickr className="form-select" id="endTime" options={timeOption}
                value={inputValues.endTime} name="endTime" onChange={([date]: any) => handleOnStartEndTimeChange(date, "endTime")}/>
            </div>
            <div className="col-5 col-md-2 mb-2" hidden={!editEnabled}>
              <select className="form-select" id="totalTime" value={inputValues.totalTime} name="totalTime" onChange={(e) => handleOnChange(e)} disabled={currentTotalTimeArray.length == 1}>
                {
                  currentTotalTimeArray.map((num: any, index: number) => (
                    <option value={num} key={index}>{num}時間</option>
                  ))
                }
              </select>
            </div>
            <p className="input_error" hidden={!editEnabled}>{inputError.startEndTime}</p>
            <div className="col ps-3" hidden={editEnabled}>
              <span>{application?.sStartTime} ～ {application?.sEndTime}</span>
            </div>
          </div>
          {/* 備考 */}
          <div className="row mb-3 g-3">
            <div className="col-md-2">
              <label className="col-form-label fw-medium" htmlFor="remarks">備考</label>
            </div>
            <div className="col-12" hidden={!editEnabled}>
              <textarea className="form-control non-resize" id="remarks" rows={2} placeholder="任意"
                value={inputValues.remarks} name="remarks" onChange={(e) => handleOnChange(e)}></textarea>
            </div>
            <div className="col ps-3" hidden={editEnabled}>
              <p className="mb-0 comment">{application?.remarks}</p>
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
              <select className="form-select" id="approvalGroup" value={currentSelectApprovalGroup.id} name="approvalGroup" onChange={(e) => handleOnChange(e)} disabled={!(!application || availableOperation?.isEditApprovalGroup || (editEnabled && !application.approvers.length))}>
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
          <div className="row align-items-center g-3 mb-2" hidden={!currentSelectApprovalGroup.id}>
            <ol className="list-group list-group-numbered col-md-10 offset-md-2">
              {
                currentSelectApprovalGroup.users?.map((user: any, index: number) => (
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
    </>
  )
};
