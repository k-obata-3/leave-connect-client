import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

// const BaseUrl = 'http://localhost:3001';
const BaseUrl = 'http://192.168.0.253:3001';

/**
 * デフォルト config の設定
 */
export const axiosClient = axios.create({
  baseURL: BaseUrl,
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
    // 'Access-Control-Allow-Origin': BaseUrl,
    // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Credentials': true,
  },
  withCredentials: true,
})

/**
 * リクエスト インターセプター
 */
// axiosClient.interceptors.request.use((config: AxiosRequestConfig) => {
axiosClient.interceptors.request.use((config: any) => {
  if (config.headers !== undefined) {
    // --ヘッダにアクセストークンを埋める
    // const accessToken = getAccessToken()
    // if (accessToken) {
    //   config.headers.Authorization = `Bearer ${accessToken}`
    // }
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