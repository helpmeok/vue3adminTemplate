import request from '@/utils/request'

// 查询用户列表
export function listUser(data) {
  return request({
    url: '/api/User/GetUserList',
    method: 'post',
    data: data
  })
}

// 获取用户
export function getUser(params) {
  return request({
    url: '/api/User/GetUser',
    method: 'get',
    params
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/api/User/Add',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/api/User/Update',
    method: 'post',
    data: data
  })
}

// 删除用户
export function delUser(data) {
  return request({
    url: '/api/User/Delete',
    method: 'post',
    data: data
  })
}


// 显示密码
export function showUserPwd(params) {
  return request({
    url: '/api/User/ShowPwd',
    method: 'get',
    params
  })
}

// 修改密码
export function updateUserPwd(data) {
  return request({
    url: '/api/User/ChangePwd',
    method: 'post',
    data: data
  })
}


// 生成账号
export function getUserNameForAdd(data) {
  return request({
    url: '/api/User/GetUserNameForAdd',
    method: 'post',
    data: data
  })
}

