import { axiosGet, ApiResponse } from "@/axiosClient";

export interface GetApprovalTaskListRequest {
  searchUserId: string,
  searchAction: string,
  limit: number,
  offset: number,
}

export interface GetApprovalTaskListResponse extends ApiResponse {
  page: {
    total: number,
  },
  approvalList: Approval[],
}

export interface Approval {
  id: number,
  applicationId: number,
  type: number,
  sType: string,
  classification: number,
  sClassification: string,
  action: number,
  sAction: string,
  sApplicationDate: string,
  sStartDate: string,
  sStartTime: string,
  sEndDate: string,
  sEndTime: string,
  sStartEndTime: string,
  comment: string,
  applicationUserName: string,
}

export async function getApprovalTaskList(req: GetApprovalTaskListRequest) {
  return await axiosGet(`/approval/task/list?searchUserId=${req.searchUserId}&searchAction=${req.searchAction}&limit=${req.limit}&offset=${req.offset}`).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      page: {
        total: res.total,
      },
      approvalList: res.result,
    } as GetApprovalTaskListResponse;
  })
}
