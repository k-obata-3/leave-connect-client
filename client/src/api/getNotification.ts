import { axiosClient } from "@/axiosClient";

export type GetNotificationResponse = {
  actionRequiredApplicationCount: string,
  approvalTaskCount: string,
  activeApplicationCount: string,
}

export async function getNotification() {
  try {
    const response = await axiosClient.get(`/notification`);
    if(!response || !response.data || response.data.resultCode !== 200) {
      throw new Error("error");
    }

    return response.data.result as GetNotificationResponse;
  } catch (error: any) {
    throw error.response?.data?.result;
  }
}
