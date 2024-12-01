import { axiosGet, ApiResponse } from "@/axiosClient";

export interface GetNotificationResponse extends ApiResponse {
  actionRequiredApplicationCount: string,
  approvalTaskCount: string,
  activeApplicationCount: string,
}

export async function getNotification() {
  return await axiosGet(`/notification`).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      actionRequiredApplicationCount: res.result?.actionRequiredApplicationCount,
      approvalTaskCount: res.result?.approvalTaskCount,
      activeApplicationCount: res.result?.activeApplicationCount,
    } as GetNotificationResponse;
  })
}
