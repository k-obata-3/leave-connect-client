import { axiosPost, ApiResponse } from "@/axiosClient";

export interface UpdateGrantDaysRequest {
  id: number | undefined,
}

export interface UpdateGrantDaysResponse extends ApiResponse {

}

export async function updateGrantDays(req: UpdateGrantDaysRequest) {
  return await axiosPost(`/user/updateGrantDays`, req).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      result: res.result,
    } as UpdateGrantDaysResponse;
  })
}
