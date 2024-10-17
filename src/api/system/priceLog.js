import request from '@/utils/request'

export function listPriceLog(data) {
  return request({
    url: '/api/Price/Log',
    method: 'post',
    data: data
  })
}
