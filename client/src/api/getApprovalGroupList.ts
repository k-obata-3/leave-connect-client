import { axiosGet, ApiResponse } from "@/axiosClient";

export interface GetApprovalGroupListResponse extends ApiResponse {
  approvalGroupList: ApprovalGroupObject[]
}

export interface Approver {
  id: string,
  name: string,
}

export interface ApprovalGroupObject {
  groupId: number | null,
  groupName: string,
  approver: Approver[],
}

export async function getApprovalGroupList() {
  return await axiosGet(`/systemConfig/approvalGroup/list`).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      approvalGroupList: res.result
    } as GetApprovalGroupListResponse;
  })
}
