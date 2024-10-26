import { axiosClient } from "@/axiosClient";

export type ApproveRequest = {
  application_id: number | undefined,
  task_id: number | undefined,
  comment: string,
  action: string,
}

export type ApproveResponse = {

}

export async function approve(req: ApproveRequest) {
  try {
    const response = await axiosClient.post(`/approval/approve`, req);
    if(!response || !response.data || response.data.resultCode !== 200) {
      throw new Error("error");
    }

    return true;
  } catch (error: any) {
    throw error.response?.data?.result;
  }
}
