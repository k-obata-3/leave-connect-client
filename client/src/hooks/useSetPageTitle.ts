import { useContext } from 'react'
import SubHeaderContext from '@/contexts/subHeaderContext'

const useSetPageTitle = (): ((title: string) => void) => {
  const { setPageTitle } = useContext(SubHeaderContext)

  return setPageTitle
}

export default useSetPageTitle