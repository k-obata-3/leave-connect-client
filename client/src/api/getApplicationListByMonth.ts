import { axiosClient } from "@/axiosClient";

export type GetApplicationListByMonthRequest = {
  startStr: string,
  endStr: string,
}

export type GetApplicationListByMonthResponse = {
  id: number,
  applicationUserId: number,
  sType: string,
  sClassification: string,
  action: number,
  sAction: string,
  startDate: string,
  sStartDate: string,
  sStartTime: string,
  endDate: string,
  sEndDate: string,
  sEndTime: string,
}

export async function getApplicationListByMonth(req: GetApplicationListByMonthRequest) {
  try {
    const response = await axiosClient.get(`/application/month?start=${req.startStr}&end=${req.endStr}`);
    if(!response || !response.data || response.data.resultCode !== 200) {
      throw new Error("error");
    }

    return response.data.result as GetApplicationListByMonthResponse[];
  } catch (error: any) {
    throw error.response?.data?.result;
  }
}
