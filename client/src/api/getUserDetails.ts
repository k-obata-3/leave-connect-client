import { axiosGet, ApiResponse } from "@/axiosClient";

export interface getUserDetailsRequest {
  id: string | string[],
}

export interface getUserDetailsResponse extends ApiResponse {
  id: number,
  userId: string,
  firstName: string,
  lastName: string,
  auth: number,
  referenceDate: string,
  workingDays: string,
  totalDeleteDays: string,
  totalAddDays: string,
  totalRemainingDays: string,
  autoCalcRemainingDays: string,
  totalCarryoverDays: string,
}

export async function getUserDetails(req: getUserDetailsRequest) {
  return await axiosGet(`/userDetails?id=${req.id}`).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      id: res.result?.id,
      userId: res.result?.userId,
      firstName: res.result?.firstName,
      lastName: res.result?.lastName,
      auth: res.result?.auth,
      referenceDate: res.result?.referenceDate,
      workingDays: res.result?.workingDays,
      totalDeleteDays: res.result?.totalDeleteDays,
      totalAddDays: res.result?.totalAddDays,
      totalRemainingDays: res.result?.totalRemainingDays,
      autoCalcRemainingDays: res.result?.autoCalcRemainingDays,
      totalCarryoverDays: res.result?.totalCarryoverDays,
    } as getUserDetailsResponse;
  })
}
