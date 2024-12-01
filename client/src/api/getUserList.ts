import { axiosGet, ApiResponse } from "@/axiosClient";

export type GetUserListRequest = {
  limit: number,
  offset: number,
}

export interface GetUserListResponse extends ApiResponse {
  page: {
    total: number,
  },
  userList: User[],
}

export type User = {
  id: number,
  userId: string,
  firstName: string,
  lastName: string,
  auth: number,
  referenceDate: string,
  workingDays: number,
  totalDeleteDays: number,
  totalAddDays: number,
  totalRemainingDays: number,
  autoCalcRemainingDays: number,
  totalCarryoverDays: number,
}

export async function getUserList(req: GetUserListRequest) {
  return await axiosGet(`/user/list?limit=${req.limit}&offset=${req.offset}`).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      page: {
        total: res.total,
      },
      userList: res.result,
    } as GetUserListResponse;
  })
}
