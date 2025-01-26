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
  const [apiErrors, setApiErrors] = useState<string[]>([]);

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
    }
  },[isShow])

  const createCareerHorizontalBar = (careerItemMap: CareerItemMap | undefined) => {
    const el: JSX.Element[] = []
    if(!careerItemMap) {
      return (
        <></>
      )
    } else {
      Object.entries(careerItemMap).forEach(([key, value], index) => {
        const period = value / user?.AffiliationPeriod! * 100;
        const width = period > 100 ? 100 : period;
        el.push(
          <div className="row mb-2" key={index}>
            <p className="mb-1">
              <span className="text-wrap">{key}</span>
            </p>
            <div className="text-end ms-2 pe-1 bg-primary-subtle" style={{ width: `${width}%` }}>
              <span className="text-nowrap">{Math.floor(value / 12 * 10) / 10}年</span>
            </div>
          </div>
        )
      })
    }

    return el;
  }

  const createCareerBadge = (careerItemMap: CareerItemMap | undefined) => {
    const el: JSX.Element[] = []
    if(!careerItemMap) {
      return (
        <></>
      )
    } else {
      Object.entries(careerItemMap).forEach(([key, value], index) => {
        el.push(
          <div className="career-item-badge text-wrap bg-primary-subtle" style={{maxWidth: '100%'}} key={index}>
            <span className="">{key}</span>
          </div>
        )
      })
    }

    return el;
  }

  return (
    <div className={isShow ? "custom-modal-overview modal-show" : "custom-modal-overview"}>
      <div className="custom-modal-content col-12 col-md-8 offset-md-2" hidden={!isShow}>
        <div className="custom-modal-header">
          <div className="me-1"><i className="bi bi-person-vcard fs-4 me-1"></i></div>
            <h5 className="flex-grow-1 m-0 text-truncate">{user?.fullName}</h5>
          <button className="btn btn-outline-default" onClick={() => callback(false)}><i className="bi bi-x-lg"></i></button>
        </div>
        <div className="custom-modal-content-body ps-2 pe-2 mt-2" hidden={!detail}>
          <div className="row d-flex align-items-center">
            <div className="col-12">
              <h6 className="border-bottom border-primary mt-2 ps-1 pb-2">言語</h6>
              <div className="ps-2 me-2">
                {createCareerHorizontalBar(detail?.careerLang)}
              </div>
            </div>
            <div className="col-12">
              <h6 className="border-bottom border-primary mt-4 ps-1 pb-2">データベース</h6>
              <div className="ps-2 me-2">
                {createCareerHorizontalBar(detail?.careerDb)}
              </div>
            </div>
            <div className="col-12">
              <h6 className="border-bottom border-primary mt-4 ps-1 pb-2">フレームワーク</h6>
              <div className="ps-2 me-2">
                {createCareerBadge(detail?.careerFramework)}
              </div>
            </div>
            <div className="col-12">
              <h6 className="border-bottom border-primary mt-4 ps-1 pb-2">ツール</h6>
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
