import { axiosPost, ApiResponse } from "@/axiosClient";

export interface SaveApprovalGroupRequest {
  id: string | null,
  groupName: string,
  approval: string[],
}

export interface SaveApprovalGroupResponse extends ApiResponse {

}

export async function saveApprovalGroup(req: SaveApprovalGroupRequest) {
  return await axiosPost(`/systemConfig/approvalGroup/save`, req).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      result: res.result,
    } as SaveApprovalGroupResponse;
  })
}
