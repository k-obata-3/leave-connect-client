import { axiosGet, ApiResponse } from "@/axiosClient";

export interface GetCareerRequest {
  careerId: string,
}

export interface GetCareerResponse extends ApiResponse {
  career: Career,
  careerItem: CareerItem,
}

export interface Career {
  id: number
  userId: string,
  projectName: string,
  overview: string,
  startDate: string,
  endDate: string,
}

export interface CareerItem {
  model: string[],
  os: string[],
  database: string[],
  language: string[],
  framework: string[],
  tool: string[],
  incharge: string[],
  role: string[],
  other: string,
}

export async function getCareer(req: GetCareerRequest) {
  return await axiosGet(`/career?careerId=${req.careerId}`).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      career: res.result.career,
      careerItem: res.result.careerItem,
    } as GetCareerResponse;
  })
}
