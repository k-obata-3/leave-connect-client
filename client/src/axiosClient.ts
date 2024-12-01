import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import utils from './assets/js/utils';

// const BaseUrl = 'http://localhost:3001';
const BaseUrl = 'http://192.168.0.253:3001/api';

/**
 * デフォルト config の設定
 */
export const axiosClient = axios.create({
  baseURL: BaseUrl,
  timeout: 60000,  // 60秒
  headers: {
    'Content-Type': 'application/json',
    // 'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Headers': '*',
    // 'Access-Control-Allow-Credentials': true,
  },
  // withCredentials: true,
})

export interface ApiResponse {
  responseResult?: boolean,
  result?: any,
  message?: string,
  total?: number,
}

export const axiosGet = async(url: string) => {
  return await axiosClient.get(url).then((res: AxiosResponse) => {
    return {
      responseResult: true,
      result: res?.data?.result,
      total: res?.data?.total,
    } as ApiResponse;
  }).catch((err) => {
    console.log(err.response?.data?.message)
    return {
      responseResult: false,
      message: err.response?.data?.message,
      result: err.response?.data?.result,
      total: err?.data?.total,
    } as ApiResponse;
  })
}

export const axiosPost = async(url: string, req: any) => {
  return await axiosClient.post(url, req).then((res: AxiosResponse) => {
    return {
      responseResult: true,
      result: res?.data?.result,
    } as ApiResponse;
  }).catch((err) => {
    console.log(err.response?.data?.message)
    return {
      responseResult: false,
      message: err.response?.data?.message,
      result: err.response?.data?.result,
    } as ApiResponse;
  })
}

export const axiosDelete = async(url: string) => {
  return await axiosClient.delete(url).then((res: AxiosResponse) => {
    return {
      responseResult: true,
      result: res?.data?.result,
    } as ApiResponse;
  }).catch((err) => {
    console.log(err.response?.data?.message)
    return {
      responseResult: false,
      message: err.response?.data?.message,
      result: err.response?.data?.result,
    } as ApiResponse;
  })
}

/**
 * リクエスト インターセプター
 */
// axiosClient.interceptors.request.use((config: AxiosRequestConfig) => {
axiosClient.interceptors.request.use((config: any) => {
  const accessToken = utils.getCookieValue('jwt');
  if (config.headers !== undefined) {
    if (accessToken) {
      config.headers.Authorization = `JWT ${accessToken}`;
    }
  }
  return config
})

/**
 * レスポンス インターセプター
 */
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    switch (error.response?.status) {
      case 400:
        // Bad Request
        break;
      case 401:
        // Unauthorized
        break
      case 403:
        // Forbidden
        break;
      case 404:
        // Not Found
        break
      case 405:
        // Method Not Allowed
        break;
      case 500:
        // Internal Server Error
        break;
      case 502:
        // Bad Gateway
        break;
      case 503:
        // Service Unavailable
        break;
      case 504:
        // Gateway Timeout
        break
      default:
        break
    }
    return Promise.reject(error);
   }
)
