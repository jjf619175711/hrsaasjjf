import axios from 'axios'

import { Message } from 'element-ui'

import store from '@/store'
import { getTimeSTamp } from './auth'
import router from '@/router'
const TimeOut = 3600 // 定义超时时间

const service = axios.create({
  // 当执行 npm run dev =>.evn.development => /api => 跨域代理
  // 当执行 npm run build => /prod-api
  baseURL: process.env.VUE_APP_BASE_API, // /dev-api    /prod-api
  timeout: 5000 // 超时时间
})

// 请求拦截器
service.interceptors.request.use(config => {
  // config是请求配置信息
  // 注入token
  if (store.getters.token) {
    // 只有在有token的情况下，才有必要检查时间戳是否超时
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
    if (isCheckTimeOut()) {
      // 如果他为true 表示过期了
      // token没用了 因为超时了
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }
  }
  // 必须要返回的配置信息
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
  // axios默认加了一层data
  const { success, message, data } = response.data
  // 要根据success成功与否 决定下面的操作
  if (success) {
    return data
  } else {
    // 业务已经错误
    Message.error(message) // 提示错误消息
    return Promise.reject(new Error(message))
  }
}, error => {
  // error 信息 里面 response 的对象
  if (error.response && error.response.data && error.response.data.code === '10002') {
    store.dispatch('user/logout')
    router.push('/login')
  } else {
    Message.error(error.message) // 提示错误信息
  }
  return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入catch
})

// 是否超时
// 超时逻辑   （当前时间 - 缓存中的时间）  是否大于时间差
function isCheckTimeOut() {
  var currentTime = Date.now()
  var timeStamp = getTimeSTamp()

  return (currentTime - timeStamp) / 1000 > TimeOut
}

export default service
