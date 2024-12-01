import { axiosPost, ApiResponse } from "@/axiosClient";

export interface CancelApplicationRequest {
  applicationId: number | undefined,
  comment: string,
}

export interface CancelApplicationResponse extends ApiResponse {

}

export async function cancelApplication(req: CancelApplicationRequest) {
  return await axiosPost(`/application/cancel`, req).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      result: res.result,
    } as CancelApplicationResponse;
  })
}
