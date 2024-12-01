import { axiosPost, ApiResponse } from "@/axiosClient";

export interface SaveUserRequest {
  id: number | undefined,
  lastName: string,
  firstName: string,
  referenceDate: Date,
  workingDays: string,
  totalDeleteDays: string,
  totalAddDays: string,
  totalRemainingDays: string,
  totalCarryoverDays: string,
}

export interface SaveUserResponse extends ApiResponse {

}

export async function saveUser(req: SaveUserRequest) {
  return await axiosPost(`/user/save`, req).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      result: res.result,
    } as SaveUserResponse;
  })
}
