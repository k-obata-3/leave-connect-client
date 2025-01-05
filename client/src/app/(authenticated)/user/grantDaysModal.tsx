"use client"

import { useEffect, useState } from "react";

import { getGrantDays, GetGrantDaysRequest, GetGrantDaysResponse, GrantDays } from "@/api/getGrantDays";
import { updateGrantDays, UpdateGrantDaysRequest, UpdateGrantDaysResponse } from "@/api/updateGrantDays";
import { confirmModalConst } from "@/consts/confirmModalConst";

type Props = {
  userId: string | null,
  isShow: boolean,
  callback: (reload: boolean) => void,
}

export default function GrantDaysModal({ userId, isShow, callback }: Props) {
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  const [grantDays, setGrantDays] = useState<GetGrantDaysResponse | null>();
  const [inputValues, setInputValues] = useState({
    totalDeleteDays: '0',
    totalRemainingDays: '0',
    totalCarryoverDays: '0',
    totalAddDays: '0'
  });

  useEffect(() =>{
    (async() => {
      if(!(userId && isShow)) {
        callback(false);
        return;
      }

      setApiErrors([]);
      setGrantDays(null);

      const request: GetGrantDaysRequest = {
        id: userId,
      }

      await getGrantDays(request).then(async(res: GetGrantDaysResponse) => {
        if(res.responseResult) {
          setGrantDays(res)
          setInputValues({...inputValues,
            totalDeleteDays: res.grantDays.find(val => val.key === 'totalDeleteDays')?.afterValue!,
            totalRemainingDays: res.grantDays.find(val => val.key === 'totalRemainingDays')?.afterValue!,
            totalCarryoverDays: res.grantDays.find(val => val.key === 'totalCarryoverDays')?.afterValue!,
            totalAddDays: res.grantDays.find(val => val.key === 'totalAddDays')?.afterValue!,
          })

        } else {
          setApiErrors(res.message ? [res.message] : [])
        }
      });
    })()
  },[isShow])

  const handleOnChange = (e: any) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value});
  }

  /**
   * 更新ボタン押下
   * @returns 
   */
  const onUpdateGrantDays = async() => {
    const regexp = /^([1-9]\d*|0)(\.\d+)?$/;
    const formatErrors = [
      !regexp.test(inputValues.totalDeleteDays) ? '取得日数の入力値が不正です。' : '',
      !regexp.test(inputValues.totalRemainingDays) ? '残日数の入力値が不正です。' : '',
      !regexp.test(inputValues.totalCarryoverDays) ? '繰越日数の入力値が不正です。' : '',
      !regexp.test(inputValues.totalAddDays) ? '付与日数の入力値が不正です。' : '',
    ];

    for (const value of Object.values(formatErrors)) {
      if(value.length) {
        setApiErrors(formatErrors);
        return;
      }
    }

    const request: UpdateGrantDaysRequest = {
      userId: userId,
      totalDeleteDays: inputValues.totalDeleteDays,
      totalRemainingDays: inputValues.totalRemainingDays,
      totalCarryoverDays: inputValues.totalCarryoverDays,
      totalAddDays: inputValues.totalAddDays,
    }

    await updateGrantDays(request).then(async(res: UpdateGrantDaysResponse) => {
      if(res.responseResult) {
        callback(true);
      } else {
        setApiErrors(res.message ? [res.message] : [])
      }
    });
  };

  return (
    <>
      <div className={isShow ? "modal-overview modal-show" : "modal-overview"}>
        <div className="modal-content" hidden={!isShow}>
          <div className="card col-10 offset-1 col-md-8 offset-md-2">
            <div className="d-flex align-items-center ps-2 pe-2 mt-2">
              <div className="ms-2 me-1"><i className="bi bi-question-circle-fill text-primary fs-4"></i></div>
              <h5 className="mb-0 flex-grow-1">{confirmModalConst.label.confirm}</h5>
              <button className="btn btn-outline-default" onClick={() => callback(false)}><i className="bi bi-x-lg"></i></button>
            </div>
            <div className="alert alert-danger pt-2 pb-2 mt-1 ms-3 me-3 mb-2" role="alert" hidden={!apiErrors.length}>
              {
                apiErrors.filter(msg => msg).map((msg, index) => {
                  return<p className="m-0" key={index}>{msg}</p>
                })
              }
            </div>
            <p className="card-text text-center">{confirmModalConst.message.updateGrantDays}</p>
            <div className="row" hidden={!(grantDays?.validErrors?.length || grantDays?.warnings?.length)}>
              {
                grantDays?.warnings?.filter(msg => msg).map((msg, index) => {
                  return <p className="text-danger col-10 offset-1 mb-0" key={index}>{msg}</p>
                })
              }
              {
                grantDays?.validErrors?.filter(msg => msg).map((msg, index) => {
                  return <p className="text-danger col-10 offset-1 mb-0" key={index}>{msg}</p>
                })
              }
            </div>
            <div className="d-flex align-items-center ps-2 pe-2 mt-2">
              <div className="card-body">
                <div className="row mb-1 pt-2">
                  <span className="col-12 col-md-3 offset-md-2 fw-medium pb-2">基準日</span>
                  <span className="col-11 offset-1 col-md-5 pb-2">{grantDays?.referenceDate}</span>
                </div>
                <div className="row mb-1 pt-2">
                  <span className="col-12 col-md-3 offset-md-2 fw-medium pb-2">継続勤続期間</span>
                  <span className="col-11 offset-1 col-md-5">{grantDays?.totalService ? grantDays?.totalService: '-'}</span>
                </div>
                <div className="row mb-1 pt-2">
                  <span className="col-12 col-md-3 offset-md-2 fw-medium pb-2">対象期間</span>
                  <span className="col-11 offset-1 col-md-5" hidden={!grantDays?.periodStart}>
                    <span>{grantDays?.periodStart}</span>
                    <span className="ms-1 me-1">～</span>
                    <span>{grantDays?.periodEnd}</span>
                  </span>
                  <span className="col-11 offset-1 col-md-5 pb-2" hidden={!!grantDays?.periodStart}>
                    <span>-</span>
                  </span>
                </div>
                <div className="row mb-1 pt-2">
                  <span className="col-12 col-md-3 offset-md-2 fw-medium pb-2">最終更新日</span>
                  <span className="col-11 offset-1 col-md-5 pb-2">{grantDays?.lastGrantDate ? grantDays?.lastGrantDate : '-'}</span>
                </div>
                {
                  grantDays?.grantDays.map((item: GrantDays, index: number) => {
                    return (
                      <div className="row mb-1" key={index}>
                        <span className="col-12 col-md-3 offset-md-2 fw-medium mt-2">{item.label}</span>
                        <span className="col-4 col-md-2 mt-2 ps-4">{item.beforeValue}</span>
                        <span className="col-3 col-md-1 mt-2"><i className="bi bi-arrow-right"></i></span>
                        <div className="col-4 col-md-2">
                          {
                            item.key === 'totalAddDays' ? (
                              <input className="form-control mb-1" type="text" value={inputValues.totalAddDays} name="totalAddDays" id="totalAddDays" onChange={(e) => {handleOnChange(e)}} />
                            ) : ''
                          }
                          {
                            item.key === 'totalCarryoverDays' ? (
                              <input className="form-control mb-1" type="text" value={inputValues.totalCarryoverDays} name="totalCarryoverDays" id="totalCarryoverDays" onChange={(e) => {handleOnChange(e)}} />
                            ) : ''
                          }
                          {
                            item.key === 'totalDeleteDays' ? (
                              <input className="form-control mb-1" type="text" value={inputValues.totalDeleteDays} name="totalDeleteDays" id="totalDeleteDays" onChange={(e) => {handleOnChange(e)}} />
                            ) : ''
                          }
                          {
                            item.key === 'totalRemainingDays' ? (
                              <input className="form-control mb-1" type="text" value={inputValues.totalRemainingDays} name="totalRemainingDays" id="totalRemainingDays" onChange={(e) => {handleOnChange(e)}} />
                            ) : ''
                          }
                        </div>
                      </div>
                    )
                  })
                }
                <div className="row">
                  <div className="col text-center mt-5">
                    <button className="btn btn-secondary col-auto col-md-5" onClick={() => callback(false)}>{confirmModalConst.button.cancel}</button>
                    <button className='btn btn-primary col-auto col-md-5 ms-3' onClick={onUpdateGrantDays} disabled={!!grantDays?.validErrors?.length}>{confirmModalConst.button.update}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
