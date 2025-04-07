import { axiosGet, ApiResponse } from "@/axiosClient";

export interface GetAggregateCareerResultsRequest {
  userId?: string
}

export interface GetAggregateCareerResultsResponse extends ApiResponse {
  careerDictionary: CareerDictionary,
}

export interface CareerDictionary {
  database: CareerItemMap[],
  framework: CareerItemMap[],
  language: CareerItemMap[],
}

export interface CareerItemMap {
  name : string,
  value: string,
}

export async function getAggregateCareerResults(req: GetAggregateCareerResultsRequest) {
  return await axiosGet(`/career/aggregate`).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      careerDictionary: res.result.careerDic,
    } as GetAggregateCareerResultsResponse;
  })
}
