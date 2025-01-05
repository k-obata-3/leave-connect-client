import { confirmModalConst } from "@/consts/confirmModalConst"

type Map = {
  key: string
  element: React.ReactNode
}

const IconMap: Map[] = [
  {
    key: 'confirm',
    element: (
      <>
        <i className="bi bi-question-circle-fill text-primary fs-4"></i>
      </>
    ),
  },
  {
    key: 'info',
    element: (
      <>
        <i className="bi bi-info-circle-fill text-info fs-4"></i>
      </>
    ),
  },
  {
    key: 'warn',
    element: (
      <>
        <i className="bi bi-exclamation-triangle-fill text-warning fs-4"></i>
      </>
    ),
  },
  {
    key: 'alert',
    element: (
      <>
        <i className="bi bi-exclamation-triangle-fill text-danger fs-4"></i>
      </>
    ),
  },
]

export const Confirm = ({
  title = confirmModalConst.label.confirm,
  children,
  onSubmit,
  confirmationText = confirmModalConst.button.ok,
  confirmationBtnColor = 'primary',
  onClose,
  cancellationText = confirmModalConst.button.cancel,
  onCancel,
  icon = 'confirm',
  alert = false,
}: {
  title?: string
  children: React.ReactNode
  onSubmit: (event: any) => void
  confirmationText?: string
  confirmationBtnColor?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning'
  onClose: (event: any) => void
  cancellationText?: string
  onCancel: (event: any) => void
  icon?: 'confirm' | 'info' | 'warn' | 'alert'
  alert?: boolean
}): JSX.Element => {
  const html = document.querySelector<HTMLElement>('html');
  const content = document.querySelector<HTMLElement>('body');
  if(html && content) {
    html.style.cssText += 'overflow: hidden !important;';
    content.style.cssText += 'overflow: hidden !important;';
  }
  const ModalIcon = () =>
    IconMap.filter((map: Map) => map.key === icon).map(
      (map: Map, key: number) => <span key={key}>{map.element}</span>
    )
  return (
    <div className="modal-overview modal-show">
      <div className="modal-content">
        <div className="card col-10 offset-1 col-lg-4 offset-lg-4">
          <div className="d-flex align-items-center ps-2 pe-2 mt-2">
            <div className="ms-2 me-1">{ModalIcon()}</div>
            <h5 className="mb-0 flex-grow-1">{title}</h5>
            <button className="btn btn-outline-default" onClick={onClose}><i className="bi bi-x-lg"></i></button>
          </div>
          <div className="card-body">
            <div className="card-text">{children}</div>
            <div className="row">
              <div className="col text-center mt-5">
                <button className="btn btn-secondary col-5" onClick={onCancel}>{cancellationText}</button>
                <button className={`btn btn-${confirmationBtnColor} col-5 ms-3`} onClick={onSubmit}>{confirmationText}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Confirm