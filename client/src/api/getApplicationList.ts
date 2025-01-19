import { axiosGet, ApiResponse } from "@/axiosClient";

export interface GetApplicationListRequest {
  searchUserId: string | null,
  searchAction: string | null,
  searchYear: string | null,
  searchType: string | null,
  limit: number,
  offset: number,
  isAdmin: boolean,
}

export interface GetApplicationListResponse extends ApiResponse {
  page: {
    total: number,
  },
  applicationList: Application[],
}

export interface Application {
  id: number
  applicationUserId: number
  applicationDate: string,
  sApplicationDate: string,
  type: number
  sType: string,
  sAction: string,
  action: number,
  classification: number
  sClassification: string,
  startDate: string,
  sStartDate: string,
  sStartTime: string,
  endDate: string,
  sEndDate: string,
  sEndTime: string,
  startEndTime: string,
  approvalGroupId: number,
  comment: string,
}

export async function getApplicationList(req: GetApplicationListRequest) {
  if(!req.searchYear) {
    req.searchYear = '';
  }

  return await axiosGet(`/application/list?userId=${req.searchUserId}&searchAction=${req.searchAction}&searchYear=${req.searchYear}&searchType=${req.searchType}&limit=${req.limit}&offset=${req.offset}&isAdmin=${req.isAdmin}`).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      page: {
        total: res.total,
      },
      applicationList: res.result,
    } as GetApplicationListResponse;
  })
}
