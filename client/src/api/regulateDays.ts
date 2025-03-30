import { axiosPost, ApiResponse } from "@/axiosClient";

export interface RegulateDaysRequest {
  // id: number | undefined,
  userId: string,
  // type: string,
  // classification: string,
  // startDate: string,
  // endDate: string,
  // startTime?: string,
  // endTime?: string,
  // totalTime: string,
  // comment: string,
  // approvalGroupId: number,
  // action: string,
  // remarks: string,
  regulateDate: string,
  timeHourUnitTotalTime: string,
  otherTotalTime: string,
}

export interface RegulateDaysResponse extends ApiResponse {

}

export async function regulateDays(req: RegulateDaysRequest) {
  return await axiosPost(`/application/regulateDays`, req).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      result: res.result,
    } as RegulateDaysResponse;
  })
}
