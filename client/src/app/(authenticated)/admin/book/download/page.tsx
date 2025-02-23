"use client"

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'

import { pageCommonConst } from '@/consts/pageCommonConst';
import { confirmModalConst } from '@/consts/confirmModalConst';
import { outputAggregate, OutputAggregateRequest } from '@/api/outputAggregate';

export default function ApplicationDownloadPage() {
  const searchParams = useSearchParams();
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [downloadErrorMessage, setDownloadErrorMessage] = useState("");

  useEffect(() =>{
    (async() => {
      await download();
    })()
  },[])

  const download = async() => {
    if(downloadComplete) {
      return;
    }

    const req: OutputAggregateRequest = {
      userId: searchParams.get(pageCommonConst.param.userId),
    }
    const res = await outputAggregate(req);
    if(res.responseResult) {
      setDownloadComplete(true);
      const url = window.URL.createObjectURL(res.result.blob);
      window.location.href = url;
      window.URL.revokeObjectURL(url);
    } else {
      setDownloadErrorMessage(res.message ? res.message : "");
    }
  }

  return (
    <div className="custom-modal-overview modal-show">
      <div className="custom-modal-content col-12 col-md-6 offset-md-6">
        <h5 className="text-center">{downloadComplete ? "ダウンロード完了" : "ダウンロード中..."}</h5>
        <p className="text-center text-danger">{downloadErrorMessage}</p>
        <div className="custom-modal-footer">
          <button className="btn btn-secondary col-auto col-md-5" onClick={() => window.close()} disabled={!(downloadComplete || downloadErrorMessage) }>{confirmModalConst.button.close}</button>
        </div>
      </div>
    </div>
  );
};
