import { ApiResponse, axiosGet } from "@/axiosClient";

export interface GetGrantDaysRequest {
  id: string | null,
}

export interface GetGrantDaysResponse extends ApiResponse {
  warnings: string[],
  validErrors: string[],
  grantDays: GrantDays[],
  referenceDate: string,
  totalService: string,
  lastGrantDate: string,
  periodStart: string,
  periodEnd: string,
}

export type GrantDays = {
  key: string,
  label: string,
  beforeValue: string,
  afterValue: string,
}

export async function getGrantDays(req: GetGrantDaysRequest) {
  return await axiosGet(`/user/grantDays?id=${req.id}`).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      result: res.result,
      warnings: res.result?.warnings,
      validErrors: res.result?.validErrors,
      grantDays: res.result?.grantDays,
      referenceDate: res.result?.referenceDate,
      totalService: res.result?.totalService,
      lastGrantDate: res.result?.lastGrantDate,
      periodStart: res.result?.periodStart,
      periodEnd: res.result?.periodEnd,
    } as GetGrantDaysResponse;
  })
}
