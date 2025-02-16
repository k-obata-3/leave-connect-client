import { axiosFileDownload, ApiResponse } from "@/axiosClient";

export interface AggregateHolidayRequest {
  userId: string | null,
}

export interface AggregateHolidayResponse extends ApiResponse {
  aggregateResults: AggregateResult[],
}

export interface AggregateResult {
  index: number,
  period: {
    startDate: string,
    endDate: string,
  },
  acquisitionResults: AcquisitionResult[],
  totalDays: number,
}

export interface AcquisitionResult {
  acquisitionDate: string,
  totalTime: number,
}

export async function aggregateHoliday(req: AggregateHolidayRequest) {
  return await axiosFileDownload(`/application/holiday/aggregate?userId=${req.userId ? req.userId : ''}`).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      // aggregateResults: res.result,
      result: res.result,
    } as AggregateHolidayResponse;
  })
}
