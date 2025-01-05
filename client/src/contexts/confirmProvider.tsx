import React, { useState, useCallback } from 'react'
import ConfirmContext from './confirmContext'
import Confirm from '@/components/confirm'

export type ModalOptions = {
  html?: boolean
  alert?: boolean
  icon?: 'confirm' | 'info' | 'warn' | 'alert'
  title?: string
  description?: React.ReactNode
  confirmationText?: string
  confirmationBtnColor?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning'
  cancellationText?: string
}

// 確認モーダル オプション
const DEFAULT_OPTIONS: ModalOptions = {
  html: false,
  alert: false,
  title: '確認',
  description: '',
  confirmationText: 'OK',
  confirmationBtnColor: 'primary',
  cancellationText: 'キャンセル',
}

const buildOptions = (options: ModalOptions): ModalOptions => {
  return {
    ...DEFAULT_OPTIONS,
    ...options,
  }
}

export const ConfirmProvider = ({
  children,
}: {
  children: React.ReactNode
}): JSX.Element => {
  const [options, setOptions] = useState<ModalOptions>({ ...DEFAULT_OPTIONS })
  const [resolveReject, setResolveReject] = useState<any>([])
  const [resolve, reject] = resolveReject

  const confirm = useCallback((options: ModalOptions): Promise<void> => {
    return new Promise((resolve: never | any, reject: never | any) => {
      removeScrollLock();
      setOptions(buildOptions(options))
      setResolveReject([resolve, reject])
    })
  }, [])

  const handleClose = useCallback(() => {
    removeScrollLock();
    setResolveReject([]);
  }, [])

  const handleCancel = useCallback(() => {
    removeScrollLock();
    reject();
    handleClose();
  }, [reject, handleClose])

  const handleConfirm = useCallback(() => {
    removeScrollLock();
    resolve();
    handleClose();
  }, [resolve, handleClose])

  const removeScrollLock = () => {
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = "initial";
  }

  return (
    <>
      {resolveReject.length === 2 && (
        <>
          <Confirm {...options} onSubmit={handleConfirm} onClose={handleClose} onCancel={handleCancel}>
            {options.html ? (
              options.description
            ) : (
              <p className="text-sm text-center pt-2">
                {options.description}
              </p>
            )}
          </Confirm>
        </>
      )}
      <ConfirmContext.Provider value={{ confirm }}>
        {children}
      </ConfirmContext.Provider>
    </>
  )
}