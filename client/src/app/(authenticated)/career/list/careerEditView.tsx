"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Flatpickr from 'react-flatpickr';
import { Japanese } from 'flatpickr/dist/l10n/ja.js';
import 'flatpickr/dist/flatpickr.min.css';
import "flatpickr/dist/themes/material_blue.css";

import { CareerSettingObject, useCareerSettingStore } from '@/store/careerSettingStore';
import useConfirm from '@/hooks/useConfirm';
import { pageCommonConst } from '@/consts/pageCommonConst';
import { confirmModalConst } from '@/consts/confirmModalConst';

import { useNotificationMessageStore } from '@/store/notificationMessageStore';
import { getCareer, GetCareerRequest, GetCareerResponse } from '@/api/getCareer';
import { saveCareer, SaveCareerRequest, SaveCareerResponse } from '@/api/saveCareer';
import { deleteCareer, DeleteCareerRequest, DeleteCareerResponse } from '@/api/deleteCareer';
import { getCareerItemMaster, GetCareerItemMasterRequest, GetCareerItemMasterResponse } from '@/api/getCareerItemMaster';


type Props = {
  careerId: string | null,
  isNew: boolean,
  onReload: () => void,
}

interface CareerItemInput {
  key: string,
  label: string,
  values: string[],
  dataList: string[],
}

