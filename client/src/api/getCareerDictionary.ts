import { axiosGet, ApiResponse } from "@/axiosClient";

export interface GetCareerDictionaryRequest {
  userId: string
}

export interface GetCareerDictionaryResponse extends ApiResponse {
  careerDictionary: CareerDictionary,
}

export interface CareerDictionary {
  careerDb: CareerItemMap,
  careerLang: CareerItemMap,
  careerFramework: CareerItemMap,
  careerTool: CareerItemMap,
}

export interface CareerItemMap {
  name : string,
  value: string,
}

export async function getCareerDictionary(req: GetCareerDictionaryRequest) {
  return await axiosGet(`/career/dictionary?userId=${req.userId}`).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      careerDictionary: res.result.careerDic,
    } as GetCareerDictionaryResponse;
  })
}
