import request from '@/utils/request'

export function listBasePrice(data) {
  return request({
    url: '/api/BasePrice/GetList',
    method: 'post',
    data: data
  })
}

export function getBasePrice(params) {
  return request({
    url: '/api/BasePrice/Get',
    method: 'get',
    params
  })
}

export function addBasePrice(data) {
  return request({
    url: '/api/BasePrice/Add',
    method: 'post',
    data: data
  })
}

export function updateBasePrice(data) {
  return request({
    url: '/api/BasePrice/Update',
    method: 'post',
    data: data
  })
}

export function delBasePrice(data) {
  return request({
    url: '/api/BasePrice/DeleteAll',
    method: 'post',
    data: data
  })
}


