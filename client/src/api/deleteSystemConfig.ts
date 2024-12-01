import { ApiResponse, axiosDelete } from "@/axiosClient";

export interface DeleteSystemConfigRequest {
  id: string,
}

export interface DeleteSystemConfigResponse extends ApiResponse {

}

export async function deleteSystemConfig(req: DeleteSystemConfigRequest) {
  return await axiosDelete(`/systemConfig/delete?id=${req.id}`).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      result: res.result,
    } as DeleteSystemConfigResponse;
  })
}
