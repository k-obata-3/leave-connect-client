import { axiosGet, ApiResponse } from "@/axiosClient";

export interface getUserDetailsRequest {
  id: string | null,
}

export interface getUserDetailsResponse extends ApiResponse {
  id: number,
  userId: string,
  status: number,
  auth: number,
  firstName: string,
  lastName: string,
  referenceDate: string,
  workingDays: string,
  totalDeleteDays: string,
  totalAddDays: string,
  totalRemainingDays: string,
  totalCarryoverDays: string,
  lastGrantDate: string,
}

export async function getUserDetails(req: getUserDetailsRequest) {
  return await axiosGet(`/userDetails?id=${req.id}`).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      id: res.result?.id,
      userId: res.result?.userId,
      status: res.result?.status,
      auth: res.result?.auth,
      firstName: res.result?.firstName,
      lastName: res.result?.lastName,
      referenceDate: res.result?.referenceDate,
      workingDays: res.result?.workingDays,
      totalDeleteDays: res.result?.totalDeleteDays,
      totalAddDays: res.result?.totalAddDays,
      totalRemainingDays: res.result?.totalRemainingDays,
      totalCarryoverDays: res.result?.totalCarryoverDays,
      lastGrantDate: res.result?.lastGrantDate,
    } as getUserDetailsResponse;
  })
}
