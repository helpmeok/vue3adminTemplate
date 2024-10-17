import request from '@/utils/request'

export function listMaterial(data) {
  return request({
    url: '/api/Material/GetList',
    method: 'post',
    data: data
  })
}

export function getMaterial(params) {
  return request({
    url: '/api/Material/Get',
    method: 'get',
    params
  })
}

export function addMaterial(data) {
  return request({
    url: '/api/Material/Add',
    method: 'post',
    data: data
  })
}

export function updateMaterial(data) {
  return request({
    url: '/api/Material/Update',
    method: 'post',
    data: data
  })
}

export function delMaterial(data) {
  return request({
    url: '/api/Material/DeleteAll',
    method: 'post',
    data: data
  })
}
