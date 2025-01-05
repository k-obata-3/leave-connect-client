import { axiosGet, ApiResponse } from "@/axiosClient";

export interface getApplicationRequest {
  applicationId: string | null,
  taskId: string | null,
  isAdminFlow: boolean,
}

export interface getApplicationResponse extends ApiResponse {
  application: Application,
  approvalTtasks: ApprovalTtask[],
  availableOperation: AvailableOperation,
}

export interface Application {
  id: number,
  applicationUserId: number,
  applicationUserName: string,
  applicationDate: string,
  sApplicationDate: string,
  action: number,
  sAction: string,
  type: string,
  sType: string,
  classification: string,
  sClassification: string,
  startDate: string,
  sStartDate: string,
  sStartTime: string,
  endDate: string,
  sEndDate: string,
  sEndTime: string,
  totalTime: string,
  approvalGroupId: number,
  approvalGroupName: string,
  approvers: Approver[],
  comment: string,
  remarks: string,
}

export interface ApprovalTtask {
  id: number,
  action: number,
  sAction: string,
  type: number,
  status: number,
  userName: string,
  comment: string,
  operationDate: string,
}

export interface AvailableOperation {
  isEdit: boolean,
  isSave: boolean,
  isEditApprovalGroup: boolean,
  isApproval: boolean,
  isDelete: boolean,
  isCancel: boolean,
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

export async function getApplication(req: getApplicationRequest) {
  let url = `/application?isAdminFlow=${req.isAdminFlow}&applicationId=${req.applicationId}`;
  if(req.taskId) {
    url += `&taskId=${req.taskId}`;
  }
  return await axiosGet(url).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      application: res.result?.application,
      approvalTtasks: res.result?.approvalTtasks,
      availableOperation: res.result?.availableOperation,
    } as getApplicationResponse;
  })
}
