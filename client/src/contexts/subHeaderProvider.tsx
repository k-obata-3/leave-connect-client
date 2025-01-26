import React, { useState, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import SubHeaderContext from './subHeaderContext'
import useConfirm from '@/hooks/useConfirm'
import { confirmModalConst } from '@/consts/confirmModalConst';
import { logout } from '@/api/logout'
import { pageCommonConst } from '@/consts/pageCommonConst';

export const SubHeaderProvider = ({
  children,
}: {
  children: React.ReactNode
}): JSX.Element => {
  const pathname = usePathname();

  const [enabledBack, setEnabledBack] = useState<boolean | undefined>(false)
  const [resolveReject, setResolveReject] = useState<any>([])
  const [resolve, reject] = resolveReject

  const router = useRouter();
  // モーダル表示 カスタムフック
  const confirm = useConfirm();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
  });
  const [title, setTitle] = useState('');

  const pageBack = useCallback((isBack?: boolean): Promise<void> => {
    return new Promise((resolve: never | any, reject: never | any) => {
      setEnabledBack(isBack);
      setResolveReject([resolve, reject])
    })
  }, [])

  const setSubHeaderUserName = useCallback((firstName: string, lastName: string) => {
    setUser({
      firstName: firstName,
      lastName: lastName,
    })
  }, [])

  const setPageTitle = useCallback((title: string) => {
    setTitle(title);
  }, [])

  const handleClose = useCallback(() => {
    setResolveReject([]);
  }, [])

  const handleBack = useCallback(() => {
    resolve();
    handleClose();
  }, [resolve, handleClose])

  const handleLogout = async() => {
    const cancel = await confirm({
      description: confirmModalConst.message.logout,
    }).then(async() => {
      const res = await logout();
      router.replace(pageCommonConst.path.login, {scroll: false});
    }).catch(() => {
      return true
    })
    if (cancel) {
    }
  };

  const createSubHeader = () => {
    return (
      <>
        <div className="row">
          <div className="col-1 text-start ms-2" style={{width: '2.5rem'}}>
            {enabledBack && resolveReject.length === 2 && (
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleBack}>
                <i className="bi bi-chevron-left"><span className=""></span></i>
              </button>
            )}
          </div>
          <div className="col-4 col-md-3 text-start page-title pc-only">
            <span>{title}</span>
          </div>
          <div className="col text-end ms-2 me-2 text-truncate">
            <i className="bi bi-person-circle me-2" onClick={() => router.push(pageCommonConst.path.settingUserEditPersonal)}></i>
            <span className="">{user.lastName + ' ' + user.firstName}</span>
          </div>
          <div className="col-auto text-end me-2 sp-only">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>
              <span className="">ログアウト</span>
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="sub-header pc-only">
        {createSubHeader()}
      </div>
      <div className="sub-header sub-header-sp sp-only">
        {createSubHeader()}
      </div>
      {/* <!-- プロバイダーでラップ --> */}
      <SubHeaderContext.Provider value={{ pageBack, setSubHeaderUserName, setPageTitle }}>
        {children}
      </SubHeaderContext.Provider>
    </>
  )
}