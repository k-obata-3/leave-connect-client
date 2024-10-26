import { axiosClient } from "@/axiosClient";

export type GetSystemConfigsRequest = {
  key: string,
}

export type GetSystemConfigsResponse = {
  id: string | null,
  key: string,
  value: string,
}

export async function getSystemConfigs(req: GetSystemConfigsRequest) {
  try {
    const response = await axiosClient.get(`/systemConfigs?key=${req.key}`);
    if(!response || !response.data || response.data.resultCode !== 200) {
      throw new Error("error");
    }

      return response.data.result as GetSystemConfigsResponse[];
  } catch (error: any) {
    throw error.response?.data?.result;
  }
}
