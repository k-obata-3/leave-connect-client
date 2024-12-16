import { axiosPost, ApiResponse } from "@/axiosClient";

export interface ChangePasswordRequest {
  oldPassword: string,
  newPassword: string,
}

export interface ChangePasswordResponse extends ApiResponse {

}

export async function changePassword(req: ChangePasswordRequest) {
  return await axiosPost(`/changePassword`, req).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      result: res.result,
    } as ChangePasswordResponse;
  })
}
