import { ApiResponse, axiosGet } from "@/axiosClient";

export interface GetGrantDaysRequest {
  userId: string | null,
}

export interface GetGrantDaysResponse extends ApiResponse {
  grantPeriods: GrantPeriod[]
}

export type GrantPeriod = {
  startDate: string,
  endDate: string,
  months: number,
  totalYear: string,
  grantRuleAddDays: number,
  isGranted: boolean,
  isValid: boolean,
}

export async function getGrantDays(req: GetGrantDaysRequest) {
  return await axiosGet(`/user/grantDays?userId=${req.userId}`).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      grantPeriods: res.result?.grantPeriods,
    } as GetGrantDaysResponse;
  })
}
