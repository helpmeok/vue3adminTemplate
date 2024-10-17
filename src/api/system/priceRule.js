import request from '@/utils/request'

export function listPriceRule(data) {
  return request({
    url: '/api/PriceRule/GetPage',
    method: 'post',
    data: data
  })
}

export function getPriceRule(params) {
  return request({
    url: '/api/PriceRule/Get',
    method: 'get',
    params
  })
}
export function getRuleTypes(params) {
  return request({
    url: '/api/PriceRule/GetEnumRuleTypesByStepName',
    method: 'get',
    params
  })
}

export function addPriceRule(data) {
  return request({
    url: '/api/PriceRule/Add',
    method: 'post',
    data: data
  })
}

export function updatePriceRule(data) {
  return request({
    url: '/api/PriceRule/Update',
    method: 'post',
    data: data
  })
}

export function activePriceRule(data) {
  return request({
    url: '/api/PriceRule/Enabled',
    method: 'post',
    data: data
  })
}

export function delPriceRule(data) {
  return request({
    url: '/api/PriceRule/Delete',
    method: 'post',
    data: data
  })
}



