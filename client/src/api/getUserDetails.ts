import { axiosClient } from "@/axiosClient";

export type getUserDetailsRequest = {
  id: string | string[],
}

export type getUserDetailsResponse = {
  id: number,
  userId: string,
  firstName: string,
  lastName: string,
  auth: number,
  referenceDate: string,
  workingDays: string,
  totalDeleteDays: string,
  totalAddDays: string,
  totalRemainingDays: string,
  autoCalcRemainingDays: string,
  totalCarryoverDays: string,
}

export async function getUserDetails(req: getUserDetailsRequest) {
  try {
    const response = await axiosClient.get(`/userDetails?id=${req.id}`);
    if(!response || !response.data || response.data.resultCode !== 200) {
      throw new Error("error");
    }

    return response.data.result as getUserDetailsResponse;
  } catch (error: any) {
    throw error.response?.data?.result;
  }
}
