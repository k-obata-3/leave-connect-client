"use client"

import React, { useEffect, useState } from 'react';

import { useNotificationMessageStore } from '@/store/notificationMessageStore';
import usePageBack from '@/hooks/usePageBack';
import { pageCommonConst } from '@/consts/pageCommonConst';
import { getCareerItemMaster, GetCareerItemMasterRequest, GetCareerItemMasterResponse, CareerItemMaster } from '@/api/getCareerItemMaster';
import { saveCareerItemMaster, SaveCareerItemMasterRequest } from '@/api/saveCareerItemMaster';
import { deleteCareerItemMaster, DeleteCareerItemMasterRequest } from '@/api/deleteCareerItemMaster';


interface CareerItemSet {
  key: string,
  label: string,
  values: CareerItemMaster[],
}

export default function CareerSetting() {
  // 共通Store
  const { setNotificationMessageObject } = useNotificationMessageStore();
  // 戻るボタン カスタムフック
  const pageBack = usePageBack();
  const [editingItem, setEditingItem] = useState({
    editItemKey: '',
    editItemId: '',
    editItemText: '',
  });
  const [careerItemValues, setCareerItemValues] = useState<GetCareerItemMasterResponse>({
    modelList: [],
    osList: [],
    languageList: [],
    frameworkList: [],
    databaseList: [],
    toolList: [],
  });

  const CAREER_ITEM_SET: CareerItemSet[] = [
    { key: 'model', label: '機種', values: careerItemValues?.modelList },
    { key: 'os', label: 'OS', values: careerItemValues?.osList },
    { key: 'language', label: '言語', values: careerItemValues?.languageList },
    { key: 'framework', label: 'フレームワーク', values: careerItemValues?.frameworkList },
    { key: 'database', label: 'データベース', values: careerItemValues?.databaseList },
    { key: 'tool', label: 'ツール', values: careerItemValues?.toolList },
  ]

  useEffect(() =>{
    (async() => {
      resetEditingItem();
      await getCareerItem(null);
    })()
  },[])

  const getCareerItem = async(key: string | null) => {
    const req: GetCareerItemMasterRequest = {
      key: key,
    }
    const res: GetCareerItemMasterResponse = await getCareerItemMaster(req);
    if(res.responseResult) {
      setCareerItemValues({
        modelList: !key || key == 'model' ? res.modelList : careerItemValues?.modelList,
        osList: !key || key == 'os' ? res.osList : careerItemValues?.osList,
        languageList: !key || key == 'language' ? res.languageList : careerItemValues?.languageList,
        frameworkList: !key || key == 'framework' ? res.frameworkList : careerItemValues?.frameworkList,
        databaseList: !key || key == 'database' ? res.databaseList : careerItemValues?.databaseList,
        toolList: !key || key == 'tool' ? res.toolList : careerItemValues?.toolList,
      })
    } else {
      setNotificationMessageObject({
        errorMessageList: res.message ? [res.message] : [],
        inputErrorMessageList: [],
      })
    }
  }

  const handleEditItemOnChange = (e: any) => {
    setEditingItem({ ...editingItem, [e.target.name]: e.target.value })
  }

  const onEdit = (item: CareerItemMaster) => {
    setEditingItem({
      ...editingItem,
      editItemKey: item.key,
      editItemId: item.id,
      editItemText: item.value
    })
  }

  const onSave = async() => {
    if(!editingItem.editItemKey || !editingItem.editItemText.trim()) {
      return;
    }

    const req: SaveCareerItemMasterRequest = {
      key: editingItem.editItemKey,
      id: editingItem.editItemId ? editingItem.editItemId : null,
      value: editingItem.editItemText.trim(),
    }

    const res = await saveCareerItemMaster(req);
    if(res.responseResult) {
      resetEditingItem();
      getCareerItem(req.key);
    } else {
      setNotificationMessageObject({
        errorMessageList: res.message ? [res.message] : [],
        inputErrorMessageList: [],
      })
    }
  }

  const onDelete = async(item: CareerItemMaster) => {
    const req: DeleteCareerItemMasterRequest = {
      id: item.id
    }

    const res = await deleteCareerItemMaster(req);
    if(res.responseResult) {
      resetEditingItem();
      getCareerItem(item.key);
    } else {
      setNotificationMessageObject({
        errorMessageList: res.message ? [res.message] : [],
        inputErrorMessageList: [],
      })
    }
  }

  const resetEditingItem = () => {
    setEditingItem({
      ...editingItem,
      editItemKey: CAREER_ITEM_SET[0].key,
      editItemId: '',
      editItemText: ''
    })

    setNotificationMessageObject({
      errorMessageList: [],
      inputErrorMessageList: [],
    })
  }

  return (
    <div className="career-list-page">
      <div className="page-title pc-only">
        <h3>{pageCommonConst.pageName.careerSetting}</h3>
      </div>
      <div className="row">
        <div className="col-auto">
          <select className="form-select" id="editItemKey" value={editingItem.editItemKey} name="editItemKey" onChange={(e) => handleEditItemOnChange(e)} disabled ={!!editingItem.editItemId}>
            {
              CAREER_ITEM_SET.map((item: CareerItemSet, index: number) => {
                return <option value={item.key} key={index}>{item.label}</option>
              })
            }
          </select>
        </div>
        <div className="col col-xxl-4 col-md-6 ps-2 pe-2 pb-2">
          <input className="form-control" type="text" value={editingItem.editItemText} name="editItemText" id="editItemText" onChange={(e) => handleEditItemOnChange(e)} />
        </div>
        <div className="col-6 offset-6 col-md-auto offset-md-0 pb-2 pe-2 text-end">
          <button className="btn btn-outline-primary" onClick={onSave}>登録</button>
          <button className="btn btn-outline-secondary ms-2" onClick={() => resetEditingItem()} disabled={!editingItem.editItemId}>キャンセル</button>
        </div>
      </div>
      <div className="row">
        {
          CAREER_ITEM_SET.map((itemSet: CareerItemSet, index: number) => {
            return (
              <div className="col-12 col-xxl-4 col-md-6 mb-3 g-3 career-item-master-list" key={index}>
                <h6>{itemSet.label}({itemSet.values.length})</h6>
                <ul className="list-group text-center" hidden={!!itemSet.values.length}>
                  <li className="list-group-item list-group-item-secondary">未登録</li>
                </ul>
                <ul className="list-group" hidden={!itemSet.values.length}>
                  {
                    itemSet.values?.map((item: CareerItemMaster, i: number) => {
                      return (
                        <li className={item.id == editingItem.editItemId ? "list-group-item list-group-item-primary" : "list-group-item"} key={i}>
                          <div className="row">
                            <div className="col text-truncate mt-1">
                              <span>{item.value}</span>
                            </div>
                            <div className="col-auto align-self-end">
                              <button className="btn btn-outline-primary btn-sm" value={item.id} onClick={() => onEdit(item)} disabled={!!editingItem.editItemId}>編集</button>
                              <button className="btn btn-outline-danger btn-sm ms-1" value={item.id} onClick={() => onDelete(item)} disabled={!!editingItem.editItemId}>削除</button>
                            </div>
                          </div>
                        </li>
                      )
                    })
                  }
                </ul>
              </div>
            )
          })
        }
      </div>
    </div>
  );
};
