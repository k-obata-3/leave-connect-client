import { createContext } from "react"

export default createContext(
  {} as {
    pageBack: () => Promise<void>
    setSubHeaderUserName: (firstName: string, lastName: string) => void
  }
)