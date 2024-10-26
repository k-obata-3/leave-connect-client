import { axiosClient } from '@/axiosClient';

export type loginRequest = {
  user_id: string,
  password: string,
}

export type loginResponse = {
  user_id: string,
  password: string,
}

export async function login(request: loginRequest) {
  try {
    const response = await axiosClient.post(`/login`, request);
    if(!response || !response.data || response.data.resultCode !== 200) {
      throw new Error("error");
    }
    return response.data.result;
  } catch (error: any) {
    throw error.response?.data?.result;
  }
}
