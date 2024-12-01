"use client"

import React, { useEffect, useState } from 'react'
import { getUserNameList, GetUserNameListResponse, UserNameObject } from '@/api/getUserNameList';
import { useCommonStore } from '@/app/store/CommonStore';
import { saveApprovalGroup, SaveApprovalGroupRequest, SaveApprovalGroupResponse } from '@/api/saveApprovalGroup';
import { deleteSystemConfig, DeleteSystemConfigRequest, DeleteSystemConfigResponse } from '@/api/deleteSystemConfig';
import { ApprovalGroupObject, GetApprovalGroupListResponse } from '@/api/getApprovalGroupList';

type Props = {
  approvalGroupList: ApprovalGroupObject[] | undefined,
  updateSystemConfigList: () => Promise<void>,
}

interface ApprovalGroup {
  groupId: string | null,
  groupName: string,
  approver: Approver,
}

interface Approver {
  [key: string]: {
    id: string | null,
    name: string | undefined,
  }
}

export default function ApprovalGroupView({approvalGroupList, updateSystemConfigList}: Props) {
  const APPROVER_COL = ['approver1', 'approver2', 'approver3', 'approver4', 'approver5'];

  // 共通Sore
  const { setCommonObject, getCommonObject } = useCommonStore();

  const [userNameList, setUserNameList] = useState<UserNameObject[]>([]);
  const [userSelectList, setUserSelectList] = useState<UserNameObject[]>([]);
  const [inputValues, setInputValues] = useState<ApprovalGroup[]>([]);
  const [inputError, setInputError] = useState<string[]>([]);
  const [edittingId, setEdittingId] = useState<string | null>(null);
  const [isNewCreate, setIsNewCreate] = useState(false);

  useEffect(() =>{
    (async() => {
      const userNameList: GetUserNameListResponse = await getUserNameList();
      setUserNameList(userNameList.userNameList);
      resetApprovalGroupList();
    })()
  }, [approvalGroupList])

  /**
   * 一覧初期化
   */
  const resetApprovalGroupList = () => {
    const list: ApprovalGroup[] = [];
    approvalGroupList?.forEach((res: ApprovalGroupObject) => {
      const group: ApprovalGroup = {
        groupId: res.groupId ? res.groupId.toString(): null,
        groupName: res.groupName,
        approver: {
          approver1: res.approver[0],
          approver2: res.approver[1],
          approver3: res.approver[2],
          approver4: res.approver[3],
          approver5: res.approver[4]
        }
      }
      list.push(group);
    });
    setInputValues(list);
    setInputError([]);
  }

  /**
   * 承認グループ名変更
   * @param e 
   */
  const handleOnChange = (e: any) => {
    const editItem = getSelectedApprovalGroup();
    if(editItem) {
      editItem.groupName = e.target.value;
      setInputValues(inputValues.map((item, index) => (item.groupId === editItem.groupId ? editItem : item)));
    }
  }

  /**
   * 承認者変更
   * @param e 
   */
  const handleApproverOnChange = (e: any) => {
    const editItem = getSelectedApprovalGroup();
    if(editItem) {
      const selectedValue = e.target.value ? (e.target.value).toString() : "";
      const userName = selectedValue ? userNameList.find((user: UserNameObject) => (user.id).toString() === selectedValue)?.fullName : '';
      editItem.approver[e.target.name].id = selectedValue;
      editItem.approver[e.target.name].name = userName;
      setInputValues(inputValues.map((item, index) => (item.groupId === editItem.groupId ? editItem : item)));
      createUserSelectList();
    }
  }

  /**
   * 承認グループ名取得
   * @returns 
   */
  const getApprovalGroupName = () => {
    const editItem = getSelectedApprovalGroup();
    return editItem?.groupName ? editItem?.groupName : '';
  }

  /**
   * 承認者ID取得
   * @param key 
   * @returns 
   */
  const getApproverValue = (key: string) => {
    return getSelectedApprovalGroup()?.approver?.[key]?.id ?? 0;
  }

  /**
   * 選択中の承認グループ情報取得
   * @returns 
   */
  const getSelectedApprovalGroup = () => {
    return inputValues.find((item: ApprovalGroup) => item.groupId === edittingId);
  }

  /**
   * 承認者プルダウン生成
   */
  const createUserSelectList = () => {
    const editItem = getSelectedApprovalGroup();
    if(editItem){
      const selectedUserIds = Object.values(editItem.approver).map((v: any) => v.id);
      userNameList.forEach((user: any) => {
        if(selectedUserIds.includes((user.id).toString())) {
          user.selected = true;
        } else {
          user.selected = false;
        }
      });
      setUserSelectList(userNameList);
    }
  }

  /**
   * 状態初期化
   */
  const resetState = () => {
    setEdittingId(null);
    setIsNewCreate(false);
  }

  /**
   * 新規作成
   */
  const onNewCreate = () => {
    let approvers: Approver = {}
    APPROVER_COL.forEach((col: string) => {
      approvers[col] = {
        id: null,
        name : '',
      }
    })

    setInputValues([
      ...inputValues,
      {
        groupId: null,
        groupName: '',
        approver: approvers
      }
    ]);

    if(userNameList){
      userNameList.forEach((user: any) => {
        user.selected = false;
      });
      setUserSelectList(userNameList);
    }

    setIsNewCreate(true);
  }

  /**
   * キャンセル
   */
  const onCancel = () => {
    resetApprovalGroupList();
    resetState();
  }

  /**
   * 編集
   * @param item 
   */
  const onEdit = (item: ApprovalGroup) => {
    if(userNameList){
      const selectedUserIds = Object.values(item.approver).map((v: any) => v.id);
      userNameList.forEach((user: any) => {
        if(selectedUserIds.includes((user.id).toString())) {
          user.selected = true;
        } else {
          user.selected = false;
        }
      });
      setUserSelectList(userNameList);
    }

    setEdittingId(item.groupId);
  }

  /**
   * 保存
   * @returns 
   */
  const onSave = async() => {
    const editItem = getSelectedApprovalGroup();
    if(!editItem) {
      return;
    }

    let errors: string[] = [];
    if(!editItem.groupName) {
      errors.push('グループ名は必須入力です。');
    }
    const selectedUserIds: (string | null)[] = Object.values(editItem.approver).filter((v: Approver[string]) => v.name).flatMap((v: Approver[string]) => v.id);
    if(selectedUserIds.length < 2) {
      errors.push('承認者を2名以上選択してください。');
    }
    setInputError(errors);

    if(errors.length) {
      return;
    }

    const req: SaveApprovalGroupRequest = {
      id: edittingId,
      groupName: editItem?.groupName,
      approval: selectedUserIds.filter(id => id !== null),
    }

    await saveApprovalGroup(req).then(async(res: SaveApprovalGroupResponse) => {
      if(res.responseResult) {
        updateSystemConfigList();
        resetState();
      } else {
        setCommonObject({
          errorMessage: res.message ? res.message : "",
          actionRequiredApplicationCount: getCommonObject().actionRequiredApplicationCount,
          approvalTaskCount: getCommonObject().approvalTaskCount,
          activeApplicationCount: getCommonObject().activeApplicationCount,
        })
      }
    });
  };

  /**
   * 削除
   * @returns 
   */
  const onDelete = async(item: ApprovalGroup) => {
    if(!item.groupId) {
      return;
    }

    const req: DeleteSystemConfigRequest = {
      id: item.groupId,
    }

    await deleteSystemConfig(req).then(async(res: DeleteSystemConfigResponse) => {
      if(res.responseResult) {
        updateSystemConfigList();
        resetState();
      } else {
        setCommonObject({
          errorMessage: res.message ? res.message : "",
          actionRequiredApplicationCount: getCommonObject().actionRequiredApplicationCount,
          approvalTaskCount: getCommonObject().approvalTaskCount,
          activeApplicationCount: getCommonObject().activeApplicationCount,
        })
      }
    });
  };

    return (
      <>
        <div className="d-flex justify-content-start mb-2">
          <button className="btn btn-outline-primary" onClick={() => onNewCreate()} disabled={edittingId !== null || isNewCreate}>新規作成</button>
        </div>
        <table className="table" hidden={!inputValues.length}>
          <thead className="table-light">
            <tr className="row text-center">
              <th className="col-9">グループ名/承認者</th>
              <th className="col-3"></th>
            </tr>
          </thead>
          <tbody>
            {
              inputValues.map((item: ApprovalGroup, index: number) => (
                <tr className="row" key={index + 1}>
                  <td className="col-9">
                    <p hidden={edittingId === item.groupId}>{item.groupName}</p>
                    <p className="ms-3 text-wrap" hidden={item.groupId == null || (edittingId !== null && edittingId === item.groupId)}>
                    {
                      APPROVER_COL.map((approverKey: string, approverIndex: number) => (
                          <span className="" key={approverKey}>
                            <span className="ms-2 me-2" hidden={approverIndex < 1 || !item.approver[approverKey]?.id}>,</span>
                            <span className="">{item.approver[approverKey]?.name}</span>
                          </span>
                      ))
                    }
                    </p>
                  </td>
                  <td className="col-3 d-flex align-items-center justify-content-center">
                    <button className="btn btn-outline-warning btn-sm ms-1 me-1" onClick={() => onEdit(item)} hidden={item.groupId === edittingId} disabled={edittingId !== null || isNewCreate}>編集</button>
                    <button className="btn btn-outline-danger btn-sm ms-1 me-1" onClick={() => onDelete(item)} hidden={item.groupId === edittingId} disabled={edittingId !== null || isNewCreate}>削除</button>
                    <button className="btn btn-outline-success btn-sm ms-1 me-1" onClick={() => onSave()} hidden={item.groupId !== edittingId}>保存</button>
                    <button className="btn btn-outline-secondary btn-sm ms-1 me-1" onClick={() => onCancel()} hidden={item.groupId !== edittingId}>キャンセル</button>
                  </td>
                  <td className="row justify-content-start" hidden={edittingId !== item.groupId}>
                    <p className="col-12 ps-2">
                      <label className="col-auto col-form-label" htmlFor={`${index}-groupName`}>グループ名</label>
                      <span className="col-12 col-xl-6 d-block">
                        <input className="form-control" type="text" value={getApprovalGroupName()} name="groupName" id={`${index}-groupName`} onChange={(e) => handleOnChange(e)} hidden={edittingId !== item.groupId} />
                      </span>
                    </p>
                    {
                      APPROVER_COL.map((key: string, approverIndex: number) => (
                        <p className="col-12 col-xl-2 ps-2 pe-2" key={approverIndex}>
                          <label className="col-auto col-form-label" htmlFor={`${index}-${key}-${approverIndex}`}>第{approverIndex + 1}承認者</label>
                          <span className="col">
                            <select className="form-select" id={`${index}-${key}-${approverIndex}`} name={key} value={getApproverValue(key)} onChange={(e) => handleApproverOnChange(e)}>
                              <option value=''>未選択</option>
                              {
                                userSelectList?.map((user: any, userIndex: number) => (
                                  <option key={userIndex + 1} value={user.id} hidden={user.selected}>{user['fullName']}</option>
                                ))
                              }
                            </select>
                          </span>
                        </p>
                      ))
                    }
                    <p className="ps-2 mt-2">
                      {
                        inputError.map((value: string, index: number) => {
                          return <span className="input_error d-block" key={index}>{value}</span>
                        })
                      }
                    </p>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
        <p className="text-center" hidden={!!inputValues.length}>承認グループ設定なし</p>
    </>
  )
};
