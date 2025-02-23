import { axiosGet, ApiResponse } from "@/axiosClient";

export interface GetSystemSettingRequest  {
  key: string,
}

export interface GetSystemSettingResponse extends ApiResponse {
  SystemSettings: SystemSettingObject[]
}

export interface SystemSettingObject extends ApiResponse {
  id: string | null,
  key: string,
  value: string,
}

export async function getSystemSettings(req: GetSystemSettingRequest) {
  return await axiosGet(`/systemSetting?key=${req.key}`).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      SystemSettings: res.result,
    } as GetSystemSettingResponse;
  })
}
