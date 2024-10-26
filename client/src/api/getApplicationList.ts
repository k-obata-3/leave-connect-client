import { axiosClient } from "@/axiosClient";

export type GetApplicationListRequest = {
  searchUserId: string | null,
  searchAction: string | null,
  searchYear: string | null,
  limit: number,
  offset: number,
  isAdmin: boolean,
}

export type GetApplicationListResponse = {
  page: {
    total: number,
  },
  applicationList: Application[],
}

export type Application = {
  id: number
  applicationUserId: number
  action: number,
  applicationDate: string,
  classification: number
  comment: string,
  endDate: string,
  sAction: string,
  sApplicationDate: string,
  sClassification: string,
  sEndDate: string,
  sEndTime: string,
  sStartDate: string,
  sStartTime: string,
  sType: string,
  startDate: string,
  startEndTime: string,
  type: number
  approvalGroupId: number,
}

export async function getApplicationList(req: GetApplicationListRequest) {
  if(!req.searchYear) {
    req.searchYear = '';
  }

  try {
    const response = await axiosClient.get(`/application/list?userId=${req.searchUserId}&searchAction=${req.searchAction}&searchYear=${req.searchYear}&limit=${req.limit}&offset=${req.offset}&isAdmin=${req.isAdmin}`);
    if(!response || !response.data || response.data.resultCode !== 200) {
      throw new Error("error");
    }

    response.data.result.forEach((item: Application) => {
      item.startEndTime = `${item.sStartTime} - ${item.sEndTime}`;
    });

    const res: GetApplicationListResponse = {
      page: {
        total: response.data.total,
      },
      applicationList: response.data.result as Application[],
    }

    return res;
  } catch (error: any) {
    throw error.response?.data?.result;
  }
}
