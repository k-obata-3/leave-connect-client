import { axiosFileDownload, ApiResponse } from "@/axiosClient";

export interface OutputAggregateRequest {
  userId: string | null,
  months?: string | null,
}

export interface OutputAggregateResponse extends ApiResponse {

}

export async function outputAggregate(req: OutputAggregateRequest) {
  return await axiosFileDownload(`/application/output/aggregate`, req).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      result: res.result,
    } as OutputAggregateResponse;
  })
}
