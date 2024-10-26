import { axiosClient } from "@/axiosClient";

export type GetApprovalTaskListRequest = {
  searchUserId: string,
  searchAction: string,
  limit: number,
  offset: number,
}

export type GetApprovalTaskListResponse = {
  page: {
    total: number,
  },
  approvalList: Approval[],
}

export type Approval = {
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
  try {
    const response = await axiosClient.get(`/approval/task/list?searchUserId=${req.searchUserId}&searchAction=${req.searchAction}&limit=${req.limit}&offset=${req.offset}`);
    if(!response || !response.data || response.data.resultCode !== 200) {
      throw new Error("error");
    }

    response.data.result.forEach((item: Approval) => {
      item.sStartEndTime = `${item.sStartTime} - ${item.sEndTime}`;
    });

    const res: GetApprovalTaskListResponse = {
      page: {
        total: response.data.total,
      },
      approvalList: response.data.result as Approval[],
    }

    return res;
  } catch (error: any) {
    throw error.response?.data?.result;
  }
}
