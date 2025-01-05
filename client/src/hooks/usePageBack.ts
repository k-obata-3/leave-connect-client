import { useContext } from 'react'
import SubHeaderContext from '@/contexts/subHeaderContext'

const usePageBack = (): ((isBack?: boolean) => Promise<void>) => {
  const { pageBack } = useContext(SubHeaderContext)

  return pageBack
}

export default usePageBack