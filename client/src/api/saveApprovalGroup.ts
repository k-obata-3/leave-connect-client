import { axiosClient } from "@/axiosClient";

export type SaveApprovalGroupRequest = {
  id: string | null,
  groupName: string,
  approval: string[],
}

export type SaveApprovalGroupResponse = {

}

export async function saveApprovalGroup(req: SaveApprovalGroupRequest) {
  try {
    const response = await axiosClient.post(`/systemConfig/save/approvalGroup`, req);
    if(!response || !response.data || response.data.resultCode !== 200) {
      throw new Error("error");
    }

    return true;
  } catch (error: any) {
    throw error.response?.data?.result;
  }
}