export default function CareerEditView({ careerId, isNew, onReload }: Props) {
  const router = useRouter();

  // 共通Store
  const { setNotificationMessageObject } = useNotificationMessageStore();
  const { getInchargeObjectList, getRoleObjectList } = useCareerSettingStore();
  // モーダル表示 カスタムフック
  const confirm = useConfirm();

  let dateOption = {
    locale: Japanese,
    dateFormat: 'Y/m/d',
  };

  const [isLoadComplete, setIsLoadComplete] = useState(false);
  const [inputValues, setInputValues] = useState({
    projectName: '',
    overview: '',
    startDate: new Date().toLocaleDateString('ja-JP'),
    endDate: new Date().toLocaleDateString('ja-JP'),
    model: [''],
    os: [''],
    database: [''],
    language: [''],
    framework: [''],
    tool: [''],
    incharge: [''],
    role: [''],
    other:'',
  });

  const [inputError, setInputError] = useState({
    projectName: '',
    startDate: '',
    endDate: '',
  });

  const [dataList, setDataList] = useState({
    model: [''],
    os: [''],
    database: [''],
    language: [''],
    framework: [''],
    tool: [''],
  });

  const CAREER_ITEM_INPUT_SET: CareerItemInput[] = [
    { key: 'model', label: '機種', values: inputValues.model, dataList: dataList.model },
    { key: 'os', label: 'OS', values: inputValues.os, dataList: dataList.os },
    { key: 'language', label: '言語', values: inputValues.language, dataList: dataList.language },
    { key: 'framework', label: 'フレームワーク', values: inputValues.framework, dataList: dataList.framework },
    { key: 'database', label: 'データベース', values: inputValues.database, dataList: dataList.database },
    { key: 'tool', label: 'ツール', values: inputValues.tool, dataList: dataList.tool },
  ]

  useEffect(() =>{
    (async() => {
      const req: GetCareerItemMasterRequest = {
        key: null,
      }
      const res: GetCareerItemMasterResponse = await getCareerItemMaster(req);
      if(res.responseResult) {
        setDataList({
          model: res.modelList.map(item => item.value),
          os: res.osList.map(item => item.value),
          language: res.languageList.map(item => item.value),
          framework: res.frameworkList.map(item => item.value),
          database: res.databaseList.map(item => item.value),
          tool: res.toolList.map(item => item.value),
        })
      }
    })()
  },[])

  useEffect(() =>{
    (async() => {
      setInputValues({ ...inputValues,
        projectName: '',
        overview: '',
        startDate: new Date().toLocaleDateString('ja-JP'),
        endDate: new Date().toLocaleDateString('ja-JP'),
        model: new Array(5).fill(''),
        os: new Array(5).fill(''),
        database: new Array(5).fill(''),
        language: new Array(5).fill(''),
        framework: new Array(5).fill(''),
        tool: new Array(5).fill(''),
        incharge: [''],
        role: [''],
        other:'',
      })

      setInputError({ ...inputError,
        projectName: '',
        startDate: '',
        endDate: '',
      })

      if(isNew) {
        setIsLoadComplete(true);
      } else if(careerId) {
        getCareerInfo();
      }
    })()
  },[careerId, isNew])

  const getCareerInfo = async() => {
    const req: GetCareerRequest = {
      careerId: careerId!,
    }

    const res: GetCareerResponse = await getCareer(req);
    if(res.responseResult) {
      const utcStartDate = new Date(res.career.startDate)
      const utcEndDate = new Date(res.career.endDate)
      setInputValues({
        ...inputValues,
        projectName: res.career.projectName,
        overview: res.career.overview ? res.career.overview : '',
        startDate: new Date(utcStartDate.getUTCFullYear(), utcStartDate.getMonth(), utcStartDate.getDate()).toLocaleDateString('ja-JP'),
        endDate: new Date(utcEndDate.getUTCFullYear(), utcEndDate.getMonth(), utcEndDate.getDate()).toLocaleDateString('ja-JP'),
        model: new Array(5).fill('').map((_, i) => i < res.careerItem.model.length ? res.careerItem.model[i] : ''),
        os: new Array(5).fill('').map((_, i) => i < res.careerItem.os.length ? res.careerItem.os[i] : ''),
        database: new Array(5).fill('').map((_, i) => i < res.careerItem.database.length ? res.careerItem.database[i] : ''),
        language: new Array(5).fill('').map((_, i) => i < res.careerItem.language.length ? res.careerItem.language[i] : ''),
        framework: new Array(5).fill('').map((_, i) => i < res.careerItem.framework.length ? res.careerItem.framework[i] : ''),
        tool: new Array(5).fill('').map((_, i) => i < res.careerItem.tool.length ? res.careerItem.tool[i] : ''),
        incharge: res.careerItem.incharge,
        role: res.careerItem.role,
        other: res.careerItem.other ? res.careerItem.other : '',
      });
      setIsLoadComplete(true);
    } else {
      setNotificationMessageObject({
        errorMessageList: res.message ? [res.message] : [],
        inputErrorMessageList: [],
      })
    }
  }

  const handleOnChange = (e: any) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value});
  }

  const handleOnDateChange = (date: Date, name: any) => {
    if(date) {
      setInputValues({ ...inputValues, [name]: date.toLocaleDateString('ja-JP')});
    } else {
      setInputValues({ ...inputValues, [name]: ''});
    }
  }

  const onClearCareerItem = (inputs: string[], item: string, keyName: string) => {
    const newArray = inputs.filter(input => input !== item);
    setInputValues({ ...inputValues, [keyName]: newArray});
  }

  const onChangeCareerItemInput = (inputs: string[], e: any, index: number) => {
    inputs[index] = e.target.value;
    setInputValues({ ...inputValues, [e.target.name]: inputs});
  }

  const onChangeCareerItemCheckbox = (inputs: string[], e: any, index: number) => {
    if(inputs.includes(e.target.value)) {
      console.log(e.target.name)
      const newArray = inputs.filter(val => val != e.target.value);
      setInputValues({ ...inputValues, [e.target.name]: newArray});
    } else {
      inputs.push(e.target.value);
      setInputValues({ ...inputValues, [e.target.name]: inputs});
    }
  }

  const onDelete = async() => {
    if(!careerId) {
      return;
    }

    const cancel = await confirm({
      title: confirmModalConst.label.delete,
      icon: 'warn',
      confirmationText: confirmModalConst.button.delete,
      confirmationBtnColor: 'danger',
      description: confirmModalConst.message.deleteCareer,
    }).then(async() => {
      const request: DeleteCareerRequest = {
        careerId: careerId,
      }
      const res: DeleteCareerResponse = await deleteCareer(request);
      if(res.responseResult) {
        onReload();
        router.replace(pageCommonConst.path.careerList, {scroll: true});
      } else {
        setNotificationMessageObject({
          errorMessageList: res.message ? [res.message] : [],
          inputErrorMessageList: [],
        })
      }
    }).catch(() => {
      return true
    })

    if (cancel) {
    }
  }

  const onSave = async() => {


    const cancel = await confirm({
      description: confirmModalConst.message.saveCareer,
    }).then(async() => {
      const request: SaveCareerRequest = {
        careerId: careerId,
        user: null,
        projectName: inputValues.projectName,
        overview: inputValues.overview,
        startDate: inputValues.startDate,
        endDate: inputValues.endDate,
        model: inputValues.model,
        os: inputValues.os,
        database: inputValues.database,
        language: inputValues.language,
        framework: inputValues.framework,
        tool: inputValues.tool,
        incharge: inputValues.incharge,
        role: inputValues.role,
        other: inputValues.other ? [inputValues.other] : [],
      }
      const res: SaveCareerResponse = await saveCareer(request)
      if(res.responseResult) {
        onReload();
        router.replace(pageCommonConst.path.careerList, {scroll: true});
      } else {
        setNotificationMessageObject({
          errorMessageList: res.message ? [res.message] : [],
          inputErrorMessageList: [],
        })
      }
    }).catch(() => {
      return true
    })

    if (cancel) {
    }
  }

  return (
    <>
      <div className="row career-edit" hidden={!isLoadComplete}>
        <div className="col-xxl-6 ps-1 pe-1">
          <div className="operation-btn-parent-view">
            <div className="pc-only operation-btn-view-pc">
              <button className="btn btn-outline-danger" onClick={() => onDelete()} hidden={!careerId}>削除</button>
              <button className="btn btn-outline-primary ms-2" onClick={() => onSave()}>保存</button>
            </div>
            <div className="sp-only operation-btn-view-sp">
              <button className="btn btn-danger flex-grow-1 m-1" onClick={() => onDelete()} hidden={!careerId}>削除</button>
              <button className="btn btn-primary flex-grow-1 m-1 " onClick={() => onSave()}>保存</button>
            </div>
          </div>

          {/* 案件名 */}
          <div className="row mb-3 g-3">
            <div className="col-md-2">
              <label className="col-form-label fw-medium" htmlFor="projectName">案件名</label>
            </div>
            <div className="col-12 col-lg-7">
              <input className="form-control" type="text" value={inputValues.projectName} name="projectName" id="projectName" onChange={(e) => handleOnChange(e)} />
            </div>
          </div>
          {/* 概要 */}
          <div className="row mb-3 g-3">
            <div className="col-md-2">
              <label className="col-form-label fw-medium" htmlFor="overview">概要</label>
            </div>
            <div className="col-12 col-lg-7">
              <textarea className="form-control non-resize" id="overview" rows={2}
                value={inputValues.overview} name="overview" onChange={(e) => handleOnChange(e)}></textarea>
            </div>
          </div>
          {/* 開始日 */}
          <div className="row align-items-center mb-3 g-3">
            <div className="col-md-2">
              <label className="col-form-label fw-medium" htmlFor="startDate">開始日</label>
            </div>
            <div className="col-8 col-md-5">
              <Flatpickr className="form-select" id="startDate" options={dateOption}
                value={inputValues.startDate} name="startDate" onChange={([date]: any) => handleOnDateChange(date, "startDate")}/>
            </div>
          </div>
          {/* 終了日 */}
          <div className="row align-items-center mb-3 g-3">
            <div className="col-md-2">
              <label className="col-form-label fw-medium" htmlFor="endDate">終了日</label>
            </div>
            <div className="col-8 col-md-5">
              <Flatpickr className="form-select" id="endDate" options={dateOption}
                value={inputValues.endDate} name="endDate" onChange={([date]: any) => handleOnDateChange(date, "endDate")}/>
            </div>
          </div>
          {/* 作業担当 */}
          <div className="row align-items-centerg-3">
            <div className="col-12 col-lg-10">
              <label className="col-form-label fw-medium">作業担当</label>
            </div>
            <div className="col-12 col-lg-10">
              {
                getInchargeObjectList().map((incharge: CareerSettingObject, index: number) => {
                  return (
                    <div className="form-check-inline mb-3" key={index}>
                      <input type="checkbox" className="btn-check" value={incharge.value} id={incharge.key} name={'incharge'} autoComplete="off" checked={inputValues.incharge.includes(incharge.value)} onChange={(e) => onChangeCareerItemCheckbox(inputValues.incharge, e, index)}></input>
                      <label className="btn btn-outline-secondary btn-sm" htmlFor={incharge.key}>{incharge.name}</label>
                    </div>
                  )
                })
              }
            </div>
          </div>
          {/* 役割 */}
          <div className="row align-items-center g-3">
            <div className="col-12 col-lg-10">
              <label className="col-form-label fw-medium">役割</label>
            </div>
            <div className="col-lg-10">
              {
                getRoleObjectList().map((role: CareerSettingObject, index: number) => {
                  return (
                    <div className="form-check-inline mb-3" key={index}>
                      <input type="checkbox" className="btn-check" value={role.value} id={role.key} name={'role'} autoComplete="off" checked={inputValues.role.includes(role.value)} onChange={(e) => onChangeCareerItemCheckbox(inputValues.role, e, index)}></input>
                      <label className="btn btn-outline-secondary btn-sm" htmlFor={role.key}>{role.name}</label>
                    </div>
                  )
                })
              }
            </div>
          </div>
          {/* メモ */}
          <div className="row mb-3 g-3">
            <div className="col-12 col-lg-10">
              <label className="col-form-label fw-medium" htmlFor="other">メモ</label>
            </div>
            <div className="col-12 col-lg-10">
              <textarea className="form-control non-resize" id="other" rows={2}
                value={inputValues.other} name="other" onChange={(e) => handleOnChange(e)}></textarea>
            </div>
          </div>
        </div>
        {/* 機種/OS/言語/フレームワーク/データベース/ツール */}
        <div className="col ps-1 pe-1">
          {
            CAREER_ITEM_INPUT_SET.map((item: CareerItemInput, index) => {
              return (
                <div className="row mb-3 g-3" key={index}>
                  <div className="col-12">
                    <label className="col-form-label fw-medium">{item.label}</label>
                  </div>
                  <div className="row">
                    {
                      item.values.map((val: string, i: number) => {
                        return (
                          <div className="col-6 col-sm-4 col-md-3 col-lg pt-2 ps-1 pe-1" key={i}>
                            <input className="form-control" type="text" list={`datalist_${item.key}_${i}`} value={val} name={item.key} onChange={(e) => onChangeCareerItemInput(item.values, e, i)} autoComplete='false' />
                            <datalist id={`datalist_${item.key}_${i}`}>
                              {
                                item.dataList.map((val: string, dataListIndex: number) => {
                                  return (
                                    <option value={val} key={dataListIndex} />
                                  )
                                })
                              }
                            </datalist>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </>
  );
}