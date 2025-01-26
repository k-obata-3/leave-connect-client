import { axiosGet, ApiResponse } from "@/axiosClient";

export interface GetCareerUserListRequest {
  limit: number,
  offset: number,
}

export interface GetCareerUserListResponse extends ApiResponse {
  page: {
    total: number,
  },
  careerUserList: CareerUser[],
}

export interface CareerUser {
  userId: number
  fullName: string,
  joiningDate: string,
  AffiliationPeriod: number,
  careerItem: string[],
}

export async function getCareerUserList(req: GetCareerUserListRequest) {
  return await axiosGet(`/career/user/list?limit=${req.limit}&offset=${req.offset}`).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      page: {
        total: res.total,
      },
      careerUserList: res.result,
    } as GetCareerUserListResponse;
  })
}
