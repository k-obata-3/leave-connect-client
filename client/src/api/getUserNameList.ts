import { axiosClient } from "@/axiosClient";

export type getUserNameListRequest = {

}

export type getUserNameListResponse = {
  id: number,
  fullName: string,
}

export async function getUserNameList() {
  try {
    const response = await axiosClient.get(`/userName/list`);
    if(!response || !response.data || response.data.resultCode !== 200) {
      throw new Error("error");
    }

    return response.data.result as getUserNameListResponse[];
  } catch (error: any) {
    throw error.response?.data?.result;
  }
}
