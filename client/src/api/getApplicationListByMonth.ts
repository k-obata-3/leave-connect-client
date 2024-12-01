import { axiosGet, ApiResponse } from "@/axiosClient";

export interface GetApplicationListByMonthRequest {
  startStr: string,
  endStr: string,
}

export interface GetApplicationListByMonthResponse extends ApiResponse {
  applicationListByMonth: ApplicationListByMonth[]
}

export interface ApplicationListByMonth extends ApiResponse {
  id: number,
  applicationUserId: number,
  type: string,
  sType: string,
  action: number,
  sAction: string,
  classification: string,
  sClassification: string,
  startDate: string,
  sStartDate: string,
  sStartTime: string,
  endDate: string,
  sEndDate: string,
  sEndTime: string,
}

export async function getApplicationListByMonth(req: GetApplicationListByMonthRequest) {
  return await axiosGet(`/application/month?start=${req.startStr}&end=${req.endStr}`).then((res: ApiResponse) => {
    const applicationListByMonth: ApplicationListByMonth[] = res.result;
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      applicationListByMonth: applicationListByMonth,
    } as GetApplicationListByMonthResponse;
  })
}
