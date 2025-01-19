import { ApiResponse, axiosDelete } from "@/axiosClient";

export interface DeleteCareerRequest {
  careerId: string,
}

export interface DeleteCareerResponse extends ApiResponse {

}

export async function deleteCareer(req: DeleteCareerRequest) {
  return await axiosDelete(`/career/delete?careerId=${req.careerId}`).then((res: ApiResponse) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      result: res.result,
    } as DeleteCareerResponse;
  })
}
