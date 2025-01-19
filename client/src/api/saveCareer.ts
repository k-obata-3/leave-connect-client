import { axiosPost, ApiResponse } from "@/axiosClient";

export interface SaveCareerRequest {
  careerId: string | null,
  user: string | null,
  projectName: string,
  overview: string | null,
  startDate: string | null,
  endDate: string | null,
  model: string[],
  os: string[],
  database: string[],
  language: string[],
  framework: string[],
  tool: string[],
  incharge: string[],
  role: string[],
  other: string[],
}

export interface SaveCareerResponse extends ApiResponse {

}

export async function saveCareer(req: SaveCareerRequest) {
  return await axiosPost(`/career/save`, req).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      result: res.result,
    } as SaveCareerResponse;
  })
}
