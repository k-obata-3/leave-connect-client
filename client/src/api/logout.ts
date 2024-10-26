import { axiosClient } from '@/axiosClient';

export type logoutRequest = {

}

export type logoutResponse = {

}

export async function logout() {
  try {
    const response = await axiosClient.post(`/logout`);
    if(!response || !response.data || response.data.resultCode !== 200) {
      throw new Error("error");
    }
    return response.data.result;
  } catch (error: any) {
    throw error.response?.data?.result;
  }
}
