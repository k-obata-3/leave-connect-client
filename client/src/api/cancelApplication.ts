import { axiosClient } from "@/axiosClient";

export type CancelApplicationRequest = {
  applicationId: number | undefined,
  comment: string,
}

export type CancelApplicationResponse = {

}

export async function cancelApplication(req: CancelApplicationRequest) {
  try {
    const response = await axiosClient.post(`/application/cancel`, req);
    if(!response || !response.data || response.data.resultCode !== 200) {
      throw new Error("error");
    }

    return true;
  } catch (error: any) {
    throw error.response?.data?.result;
  }
}
