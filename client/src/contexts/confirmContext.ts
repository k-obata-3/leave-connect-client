import { createContext } from "react"
import { ModalOptions } from "./confirmProvider"

export default createContext(
  {} as {
    confirm: (options: ModalOptions) => Promise<void>
  }
)