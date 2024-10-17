import request from '@/utils/request'

export function listPriceFlow(data) {
  return request({
    url: '/api/PriceFlow/List',
    method: 'post',
    data: data
  })
}

export function getFlowType(params) {
  return request({
    url: '/api/PriceFlow/GetFlowType',
    method: 'get',
    params
  })
}
// 读取流程引擎类型下的步骤
export function getFlowSteps(params) {
  return request({
    url: '/api/PriceFlow/GetFlowSteps',
    method: 'get',
    params
  })
}
export function getPriceFlow(params) {
  return request({
    url: '/api/PriceFlow/Get',
    method: 'get',
    params
  })
}

export function addPriceFlow(data) {
  return request({
    url: '/api/PriceFlow/Add',
    method: 'post',
    data: data
  })
}

export function updatePriceFlow(data) {
  return request({
    url: '/api/PriceFlow/Edit',
    method: 'post',
    data: data
  })
}

export function activePriceFlow(data) {
  return request({
    url: '/api/PriceFlow/Active',
    method: 'post',
    data: data
  })
}

