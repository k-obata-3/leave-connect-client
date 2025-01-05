import { ApiResponse, axiosGet } from "@/axiosClient";

export interface GetApplicationTypeListRequest {

}

export interface GetApplicationTypeListResponse extends ApiResponse {
  applicationTypes: ApplicationType[],
}

export type ApplicationType = {
  type: string,
  name: string,
  value: number,
  format: string,
  initialValue: ApplicationInitialValue,
  classifications: ApplicationClassification[],
}

export type ApplicationClassification = {
  key: string,
  name: string,
  value: number
  min: number,
  max: number,
}

export type ApplicationInitialValue = {
  startTime: string,
  endTime: string,
  classification: number,
  totalTime: number,
}


export async function getApplicationTypeList() {
  return await axiosGet(`systemConfig/applicationType/list`).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      result: res.result,
      applicationTypes: res.result?.applicationTypes,
    } as GetApplicationTypeListResponse;
  })
}
