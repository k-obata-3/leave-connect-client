import { ApiResponse, axiosDelete } from "@/axiosClient";

export interface DeleteSystemSettingRequest {
  id: string,
}

export interface DeleteSystemSettingResponse extends ApiResponse {

}

export async function deleteSystemSetting(req: DeleteSystemSettingRequest) {
  return await axiosDelete(`/systemSetting/delete?id=${req.id}`).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      result: res.result,
    } as DeleteSystemSettingResponse;
  })
}
