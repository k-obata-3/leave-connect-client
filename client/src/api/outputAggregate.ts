import { axiosFileDownload, ApiResponse } from "@/axiosClient";

export interface OutputAggregateRequest {
  userId: string | null,
}

export interface OutputAggregateResponse extends ApiResponse {

}

export async function outputAggregate(req: OutputAggregateRequest) {
  return await axiosFileDownload(`/application/output/aggregate?userId=${req.userId ? req.userId : ''}`).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      result: res.result,
    } as OutputAggregateResponse;
  })
}
