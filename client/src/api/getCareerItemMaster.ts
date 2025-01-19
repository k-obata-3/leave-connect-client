import { axiosGet, ApiResponse } from "@/axiosClient";

export interface GetCareerItemMasterRequest {
  key: string | null,
}

export interface GetCareerItemMasterResponse extends ApiResponse {
  modelList: CareerItemMaster[],
  osList: CareerItemMaster[],
  languageList: CareerItemMaster[],
  frameworkList: CareerItemMaster[],
  databaseList: CareerItemMaster[],
  toolList: CareerItemMaster[],
}

export interface CareerItemMaster {
  id: string,
  key: string,
  value: string,
  startDate:string,
  endDate: string,
}

export async function getCareerItemMaster(req: GetCareerItemMasterRequest) {
  return await axiosGet(`/career/itemMaster?key=${req.key ? req.key : ''}`).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      modelList: res.result.modelList,
      osList: res.result.osList,
      languageList: res.result.languageList,
      frameworkList: res.result.frameworkList,
      databaseList: res.result.databaseList,
      toolList: res.result.toolList,
    } as GetCareerItemMasterResponse;
  })
}
