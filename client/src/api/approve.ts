import { ApiResponse, axiosPost } from "@/axiosClient";

export interface ApproveRequest {
  application_id: number | null,
  task_id: number | null,
  comment: string,
  action: number,
}

export interface ApproveResponse extends ApiResponse {

}

export async function approve(req: ApproveRequest) {
  return await axiosPost(`/approval/approve`, req).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      result: res.result,
    } as ApproveResponse;
  })
}
