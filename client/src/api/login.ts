import { axiosPost, ApiResponse } from '@/axiosClient';

export interface loginRequest {
  user_id: string,
  password: string,
}

export interface loginResponse extends ApiResponse {
  user_id: string,
  password: string,
}

export async function login(req: loginRequest) {
  return await axiosPost(`/login`, req).then((res: ApiResponse) => {
    document.cookie = `jwt=${res.result.jwt}; path=/; max-age=3600`;
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      result: res.result,
    } as loginResponse;
  })
}
