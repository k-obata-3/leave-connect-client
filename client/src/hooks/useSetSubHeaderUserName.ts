import { useContext } from 'react'
import SubHeaderContext from '@/contexts/subHeaderContext'

const useSetSubHeaderUserName = (): ((firstName: string, lastName: string) => void) => {
  const { setSubHeaderUserName } = useContext(SubHeaderContext)

  return setSubHeaderUserName
}

export default useSetSubHeaderUserName