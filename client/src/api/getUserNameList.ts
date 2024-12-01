import { axiosGet, ApiResponse } from "@/axiosClient";

export interface GetUserNameListRequest {

}

export interface GetUserNameListResponse extends ApiResponse {
  userNameList: UserNameObject[]
}

export interface UserNameObject {
  id: number,
  fullName: string,
}

export async function getUserNameList() {
  return await axiosGet(`/userName/list`).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      userNameList: res.result,
    } as GetUserNameListResponse;
  })
}
