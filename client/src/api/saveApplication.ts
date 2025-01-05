import { axiosPost, ApiResponse } from "@/axiosClient";

export interface SaveApplicationRequest {
  id: number | undefined,
  type: string,
  classification: string,
  startDate: string,
  endDate: string,
  startTime: string,
  endTime: string,
  totalTime: string,
  comment: string,
  approvalGroupId: number,
  action: string,
  remarks: string,
}

export interface SaveApplicationResponse extends ApiResponse {

}

export async function saveApplication(req: SaveApplicationRequest) {
  return await axiosPost(`/application/save`, req).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      result: res.result,
    } as SaveApplicationResponse;
  })
}
