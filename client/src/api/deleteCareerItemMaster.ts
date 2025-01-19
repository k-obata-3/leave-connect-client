import { ApiResponse, axiosDelete } from "@/axiosClient";

export interface DeleteCareerItemMasterRequest {
  id: string,
}

export interface DeleteCareerItemMasterResponse extends ApiResponse {

}

export async function deleteCareerItemMaster(req: DeleteCareerItemMasterRequest) {
  return await axiosDelete(`/career/itemMaster/delete?id=${req.id}`).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      result: res.result,
    } as DeleteCareerItemMasterResponse;
  })
}
