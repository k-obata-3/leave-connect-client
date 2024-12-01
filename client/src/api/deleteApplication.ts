import { ApiResponse, axiosDelete } from "@/axiosClient";

export interface DeleteApplicationRequest {
  id: number | undefined,
}

export interface DeleteApplicationResponse extends ApiResponse {

}

export async function deleteApplication(req: DeleteApplicationRequest) {
  return await axiosDelete(`/application/delete?id=${req.id}`).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      result: res.result,
    } as DeleteApplicationResponse;
  })
}
