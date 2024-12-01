import { axiosGet, ApiResponse } from "@/axiosClient";

export interface GetSystemConfigsRequest  {
  key: string,
}

export interface GetSystemConfigsResponse extends ApiResponse {
  systemConfigs: SystemConfigObject[]
}

export interface SystemConfigObject extends ApiResponse {
  id: string | null,
  key: string,
  value: string,
}

export async function getSystemConfigs(req: GetSystemConfigsRequest) {
  return await axiosGet(`/systemConfigs?key=${req.key}`).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      systemConfigs: res.result,
    } as GetSystemConfigsResponse;
  })
}
