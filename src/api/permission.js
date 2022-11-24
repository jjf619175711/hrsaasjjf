import request from '@/utils/request'

// 获取所有权限列表
export const getPermissionList = () => request.get('/sys/permission')

// 根据id删除权限
export const removePermission = id => request.delete(`/sys/permission/${id}`)

// 添加权限
export const addPermission = data => request.post(`/sys/permission`, data)

// 根据ID获取权限点详情
export const getPermissionDetail = id => request.get(`/sys/permission/${id}`)

// 根据ID更新权限点详情
export const updatePermission = data => request.put(`/sys/permission/${data.id}`, data)
