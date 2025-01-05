"use client"

import React, { useEffect, useState } from 'react'

import { useUserNameListStore } from '@/store/userNameListStore';
import { useNotificationMessageStore } from '@/store/notificationMessageStore';
import useConfirm from '@/hooks/useConfirm';
import { confirmModalConst } from '@/consts/confirmModalConst';
import { UserNameObject } from '@/api/getUserNameList';
import { ApprovalGroupObject } from '@/api/getApprovalGroupList';
import { saveApprovalGroup, SaveApprovalGroupRequest, SaveApprovalGroupResponse } from '@/api/saveApprovalGroup';
import { deleteSystemConfig, DeleteSystemConfigRequest, DeleteSystemConfigResponse } from '@/api/deleteSystemConfig';

type Props = {
  approvalGroupList: ApprovalGroupObject[],
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

interface SelectUser {
  id: number,
  fullName: string,
  selected: boolean,
}

export default function ApprovalGroupView({ approvalGroupList, updateSystemConfigList }: Props) {
  const APPROVER_COL = ['approver1', 'approver2', 'approver3', 'approver4', 'approver5'];

  // 共通Store
  const { setNotificationMessageObject } = useNotificationMessageStore();
  const { getUserNameList } = useUserNameListStore();
  // モーダル表示 カスタムフック
  const confirm = useConfirm();

  const [userSelectList, setUserSelectList] = useState<SelectUser[]>([]);
  const [inputValues, setInputValues] = useState<ApprovalGroup[]>([]);
  const [edittingId, setEdittingId] = useState<string | null>(null);
  const [isNewCreate, setIsNewCreate] = useState(false);

  useEffect(() =>{
    resetApprovalGroupList();
  }, [approvalGroupList])

  /**
   * 一覧初期化
   */
  const resetApprovalGroupList = () => {
    setEdittingId(null);
    setIsNewCreate(false);
    setNotificationMessageObject({
      errorMessageList: [],
      inputErrorMessageList: [],
    })

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

    const userList: SelectUser[] = [];
    getUserNameList()?.forEach((res: UserNameObject) => {
      const user: SelectUser = {
        id: res.id,
        fullName: res.fullName,
        selected: false,
      }
      userList.push(user);
    });
    setUserSelectList(userList)
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
      const userName = selectedValue ? userSelectList.find((user: UserNameObject) => (user.id).toString() === selectedValue)?.fullName : '';
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
      userSelectList?.forEach((user: any) => {
        if(selectedUserIds.includes((user.id).toString())) {
          user.selected = true;
        } else {
          user.selected = false;
        }
      });
      setUserSelectList(userSelectList);
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

    userSelectList?.forEach((user: any) => {
      user.selected = false;
    });
    setUserSelectList(userSelectList);

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
    const selectedUserIds = Object.values(item.approver).map((v: any) => v.id);
    userSelectList?.forEach((user: any) => {
      if(selectedUserIds.includes((user.id).toString())) {
        user.selected = true;
      } else {
        user.selected = false;
      }
    });
    setUserSelectList(userSelectList);

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

    if(errors.length) {
      setNotificationMessageObject({
        errorMessageList: errors,
        inputErrorMessageList: [],
      })
      return;
    }

    const cancel = await confirm({
      description: confirmModalConst.message.saveApprovalGroup,
    }).then(async() => {
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
          setNotificationMessageObject({
            errorMessageList: res.message ? [res.message] : [],
            inputErrorMessageList: [],
          })
        }
      });
    }).catch(() => {
      return true
    })

    if (cancel) {
    }
  };

  /**
   * 削除
   * @param item 
   * @returns 
   */
  const onDelete = async(item: ApprovalGroup) => {
    if(!item.groupId) {
      return;
    }

    const cancel = await confirm({
      title: confirmModalConst.label.delete,
      icon: 'warn',
      confirmationBtnColor: 'danger',
      confirmationText: confirmModalConst.button.delete,
      description: confirmModalConst.message.deleteApprovalGroup,
    }).then(async() => {
      const req: DeleteSystemConfigRequest = {
        id: item.groupId!,
      }
  
      await deleteSystemConfig(req).then(async(res: DeleteSystemConfigResponse) => {
        if(res.responseResult) {
          updateSystemConfigList();
          resetState();
        } else {
          setNotificationMessageObject({
            errorMessageList: res.message ? [res.message] : [],
            inputErrorMessageList: [],
          })
        }
      });
    }).catch(() => {
      return true
    })

    if (cancel) {
    }
  };

  return (
    <>
      <div className="row">
        <div className="operation-btn-parent-view">
          <button className="btn btn-outline-primary" onClick={() => onNewCreate()} hidden={!!edittingId || isNewCreate}>新規作成</button>
          <div className="operation-btn-view-pc" hidden={!edittingId && !isNewCreate}>
            <button className="btn btn-outline-success ms-1 me-1" onClick={() => onSave()}>保存</button>
            <button className="btn btn-outline-secondary ms-1 me-1" onClick={() => onCancel()}>キャンセル</button>
          </div>
        </div>

        <p className="text-center" hidden={!!inputValues.length}>承認グループ設定なし</p>
        <div className="col mt-2" hidden={!!edittingId || !inputValues.length || !!isNewCreate}>
          <table className="table">
            <thead className="table-light">
              <tr className="text-center">
                <th scope="col" key="group_name">グループ名</th>
                <th scope="col" key="approver">承認者</th>
                <th scope="col" key="action"></th>
              </tr>
            </thead>
            <tbody>
              {
                inputValues?.map((item, index) => (
                  <tr key={index + 1} className="approval-list-tr">
                    <td>
                      <p>{item.groupName}</p>
                    </td>
                    <td>
                      <p>
                        {
                          APPROVER_COL.map((approverKey: string, approverIndex: number) => (
                            <span key={approverKey}>
                              <span className="ms-2 me-2" hidden={approverIndex < 1 || !item.approver[approverKey]?.id}>,</span>
                              <span>{item.approver[approverKey]?.name}</span>
                            </span>
                          ))
                        }
                      </p>
                    </td>
                    <td className="text-center" hidden={!!edittingId}>
                      <button className="btn btn-outline-warning btn-sm ms-1 me-1" onClick={() => onEdit(item)}>編集</button>
                      <button className="btn btn-outline-danger btn-sm ms-1 me-1" onClick={() => onDelete(item)} hidden={isNewCreate}>削除</button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        <div className="col-10 mt-5" hidden={!edittingId && !isNewCreate}>
          {
            inputValues.map((item: ApprovalGroup, index: number) => (
              <div key={index} hidden={item.groupId !== edittingId}>
                <p className="col-12 ps-2">
                  <label className="col-auto col-form-label" htmlFor={`${index}-groupName`}>グループ名</label>
                  <span className="col-12 d-block">
                    <input className="form-control" type="text" value={getApprovalGroupName()} name="groupName" id={`${index}-groupName`} onChange={(e) => handleOnChange(e)} hidden={edittingId !== item.groupId} />
                  </span>
                </p>
                <div>
                  {
                    APPROVER_COL.map((key: string, approverIndex: number) => (
                      <p className="col-12 ps-2 pe-2" key={approverIndex}>
                        <label className="col-auto col-form-label" htmlFor={`${index}-${key}-${approverIndex}`}>第{approverIndex + 1}承認者</label>
                        <span className="col">
                          <select className="form-select" id={`${index}-${key}-${approverIndex}`} name={key} value={getApproverValue(key)} onChange={(e) => handleApproverOnChange(e)}>
                            <option value=''>未選択</option>
                            {
                              userSelectList?.map((user: any, userIndex: number) => (
                                <option key={userIndex + 1} value={user.id} disabled={user.selected} >{user['fullName']}{user.selected}</option>
                              ))
                            }
                          </select>
                        </span>
                      </p>
                    ))
                  }
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </>
  )
};
