"use client"

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getUserDetails, getUserDetailsRequest, getUserDetailsResponse } from '@/api/getUserDetails';
import UserEditView from './userEditView';

export default function UserEdit() {
  const params = useParams();
  const [user, setUser] = useState<getUserDetailsResponse>();

  useEffect(() =>{
    if(!params || !params.id) {
      return;
    }

    (async() => {
      const req: getUserDetailsRequest = {
        id: params.id
      }
      const user: getUserDetailsResponse = await getUserDetails(req);
      setUser(user);
    })()
  },[])

  return (
    <div className="user-edit">
      {/* ページタイトル */}
      <div className="page-title">
        <h3>ユーザ編集</h3>
      </div>
      <div className="col-xl-10 offset-xl-1">
        <UserEditView id={user?.id} user={user}></UserEditView>
      </div>
    </div>
  );
};
