import { useContext } from 'react'
import ConfirmContext from '@/contexts/confirmContext'
import { ModalOptions } from '@/contexts/confirmProvider'

const useConfirm = (): ((options: ModalOptions) => Promise<void>) => {
  const { confirm } = useContext(ConfirmContext)
  return confirm
}

export default useConfirm