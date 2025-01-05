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
    if (err?.response && (err?.response?.status === 400)) {
      console.log(err?.response?.data?.message)
      return {
        responseResult: false,
        message: err.response?.data?.message,
        result: err.response?.data?.result,
        total: err.response?.data?.total,
      } as ApiResponse;
    } else {
      return {
        responseResult: false,
        message: err?.message ? err?.message : '予期せぬエラーが発生しました。',
        result: [],
        total: 0,
      } as ApiResponse;
    }
  })
}

export const axiosPost = async(url: string, req: any) => {
  return await axiosClient.post(url, req).then((res: AxiosResponse) => {
    return {
      responseResult: true,
      result: res?.data?.result,
    } as ApiResponse;
  }).catch((err) => {
    if (err?.response && (err?.response?.status === 400)) {
      console.log(err?.response?.data?.message)
      return {
        responseResult: false,
        message: err.response?.data?.message,
        result: err.response?.data?.result,
      } as ApiResponse;
    } else {
      return {
        responseResult: false,
        message: err.message ? err.message : '予期せぬエラーが発生しました。',
        result: [],
      } as ApiResponse;
    }
  })
}

export const axiosDelete = async(url: string) => {
  return await axiosClient.delete(url).then((res: AxiosResponse) => {
    return {
      responseResult: true,
      result: res?.data?.result,
    } as ApiResponse;
  }).catch((err) => {
    if (err?.response && (err?.response?.status === 400)) {
      console.log(err?.response?.data?.message)
      return {
        responseResult: false,
        message: err.response?.data?.message,
        result: err.response?.data?.result,
      } as ApiResponse;
    } else {
      return {
        responseResult: false,
        message: err.message ? err.message : '予期せぬエラーが発生しました。',
        result: [],
      } as ApiResponse;
    }
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
        error.message = 'Bad Request'
        break;
      case 401:
        // Unauthorized
        error.message = 'Unauthorized'
        break
      case 403:
        // Forbidden
        error.message = 'Authentication failed'
        break;
      case 404:
        // Not Found
        error.message = 'Not Found'
        break
      case 405:
        // Method Not Allowed
        error.message = 'Method Not Allowed'
        break;
      case 500:
        // Internal Server Error
        error.message = 'Internal Server Error'
        break;
      case 502:
        // Bad Gateway
        error.message = 'Bad Gateway'
        break;
      case 503:
        // Service Unavailable
        error.message = 'Service Unavailable'
        break;
      case 504:
        // Gateway Timeout
        error.message = 'Gateway Timeout'
        break
      default:
        break
    }
    return Promise.reject(error);
   }
)
