"use client"

import React, { useState, useEffect } from 'react';
import { getUserDetails, getUserDetailsRequest, getUserDetailsResponse,  } from '@/api/getUserDetails';
import { useUserInfoStore } from '@/app/store/UserInfoStore';

export default function EditPersonal() {
  const { getUserInfo } = useUserInfoStore();
  const [values, setValues] = useState({
    userId: '',
    referenceDate: '',
  });

  const [inputValues, setInputValues] = useState({
    firstName: '',
    lastName: '',
  });

  const [inputError, setInputError] = useState({
    name: '',
  });

  const handleOnChange = (e: any) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value});
  }

  const onSave = (e: any) => {
    let nameError = '';
    if(!inputValues.lastName || !inputValues.firstName) {
      nameError = '名前は必須入力です。';
    }

    setInputError({
      name: nameError,
    })
  }

  useEffect(() =>{
    (async() => {
      await getUser(getUserInfo().id);
    })();
  },[])

  /**
   * ユーザ情報取得
   * @param id 
   */
  const getUser = async(id: string) => {
      const req: getUserDetailsRequest = {
        id: id
      }
      const user: getUserDetailsResponse = await getUserDetails(req);

      setInputValues({
        ...inputValues,
        firstName: user.firstName,
        lastName: user.lastName,
      })

      setValues({
        ...values,
        userId: user.userId,
        referenceDate: user.referenceDate,
      })
  }

  return (
    <>
      <div className="">
        <div className="row align-items-center mb-3 g-3">
          <div className="col-md-2">
            <label className="col-form-label fw-medium">ユーザID</label>
          </div>
          <div className="col-5 ps-3">
            <p>{values.userId}</p>
          </div>
        </div>

        <div className="row align-items-center mb-3 g-3">
          <div className="col-md-2">
            <label className="col-form-label fw-medium">基準日</label>
          </div>
          <div className="col-5 ps-3">
          <p>{values.referenceDate}</p>
          </div>
        </div>

        <div className="row align-items-center mb-3 g-3">
          <div className="col-md-2">
            <label className="col-form-label fw-medium" htmlFor="lastName">名前</label>
          </div>
          <div className="col-7 col-md-4 ps-3 mb-2">
            <input className="form-control" type="text" placeholder="姓" value={inputValues.lastName} name="lastName" id="lastName" onChange={(e) => handleOnChange(e)} />
          </div>
          <div className="col-7 col-md-4 ps-3 mb-2">
            <input className="form-control" type="text" placeholder="名" value={inputValues.firstName} name="firstName" id="firstName" onChange={(e) => handleOnChange(e)} />
          </div>
          <div className="col-12 offset-md-2 ps-3 mb-2">
            <p className="input_error">{inputError.name}</p>
          </div>
        </div>

        <div className="col-1 text-start"></div>
        <div className="col-11 text-end">
          <button className="btn btn-outline-success" onClick={(e) => onSave(e)}>保存</button>
        </div>
      </div>
    </>
  );

};
