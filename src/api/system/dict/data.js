import request from '@/utils/request'

// 查询字典数据列表
export function listData(data) {
  return request({
    url: '/api/SysDictData/list',
    method: 'post',
    data
  })
}

// 查询字典数据详细
export function getData(id) {
  return request({
    url: '/api/SysDictData/' + id,
    method: 'get'
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType, params) {
  return request({
    url: '/api/SysDictData/type/' + dictType,
    method: 'get',
    params
  })
}

// 新增字典数据
export function addData(data) {
  return request({
    url: '/api/SysDictData/Add',
    method: 'post',
    data: data
  })
}

// 修改字典数据
export function updateData(data) {
  return request({
    url: '/api/SysDictData/Update',
    method: 'post',
    data: data
  })
}

// 删除字典数据
export function delData(data) {
  return request({
    url: '/api/SysDictData/Delete',
    method: 'post',
    data
  })
}
