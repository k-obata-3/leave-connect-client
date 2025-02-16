"use client"

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'

import { pageCommonConst } from '@/consts/pageCommonConst';
import { confirmModalConst } from '@/consts/confirmModalConst';
import { outputSkillsheet, OutputSkillsheetRequest } from '@/api/outputSkillsheet';

export default function DownloadPage() {
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

    const req: OutputSkillsheetRequest = {
      userId: searchParams.get(pageCommonConst.param.userId)?.toString(),
    }
    const res = await outputSkillsheet(req);
    setDownloadComplete(true);
    if(res.responseResult) {
      const url = window.URL.createObjectURL(res.result.blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = res.result.fileName;
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } else {
      setDownloadErrorMessage(res.message ? res.message : "");
    }
  }

  return (
    <div className="custom-modal-overview modal-show">
      <div className="custom-modal-content col-12 col-md-8 offset-md-2">
        <h5 className="text-center">ダウンロード中...</h5>
        <p className="text-center text-danger">{downloadErrorMessage}</p>
        <div className="custom-modal-footer">
          <button className="btn btn-secondary col-auto col-md-5" onClick={() => window.close()} disabled={!downloadComplete}>{confirmModalConst.button.close}</button>
        </div>
      </div>
    </div>
  );
};
