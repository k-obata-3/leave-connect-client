import { ApiResponse, axiosFileDownload } from "@/axiosClient";

export interface OutputSkillsheetRequest {
  userId?: string,
}

export interface OutputSkillsheetResponse extends ApiResponse {

}

export async function outputSkillsheet(req: OutputSkillsheetRequest) {
  return await axiosFileDownload(`/career/outputSkillSheet`, req).then((res: any) => {
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      result: res.result,
    } as OutputSkillsheetResponse;
  })
}
