import { ApiResponse, axiosGet } from "@/axiosClient";

export interface GetGrantPeriodsRequest {
  userId: string | null,
}

export interface GetGrantPeriodsResponse extends ApiResponse {
  warnings: string[],
  validErrors: string[],
  periods: Period[],
}

export type Period = {
  startDate: string,
  endDate: string,
  acquisitionResults: AcquisitionResult[],
  isShow: boolean,
}

export interface AcquisitionResult {
  acquisitionDate: string,
  totalTime: number,
}

export async function getGrantPeriods(req: GetGrantPeriodsRequest) {
  return await axiosGet(`/user/grantPeriods?userId=${req.userId}`).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      result: res.result,
      periods: res.result?.periods,
    } as GetGrantPeriodsResponse;
  })
}
