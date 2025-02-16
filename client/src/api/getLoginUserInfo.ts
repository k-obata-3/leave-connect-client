import { axiosGet, ApiResponse } from "@/axiosClient";

export interface getLoginUserInfoResponse extends ApiResponse {
  id: string,
  userId: string
  companyId: string,
  firstName: string,
  lastName: string,
  firstNameKana: string,
  lastNameKana: string,
  dateOfBirth: string,
  auth: string,
  joiningDate: string,
  referenceDate: string,
  workingDays: string,
  totalDeleteDays: string,
  totalAddDays: string,
  totalRemainingDays: string,
  totalCarryoverDays: string,
  status: string,
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
      firstNameKana: res.result?.firstNameKana,
      lastNameKana: res.result?.lastNameKana,
      dateOfBirth: res.result?.dateOfBirth,
      auth: res.result?.auth,
      joiningDate: res.result?.joiningDate,
      referenceDate: res.result?.referenceDate,
      workingDays: res.result?.workingDays,
      totalDeleteDays: res.result?.totalDeleteDays,
      totalAddDays: res.result?.totalAddDays,
      totalRemainingDays: res.result?.totalRemainingDays,
      totalCarryoverDays: res.result?.totalCarryoverDays,
      status: res.result?.status,
    } as getLoginUserInfoResponse;
  })
}
