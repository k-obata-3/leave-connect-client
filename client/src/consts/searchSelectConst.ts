import { commonConst } from "./commonConst";

export interface SelectList {
  value: string,
  name: string,
}

export const searchSelectConst = {
  adminApplicationSelect: [
    { value: commonConst.actionValue.panding.toString(), name: '承認待ち'},
    { value: commonConst.actionValue.complete.toString(), name: '完了'},
    { value: commonConst.actionValue.reject.toString(), name: '差戻'},
    { value: commonConst.actionValue.cancel.toString(), name: '取消'},
  ] as SelectList[],
  applicationSelect: [
    { value: commonConst.actionValue.draft.toString(), name: '下書き'},
    { value: commonConst.actionValue.panding.toString(), name: '承認待ち'},
    { value: commonConst.actionValue.complete.toString(), name: '完了'},
    { value: commonConst.actionValue.reject.toString(), name: '差戻'},
    { value: commonConst.actionValue.cancel.toString(), name: '取消'},
  ] as SelectList[],
  approvalSelect: [
    { value: commonConst.actionValue.panding.toString(), name: '承認待ち'},
    { value: commonConst.actionValue.approval.toString(), name: '承認'},
    { value: commonConst.actionValue.reject.toString(), name: '差戻'},
  ] as SelectList[],
  label: {
    all: "すべて",
    action: "アクション",
    status: "ステータス",
    user: "申請者",
    year: "取得年",
  },
  button: {
  },
  message: {
  }
} as const
