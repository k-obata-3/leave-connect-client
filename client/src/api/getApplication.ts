import { axiosClient } from "@/axiosClient";

export type getApplicationRequest = {
  id: string | string[],
}

export type getApplicationResponse = {
  id: number,
  action: number,
  applicationDate: string,
  applicationUserId: number,
  applicationUserName: string,
  classification: string,
  comment: string,
  endDate: string,
  sAction: string,
  sApplicationDate: string,
  sClassification: string,
  sEndDate: string,
  sEndTime: string,
  sStartDate: string,
  sStartTime: string,
  totalTime: string,
  sType: string,
  startDate: string,
  type: string,
  approvalGroupId: number,
  approvalTtasks: ApprovalTtasks[],
}

export type ApprovalTtasks = {
  id: number,
  action: number,
  sAction: string,
  type: number,
  comment: string,
  status: number,
  userName: string,
  updated: string,
}

export async function getApplication(req: getApplicationRequest) {
  try {
    const response = await axiosClient.get(`/application?id=${req.id}`);
    if(!response || !response.data || !response.data.result ||  response.data.resultCode !== 200) {
      throw new Error("error");
    }

    return response.data.result as getApplicationResponse;
  } catch (error: any) {
    throw error.response?.data?.result;
  }
}
