import request from '@/utils/request'
import { getRefreshToken } from "@/utils/auth";
// 登录方法
export function login(data) {
  return request({
    url: '/api/User/UserLogin',
    headers: {
      isToken: false,
      repeatSubmit: false
    },
    method: 'post',
    data: data
  })
}

// 刷新token
export function refreshToken() {
  return request({
    url: '/api/User/RefreshToken',
    method: 'post',
    data: getRefreshToken()
  })
}


// 获取当前用户
export function getInfo(params) {
  return request({
    url: '/api/User/GetCurrentUser',
    method: 'get',
    params
  })
}
