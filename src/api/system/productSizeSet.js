import request from '@/utils/request'

export function listProductSize(data) {
  return request({
    url: '/api/ProductSize/GetList',
    method: 'post',
    data: data
  })
}

export function getProductSize(params) {
  return request({
    url: '/api/ProductSize/Get',
    method: 'get',
    params
  })
}

export function addProductSize(data) {
  return request({
    url: '/api/ProductSize/Add',
    method: 'post',
    data: data
  })
}

export function updateProductSize(data) {
  return request({
    url: '/api/ProductSize/Update',
    method: 'post',
    data: data
  })
}

export function delProductSize(data) {
  return request({
    url: '/api/ProductSize/DeleteAll',
    method: 'post',
    data: data
  })
}

