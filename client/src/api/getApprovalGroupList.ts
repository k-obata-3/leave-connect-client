import { axiosClient } from "@/axiosClient";

export type GetApprovalGroupListResponse = {
  groupId: number | null,
  groupName: string,
  approver: Approver[],
}

export type Approver = {
  id: string,
  name: string,
}

export async function getApprovalGroupList() {
  try {
    const response = await axiosClient.get(`/systemConfig/approvalGroup`);
    if(!response || !response.data || response.data.resultCode !== 200) {
      throw new Error("error");
    }

    return response.data.result as GetApprovalGroupListResponse[];
  } catch (error: any) {
    throw error.response?.data?.result;
  }
}
