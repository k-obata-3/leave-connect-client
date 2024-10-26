import { axiosClient } from "@/axiosClient";

export type SaveUserRequest = {
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

export type SaveUserResponse = {

}

export async function saveUser(req: SaveUserRequest) {
  try {
    const response = await axiosClient.post(`/user/save`, req);
    if(!response || !response.data || response.data.resultCode !== 200) {
      throw new Error("error");
    }

    return true;
  } catch (error: any) {
    throw error.response?.data?.result;
  }
}
