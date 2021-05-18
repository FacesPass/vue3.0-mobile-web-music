import axios from 'axios'

import { BASE_URL, TIME_OUT } from './config'

const instance = axios.create({
  timeout: TIME_OUT,
  baseURL: BASE_URL
})


instance.interceptors.request.use(config => {
  return config
}, err => {
  return Promise.reject(err)
})

instance.interceptors.response.use(res => {
  return res.data;
}, err => {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        console.log("请求错误");
        break;
      case 401:
        console.log("未授权访问");
        break;
      case 404:
        console.log('无法访问资源')
        break;
      case 500:
        console.log('服务器出现错误')
        break;
      default:
        console.log("其他错误信息");
    }
  }
  return Promise.reject(err)
})

export default instance;