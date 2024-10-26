import { axiosClient } from "@/axiosClient";

export type GetUserListRequest = {
  limit: number,
  offset: number,
}

export type GetUserListResponse = {
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
  try {
    const response = await axiosClient.get(`/user/list?limit=${req.limit}&offset=${req.offset}`);
    if(!response || !response.data || response.data.resultCode !== 200) {
      throw new Error("error");
    }

    const res: GetUserListResponse = {
      page: {
        total: response.data.total,
      },
      userList: response.data.result as User[],
    }

    return res;
  } catch (error: any) {
    throw error.response?.data?.result;
  }
}
