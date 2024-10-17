import request from '@/utils/request'

// 获取省市区
export function getRegionTree() {
  return request({
    url: '/api/Region/GetRegionTree',
    method: 'get'
  })
}

// 获取枚举
export function getEnums(params) {
  return request({
    url: '/api/Common/GetEnums',
    method: 'get',
    params
  })
}