import { axiosClient } from "@/axiosClient";

export async function getLoginUserInfo() {
  try {
    const response = await axiosClient.get(`/loginUserInfo`);
    if(!response || !response.data || response.data.resultCode !== 200) {
      throw new Error("error");
    }

    return response.data.result;
  } catch (error: any) {
    throw error.response?.data?.result;
  }
}
