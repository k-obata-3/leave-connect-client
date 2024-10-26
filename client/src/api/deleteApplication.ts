import { axiosClient } from "@/axiosClient";

export type DeleteApplicationRequest = {
  id: number | undefined,
}

export type DeleteApplicationResponse = {

}

export async function deleteApplication(req: DeleteApplicationRequest) {
  try {
    const response = await axiosClient.delete(`/application/delete?id=${req.id}`);
    if(!response || !response.data || response.data.resultCode !== 200) {
      throw new Error("error");
    }

    return true;
  } catch (error: any) {
    throw error.response?.data?.result;
  }
}
