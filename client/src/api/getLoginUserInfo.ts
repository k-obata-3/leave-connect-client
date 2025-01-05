import { axiosGet, ApiResponse } from "@/axiosClient";

export interface getLoginUserInfoResponse extends ApiResponse {
  id: string,
  userId: string
  companyId: string,
  firstName: string,
  lastName: string,
  auth: string,
  referenceDate: string,
  workingDays: string,
  totalDeleteDays: string,
  totalAddDays: string,
  totalRemainingDays: string,
  totalCarryoverDays: string,
}

export async function getLoginUserInfo() {
  return await axiosGet(`/loginUserInfo`).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      id: res.result?.id,
      userId: res.result?.userId,
      companyId: res.result?.companyId,
      firstName: res.result?.firstName,
      lastName: res.result?.lastName,
      auth: res.result?.auth,
      referenceDate: res.result?.referenceDate,
      workingDays: res.result?.workingDays,
      totalDeleteDays: res.result?.totalDeleteDays,
      totalAddDays: res.result?.totalAddDays,
      totalRemainingDays: res.result?.totalRemainingDays,
      totalCarryoverDays: res.result?.totalCarryoverDays,
    } as getLoginUserInfoResponse;
  })
}
