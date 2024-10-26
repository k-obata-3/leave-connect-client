import { axiosClient } from "@/axiosClient";

export type UpdateGrantDaysRequest = {
  id: number | undefined,
}

export type UpdateGrantDaysResponse = {

}

export async function updateGrantDays(req: UpdateGrantDaysRequest) {
  try {
    const response = await axiosClient.post(`/user/updateGrantDays`, req);
    if(!response || !response.data || response.data.resultCode !== 200) {
      throw new Error("error");
    }

    return true;
  } catch (error: any) {
    throw error.response?.data?.result;
  }
}
