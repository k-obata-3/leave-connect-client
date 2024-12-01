import { axiosGet, ApiResponse } from "@/axiosClient";

export interface GetGrantRuleRequest {

}

export interface GetGrantRuleResponse extends ApiResponse {
  sectionMonth: string[],
  workingDays1: string[],
  workingDays2: string[],
  workingDays3: string[],
  workingDays4: string[],
  workingDays5: string[],
  workingDays6: string[],
}

export async function getGrantRule() {
  return await axiosGet(`/grantRule`).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      sectionMonth: res.result?.sectionMonth,
      workingDays1: res.result?.workingDays1,
      workingDays2: res.result?.workingDays2,
      workingDays3: res.result?.workingDays3,
      workingDays4: res.result?.workingDays4,
      workingDays5: res.result?.workingDays5,
      workingDays6: res.result?.workingDays6,
    } as GetGrantRuleResponse;
  })
}
