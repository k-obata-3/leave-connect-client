import { axiosClient } from "@/axiosClient";

export type SaveApplicationRequest = {
  id: number | undefined,
  type: string,
  classification: string,
  startEndDate: string,
  startTime: string,
  endTime: string,
  totalTime: string,
  comment: string,
  approvalGroupId: number,
  action: string,
}

export type SaveApplicationResponse = {

}

export async function saveApplication(req: SaveApplicationRequest) {
  try {
    const response = await axiosClient.post(`/application/save`, req);
    if(!response || !response.data || response.data.resultCode !== 200) {
      throw new Error("error");
    }

    return true;
  } catch (error: any) {
    throw error.response?.data?.result;
  }
}
