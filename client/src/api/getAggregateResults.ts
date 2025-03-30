import { ApiResponse, axiosGet } from "@/axiosClient";

export interface GetAggregateResultsRequest {
  userId: string,
}

export interface GetAggregateResultsResponse extends ApiResponse {
  warnings: string[],
  validErrors: string[],
  periods: Period[],
}

export type Period = {
  startDate: string,
  endDate: string,
  months: number,
  grantRuleAddDays: number,
  isGranted: boolean,
  isValid: boolean,
  acquisitionResults: AcquisitionResult[],
  isShow: boolean,
}

export interface AcquisitionResult {
  applicationId: string,
  acquisitionDate: string,
  weekday: string
  totalTime: number,
  action: number,
  actionName: string,
}

export async function getAggregateResults(req: GetAggregateResultsRequest) {
  return await axiosGet(`/application/aggregate?userId=${req.userId}`).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      result: res.result,
      periods: res.result?.periods,
    } as GetAggregateResultsResponse;
  })
}
