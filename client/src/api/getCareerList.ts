import { axiosGet, ApiResponse } from "@/axiosClient";

export interface GetCareerListRequest {
  userId?: string,
  limit: number,
  offset: number,
}

export interface GetCareerListResponse extends ApiResponse {
  page: {
    total: number,
  },
  careerList: Career[],
}

export interface Career {
  id: number
  userId: string,
  projectName: string,
  overview: string,
  startDate: string,
  endDate: string,
}

export async function getCareerList(req: GetCareerListRequest) {
  return await axiosGet(`/career/list?userId=${req.userId ? req.userId : ''}&limit=${req.limit}&offset=${req.offset}`).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      page: {
        total: res.total,
      },
      careerList: res.result,
    } as GetCareerListResponse;
  })
}
