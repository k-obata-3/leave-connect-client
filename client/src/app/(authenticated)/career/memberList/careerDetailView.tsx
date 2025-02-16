"use client"

import { useEffect, useState } from "react";

import { confirmModalConst } from "@/consts/confirmModalConst";
import { CareerDictionary, CareerItemMap } from "@/api/getCareerDictionary";
import { CareerUser } from "@/api/getCareerUserList";

type Props = {
  isShow: boolean,
  user: CareerUser | null,
  detail: CareerDictionary | null,
  callback: (reload: boolean) => void,
}

export default function CareerDetailView({ isShow, user, detail, callback }: Props) {
  const [maxPeriod, setMaxPeriod] = useState<number>(0);

  useEffect(() =>{
    const modal = document.querySelector<HTMLElement>('.custom-modal-content');
    if(modal) {
      modal.scroll({
        top: 0,
        behavior: "instant",
      })
    }
    
    if(!isShow) {
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = "initial";
      callback(false);
      return;
    } else {
      const html = document.querySelector<HTMLElement>('html');
      const content = document.querySelector<HTMLElement>('body');
      if(html && content) {
        html.style.cssText += 'overflow: hidden !important;';
        content.style.cssText += 'overflow: hidden !important;';
      }

      const maxPeriodLang = Math.max(...Object.values(detail?.careerLang!));
      const maxPeriodDb = Math.max(...Object.values(detail?.careerDb!));
      setMaxPeriod(maxPeriodLang > maxPeriodDb ? maxPeriodLang : maxPeriodDb);
    }
  },[isShow])

  const createCareerHorizontalBar = (careerItemMap: CareerItemMap | undefined) => {
    if(careerItemMap) {
      if(!Object.entries(careerItemMap).length) {
        return(
          <span>未登録</span>
        )
      }

      const el: JSX.Element[] = []
      Object.entries(careerItemMap).forEach(([key, value], index) => {
        const period = value / maxPeriod! * 100;
        const width = period > 100 ? 100 : period;
        el.push(
          <div className="row mb-2" key={index}>
            <p className="mb-1">
              <span className="text-wrap">{key}</span>
            </p>
            <div className="text-end ms-2 pe-1 bg-primary-subtle bg-gradiente" style={{ width: `${width}%` }}>
              <span className="text-nowrap">{Math.floor(value / 12 * 10) / 10}年</span>
            </div>
          </div>
        )
      })

      return el;
    }

    return <></>;
  }

  const createCareerBadge = (careerItemMap: CareerItemMap | undefined) => {
    if(careerItemMap) {
      if(!Object.entries(careerItemMap).length) {
        return(
          <span>未登録</span>
        )
      }

      const el: JSX.Element[] = []
      Object.entries(careerItemMap).forEach(([key, value], index) => {
        el.push(
          <div className="career-item-badge text-wrap bg-primary-subtle" style={{maxWidth: '100%'}} key={index}>
            <span className="">{key}</span>
          </div>
        )
      })

      return el;
    }

    return <></>;
  }

  return (
    <div className={isShow ? "custom-modal-overview modal-show" : "custom-modal-overview"}>
      <div className="custom-modal-content col-12 col-md-8 offset-md-2" hidden={!isShow}>
        <div className="custom-modal-header">
          <div className="me-1"><i className="bi bi-person-vcard fs-4 me-1"></i></div>
          <h5 className="m-0 text-truncate">{user?.fullName}</h5>
          <h6 className="flex-grow-1 m-0 text-nowrap ps-2">{user?.joiningDate}<span className="ps-1"></span>入社</h6>
          <button className="btn btn-outline-default" onClick={() => callback(false)}><i className="bi bi-x-lg"></i></button>
        </div>
        <div className="custom-modal-content-body ps-2 pe-2 mt-2" hidden={!detail}>
          <div className="row d-flex align-items-center">
            <div className="col-12 pb-4">
              <h6 className="career-detail-title">言語</h6>
              <div className="ps-2 me-2">
                {createCareerHorizontalBar(detail?.careerLang)}
              </div>
            </div>
            <div className="col-12 pb-4">
              <h6 className="career-detail-title">データベース</h6>
              <div className="ps-2 me-2">
                {createCareerHorizontalBar(detail?.careerDb)}
              </div>
            </div>
            <div className="col-12 pb-4">
              <h6 className="career-detail-title">フレームワーク</h6>
              <div className="ps-2 me-2">
                {createCareerBadge(detail?.careerFramework)}
              </div>
            </div>
            <div className="col-12 pb-2">
              <h6 className="career-detail-title">ツール</h6>
              <div className="ps-2 me-2">
                {createCareerBadge(detail?.careerTool)}
              </div>
            </div>
          </div>
        </div>
        <div className="custom-modal-footer">
          <button className="btn btn-secondary col-auto col-md-5" onClick={() => callback(false)}>{confirmModalConst.button.close}</button>
        </div>
      </div>
    </div>
  )
};
