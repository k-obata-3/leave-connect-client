import { axiosPost, ApiResponse } from "@/axiosClient";

export interface SaveCareerItemMasterRequest {
  id: string | null,
  key: string,
  value: string,
}

export interface SaveCareerItemMasterResponse extends ApiResponse {

}

export async function saveCareerItemMaster(req: SaveCareerItemMasterRequest) {
  return await axiosPost(`/career/itemMaster/save`, req).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      result: res.result,
    } as SaveCareerItemMasterResponse;
  })
}
