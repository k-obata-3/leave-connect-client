import { axiosGet, ApiResponse } from "@/axiosClient";

export interface getUserDetailsRequest {
  id: string | null,
}

export interface getUserDetailsResponse extends ApiResponse {
  userDetails: UserDetails,
}

export interface UserDetails {
  id: number,
  userId: string,
  status: number,
  auth: string,
  firstName: string,
  lastName: string,
  firstNameKana: string,
  lastNameKana: string,
  dateOfBirth: string,
  joiningDate: string,
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
      userDetails: res.result,
    } as getUserDetailsResponse;
  })
}
