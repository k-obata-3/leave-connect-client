"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Flatpickr from 'react-flatpickr';
import { Japanese } from 'flatpickr/dist/l10n/ja.js';
import 'flatpickr/dist/flatpickr.min.css';
import "flatpickr/dist/themes/material_blue.css";

import { getApplicationResponse } from '@/api/getApplication';
import { SaveApplicationRequest, saveApplication } from '@/api/saveApplication';
import { DeleteApplicationRequest, deleteApplication } from '@/api/deleteApplication';
import { CancelApplicationRequest, cancelApplication } from '@/api/cancelApplication';
import { approve, ApproveRequest } from '@/api/approve';
import { useCommonStore } from '@/app/store/CommonStore';
import { getNotification } from '@/api/getNotification';
import { getApprovalGroupList, GetApprovalGroupListResponse } from '@/api/getApprovalGroupList';

type Props = {
  isAdmin: boolean,
  selectDate: string | null,
  application: getApplicationResponse | undefined,
  approvalId: number | undefined,
}

export default function ApplicationEditView({ isAdmin, selectDate, application, approvalId }: Props) {
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

  const [getApprovalGroupListResponse, setGetApprovalGroupListResponse] = useState<GetApprovalGroupListResponse[]>([]);
  let approvalGroupList: GetApprovalGroupListResponse[] = []

  // 共通Sore
  const { setCommonObject, getCommonObject } = useCommonStore();
  // 申請編集可否
  const [applicationEditEnabled, setApplicationEditEnabled] = useState(false);
  // 下書き状態のみでの編集可否
  const [draftApplicationOnlyEditEnabled, setDraftApplicationOnlyEditEnabled] = useState(false);
  // 申請取消可否
  const [applicationCancelEnabled, setApplicationCancelEnabled] = useState(false);
  // 承認操作可否
  const [approvalEnabled, setApprovalEnabled] = useState(false);

  const [labelValues, setLabelValues] = useState({
    sApplicationDate: '',
    sStartDate: '',
    sStartTime: '',
    sEndTime: '',
    sClassification: '',
    sType: '',
    sAction: '',
    lastTimeComment: '',
  });

  const [inputValues, setInputValues] = useState({
    currentDate: today,
    startEndDate: '',
    startTime: '',
    endTime: '',
    totalTime: '8',
    classification: '',
    type: '',
    applicationUserName: '',
    approvalGroup: {
      id: '',
      name: '',
      users: [{}],
    },
    comment: '',
    approvalComment: '',
  });

  const [inputError, setInputError] = useState({
    startEndDate: '',
    approvalGroup: '',
    comment: '',
    approvalComment: '',
  });

  useEffect(() =>{
    // 「下書き」または「却下」状態の場合、編集および削除可
    setApplicationEditEnabled(!isAdmin && !approvalId && (!application || application.action == 0 || application.action == 4));
    // 「下書き」状態の場合のみ、申請経路編集可、保存ボタン利用可
    setDraftApplicationOnlyEditEnabled(!isAdmin && !approvalId && (!application || application.action == 0));
    // 申請管理の場合、取消可
    setApplicationCancelEnabled(isAdmin && application?.action != 5);

    (async() => {
      await getApprovalGroupList().then(async(res: GetApprovalGroupListResponse[]) => {
        approvalGroupList = res;
        setGetApprovalGroupListResponse(res);
      }).catch(async(err) => {
        setCommonObject({
          errorMessage: err?.message,
          actionRequiredApplicationCount: getCommonObject().actionRequiredApplicationCount,
          approvalTaskCount: getCommonObject().approvalTaskCount,
          activeApplicationCount: getCommonObject().actionRequiredApplicationCount,
        })
      });

      if(application && application.id) {
        const startDate = new Date(application.startDate);
        const endDate = new Date(application.endDate);
  
        const approvalTaks = application.approvalTtasks.findLast((task: any) => task.id == approvalId);
        const selectedApprovalGroup: GetApprovalGroupListResponse | undefined = approvalGroupList.find((w: GetApprovalGroupListResponse) => w.groupId === Number(application.approvalGroupId));
        const approver = selectedApprovalGroup?.approver.filter(group => group.name);
        setLabelValues({ ...labelValues,
          sApplicationDate: application.sApplicationDate,
          sStartDate: application.sStartDate,
          sStartTime: application.sStartTime,
          sEndTime: application.sEndTime,
          sClassification: application.sClassification,
          sType: application.sType,
          sAction : application.sAction,
          lastTimeComment: application.comment && application.action == 4 ? application.comment : '',
        });
        setInputValues({ ...inputValues,
          currentDate: startDate,
          startEndDate: startDate.toLocaleDateString('jp'),
          startTime: `${startDate.getHours()}:${startDate.getMinutes()}:00`,
          endTime: `${endDate.getHours()}:${endDate.getMinutes()}:00`,
          totalTime: application.totalTime,
          classification: application.classification,
          type: application.type,
          applicationUserName: application.applicationUserName,
          approvalGroup: {
            id: selectedApprovalGroup && selectedApprovalGroup.groupId ? selectedApprovalGroup.groupId.toString() : '',
            name: selectedApprovalGroup ? selectedApprovalGroup.groupName : '',
            users: approver ? approver : [],
          },
          comment: application.comment && application.action != 4 ? application.comment : '',
          approvalComment: approvalTaks?.comment ? approvalTaks.comment : ''
        });
  
        setApprovalEnabled(approvalTaks?.action == 1);
      } else {
        const startDate = selectDate ? new Date(selectDate) : today;
        setInputValues({ ...inputValues,
          type: '0',
          classification: '0',
          startEndDate: startDate.toLocaleDateString('ja-JP'),
          currentDate: startDate,
          startTime: `09:00:00`,
          endTime: `18:00:00`,
        });
      }
    })()
  }, [application])

  const handleOnChange = (e: any) => {
    let targetValue = e.target.value;
    if(e.target.name === 'approvalGroup') {
      inputError.approvalGroup = '';

      const selectedApprovalGroup: GetApprovalGroupListResponse | undefined = getApprovalGroupListResponse.find((w: GetApprovalGroupListResponse) => w.groupId === Number(targetValue));
      if(selectedApprovalGroup) {
        const approver = selectedApprovalGroup.approver.filter(group => group.name);
        targetValue = {
          id: selectedApprovalGroup.groupId,
          name: selectedApprovalGroup.groupName,
          users: approver
        }
      }
    }

    if(e.target.name === 'classification') {
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
    setInputValues({ ...inputValues, [name]: date.toLocaleTimeString('ja-JP')});
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
      ['approvalGroup']: !inputValues.approvalGroup.id ? '承認グループを選択してください。' : '',
    });

    if(!inputValues.startEndDate || !inputValues.comment || !inputValues.approvalGroup.id) {
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
      approvalGroupId: Number(inputValues.approvalGroup.id),
      action: action,
    }

    await saveApplication(request).then(async(res) => {
      // 通知情報の更新
      await getNotification().then((res) => {
        setCommonObject({
          errorMessage: getCommonObject().errorMessage,
          actionRequiredApplicationCount: res.actionRequiredApplicationCount,
          approvalTaskCount: res.approvalTaskCount,
          activeApplicationCount: res.activeApplicationCount,
        })
      }).catch(async(error) => {
        throw error
      })

      router.push('/application/list', {scroll: true});
    }).catch(async(err) => {
      setCommonObject({
        errorMessage: err.message,
        actionRequiredApplicationCount: getCommonObject().actionRequiredApplicationCount,
        approvalTaskCount: getCommonObject().approvalTaskCount,
        activeApplicationCount: getCommonObject().activeApplicationCount,
      })
    })
  };

  /**
   * 削除ボタン押下
   */
  const onDelete = async() => {
    const request: DeleteApplicationRequest = {
      id: application?.id,
    }

    const res = await deleteApplication(request);
    if(res) {
      router.push('/application/list', {scroll: true});
    }
  };

  /**
   * 取消ボタン押下
   */
  const onCancel = async() => {
    setInputError({ ...inputError,
      ['approvalComment']: !inputValues.approvalComment ? '承認者コメントは必須入力です。' : '',
    });

    if(!inputValues.approvalComment) {
      return;
    }

    const request: CancelApplicationRequest = {
      applicationId: application?.id,
      comment: inputValues.approvalComment,
    }

    await cancelApplication(request).then(async(res) => {
      setCommonObject({
        errorMessage: getCommonObject().errorMessage,
        actionRequiredApplicationCount: getCommonObject().actionRequiredApplicationCount,
        approvalTaskCount: getCommonObject().approvalTaskCount,
        activeApplicationCount: getCommonObject().activeApplicationCount,
      })

      router.push('/admin/application/list', {scroll: true});

      // 通知情報の更新
      await getNotification().then((res) => {
        setCommonObject({
          errorMessage: getCommonObject().errorMessage,
          actionRequiredApplicationCount: res.actionRequiredApplicationCount,
          approvalTaskCount: res.approvalTaskCount,
          activeApplicationCount: res.activeApplicationCount,
        })
      })
    }).catch(async(err) => {
      setCommonObject({
        errorMessage: err.message,
        actionRequiredApplicationCount: getCommonObject().actionRequiredApplicationCount,
        approvalTaskCount: getCommonObject().approvalTaskCount,
        activeApplicationCount: getCommonObject().activeApplicationCount,
      })
    })
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
      application_id: application?.id,
      task_id: approvalId,
      comment: inputValues.approvalComment,
      action: action,
    }

    await approve(request).then(async(res) => {
      setCommonObject({
        errorMessage: getCommonObject().errorMessage,
        actionRequiredApplicationCount: getCommonObject().actionRequiredApplicationCount,
        approvalTaskCount: getCommonObject().approvalTaskCount,
        activeApplicationCount: getCommonObject().activeApplicationCount,
      })

      router.push('/approval/list', {scroll: true});

      // 通知情報の更新
      await getNotification().then((res) => {
        setCommonObject({
          errorMessage: getCommonObject().errorMessage,
          actionRequiredApplicationCount: res.actionRequiredApplicationCount,
          approvalTaskCount: res.approvalTaskCount,
          activeApplicationCount: res.activeApplicationCount,
        })
      })
    }).catch(async(err) => {
      setCommonObject({
        errorMessage: err.message,
        actionRequiredApplicationCount: getCommonObject().actionRequiredApplicationCount,
        approvalTaskCount: getCommonObject().approvalTaskCount,
        activeApplicationCount: getCommonObject().activeApplicationCount,
      })
    })
  };

  return (
    <>
      {/* 状況 */}
      <div className="row align-items-center mb-3 g-3">
        <div className="row align-items-center mb-3 g-3" hidden={!application}>
          <div className="col-md-2">
            <label className="col-form-label fw-medium">ステータス</label>
          </div>
          <div className="col ps-3">
            <p className="mb-0">{labelValues.sAction}</p>
          </div>
        </div>
        {/* 申請日 */}
        <div className="row align-items-center mb-3 g-3" hidden={!isAdmin && !approvalId && applicationEditEnabled}>
          <div className="col-md-2">
            <label className="col-form-label fw-medium">申請日</label>
          </div>
          <div className="col ps-3">
            <p className="mb-0">{labelValues.sApplicationDate}</p>
          </div>
        </div>
        {/* 申請者　申請管理のみ表示 */}
        <div className="row align-items-center mb-3 g-3" hidden={!isAdmin}>
          <div className="col-md-2">
            <label className="col-form-label fw-medium">申請者</label>
          </div>
          <div className="col ps-3">
            <p className="mb-0">{inputValues.applicationUserName}</p>
          </div>
        </div>
        {/* 申請者　申請種類 */}
        <div className="col-md-2">
          <label className="col-form-label fw-medium" htmlFor="type">申請種類</label>
        </div>
        <div className="col-8 col-md-5" hidden={!applicationEditEnabled}>
          <select className="form-select" id="type" value={inputValues.type} name="type" onChange={(e) => handleOnChange(e)}>
            <option value="0">年次有給休暇申請</option>
            <option value="1">休暇申請</option>
          </select>
        </div>
        <div className="col ps-3" hidden={applicationEditEnabled}>
          <p className="mb-0">{labelValues.sType}</p>
        </div>
      </div>
      {/* 区分 */}
      <div className="row align-items-center mb-3 g-3">
        <div className="col-md-2">
          <label className="col-form-label fw-medium" htmlFor="classification">区分</label>
        </div>
        <div className="col-8 col-md-5" hidden={!applicationEditEnabled}>
          <select className="form-select" id="classification" value={inputValues.classification} name="classification" onChange={(e) => handleOnChange(e)}>
            <option value="0">全日</option>
            <option value="1">AM半休</option>
            <option value="2">PM半休</option>
            <option value="3">時間単位</option>
          </select>
        </div>
        <div className="col ps-3" hidden={applicationEditEnabled}>
          <p className="mb-0">
            <span className="me-3">{labelValues.sClassification}</span>
            <span hidden={inputValues.classification != '3'}>{inputValues.totalTime}時間</span>
          </p>
        </div>
      </div>

      {/* 取得日　申請のみ表示 */}
      <div className="row align-items-center mb-3 g-3" hidden={!applicationEditEnabled}>
        <div className="col-md-2">
          <label className="col-form-label fw-medium" htmlFor="startEndDate">取得日</label>
        </div>
        <div className="col-5">
          <Flatpickr className="form-select" id="startEndDate" options={dateOption}
            value={inputValues.currentDate} name="startEndDate" onChange={([date]: any) => handleOnDateChange(date, "startEndDate")} />
          <p className="input_error">{inputError.startEndDate}</p>
        </div>
      </div>
      {/* 取得時間　申請のみ表示 */}
      <div className="row align-items-center mb-3 g-3" hidden={!applicationEditEnabled}>
        <div className="col-md-2">
          <label className="col-form-label fw-medium" htmlFor="startDate">取得時間</label>
        </div>
        <div className="col-2">
          <Flatpickr className="form-select" id="startDate" options={timeOption}
            value={inputValues.startTime} name="startTime" onChange={([date]: any) => handleOnStartEndTimeChange(date, "startTime")} />
        </div>
        <div className="col-1 text-center">
          <span>～</span>
        </div>
        <div className="col-2">
          <Flatpickr className="form-select" id="endDate" options={timeOption}
            value={inputValues.endTime} name="endTime" onChange={([date]: any) => handleOnStartEndTimeChange(date, "endTime")} />
        </div>
        <div className="col-auto ps-2" hidden={!applicationEditEnabled}>
          <select className="form-select" id="totalTime" value={inputValues.totalTime} name="totalTime" onChange={(e) => handleOnChange(e)} disabled={inputValues.classification != '3'}>
            {
              ["1", "2", "3", "4", "5", "6", "7", "8"].map((num: any, index: number) => (
                <option value={num} key={index}>{num}時間</option>
              ))
            }
          </select>
        </div>
      </div>

      {/* 取得日時 */}
      <div className="row align-items-center mb-3 g-3" hidden={applicationEditEnabled}>
        <div className="col-md-2">
          <label className="col-form-label fw-medium">取得日時</label>
        </div>
        <div className="col ps-3">
          <p className="mb-0">
              <span className="me-3">{labelValues.sStartDate}</span>
              <span>{labelValues.sStartTime} ～ {labelValues.sEndTime}</span>
            </p>
        </div>
      </div>

      {/* 前回申請理由 */}
      <div className="row mb-3 g-3" hidden={!labelValues.lastTimeComment}>
        <div className="col-md-2">
          <label className="col-form-label fw-medium">前回申請コメント</label>
        </div>
        <div className="col ps-3">
          <p className="mb-0 lastTimeComment">{labelValues.lastTimeComment}</p>
        </div>
      </div>

      {/* 申請コメント */}
      <div className="row mb-3 g-3">
        <div className="col-md-2">
          <label className="col-form-label fw-medium" htmlFor="comment">申請コメント</label>
        </div>
        <div className="col-12 ps-3 pe-3" hidden={!applicationEditEnabled}>
          <textarea className="form-control non-resize" id="comment" rows={5} placeholder="コメントを入力してください。"
            value={inputValues.comment} name="comment" onChange={(e) => handleOnChange(e)}></textarea>
          <p className="input_error">{inputError.comment}</p>
        </div>
        <div className="col ps-3" hidden={applicationEditEnabled}>
          <p className="mb-0 comment">{inputValues.comment}</p>
        </div>
      </div>

      {/* 承認者コメント */}
      <div className="row mb-3 g-3" hidden={!approvalId && !applicationCancelEnabled}>
        <div className="col-md-2">
          <label className="col-form-label fw-medium" htmlFor="approvalComment">承認者コメント</label>
        </div>
        <div className="col-12 ps-3 pe-3" hidden={!approvalEnabled && !applicationCancelEnabled}>
          <textarea className="form-control non-resize" id="approvalComment" rows={5} placeholder="コメントを入力してください。"
            value={inputValues.approvalComment} name="approvalComment" onChange={(e) => handleOnChange(e)}></textarea>
          <p className="input_error">{inputError.approvalComment}</p>
        </div>
        <div className="col ps-3" hidden={approvalEnabled || applicationCancelEnabled}>
          <p className="mb-0 comment">{inputValues.approvalComment}</p>
        </div>
      </div>

      {/* 承認グループ */}
      <div className="row align-items-center mb-3 g-3">
        <div className="col-md-2">
          <label className="col-form-label fw-medium" htmlFor="approvalGroup">承認グループ</label>
        </div>
        <div className="col-5 ps-3 pe-3" hidden={!applicationEditEnabled}>
          <select className="form-select" id="approvalGroup" value={inputValues.approvalGroup.id} name="approvalGroup" onChange={(e) => handleOnChange(e)} disabled={!draftApplicationOnlyEditEnabled}>
            <option value=''>未選択</option>
            {
              getApprovalGroupListResponse.map((approvalGroup: any, index: number) => (
                <option value={approvalGroup.groupId} key={index}>{approvalGroup.groupName}</option>
              ))
            }
          </select>
          <p className="input_error">{inputError.approvalGroup}</p>
        </div>
        <div className="col ps-3 pe-3" hidden={applicationEditEnabled}>
            <p className="mb-0">{inputValues.approvalGroup.name}</p>
        </div>
      </div>
      {/* 承認グループ 詳細表示 */}
      <div className="row align-items-center g-3 ps-3 pe-3" hidden={!inputValues.approvalGroup.id}>
        <ol className="list-group list-group-numbered col-md-10 offset-md-2">
          {
            inputValues.approvalGroup.users?.map((user: any, index: number) => (
              <li className="list-group-item" key={index}>{user.name}</li>
            ))
          }
        </ol>
      </div>

      {/* 申請操作ボタン */}
      <div className="row col-12 mt-4">
        <div className="col-1 text-start"></div>
        <div className="col text-end">
          <button className="btn btn-outline-danger" onClick={() => onCancel()} hidden={!applicationCancelEnabled}>取消</button>
          <button className="btn btn-outline-danger" onClick={() => onDelete()} hidden={!application || !draftApplicationOnlyEditEnabled}>削除</button>
          <button className="btn btn-outline-primary ms-5 me-3" onClick={() => onSave('0')} hidden={!draftApplicationOnlyEditEnabled}>保存</button>
          <button className="btn btn-outline-success me-3" onClick={() => onSave('1')} hidden={!applicationEditEnabled || isAdmin}>申請</button>
        </div>
      </div>
      {/* 承認操作ボタン */}
      <div className="row col-12 mt-4" hidden={!approvalEnabled}>
        <div className="col-1 text-start"></div>
        <div className="col text-end">
          <button className="btn btn-outline-danger me-5" onClick={() => onSubmit('4')}>却下</button>
          <button className="btn btn-outline-success me-3" onClick={() => onSubmit('2')}>承認</button>
        </div>
      </div>
    </>
  )
};
