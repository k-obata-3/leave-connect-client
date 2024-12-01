import utils from '@/assets/js/utils';
import { axiosPost, ApiResponse } from '@/axiosClient';

export interface logoutRequest {

}

export interface logoutResponse extends ApiResponse {

}

export async function logout() {
  return await axiosPost(`/logout`, {}).then((res: ApiResponse) => {
    document.cookie = `jwt=; path=/; max-age=0`;
    return {
      responseResult: res.responseResult,
      message: res.responseResult ? "" : res.message,
      result: res.result,
    } as logoutResponse;
  })
}
