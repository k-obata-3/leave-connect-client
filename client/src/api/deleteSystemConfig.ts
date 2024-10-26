import { axiosClient } from "@/axiosClient";

export type DeleteSystemConfigRequest = {
  id: string,
}

export type DeleteSystemConfigResponse = {

}

export async function deleteSystemConfig(req: DeleteSystemConfigRequest) {
  try {
    const response = await axiosClient.delete(`/systemConfig/delete?id=${req.id}`);
    if(!response || !response.data || response.data.resultCode !== 200) {
      throw new Error("error");
    }

    return true;
  } catch (error: any) {
    throw error.response?.data?.result;
  }
}
