import request from '@/utils/request'

// 获取角色列表
export const getRoleList = params => request.get('/sys/role', { params })

// 获取公司信息
export const getCompanyInfo = companyId => request.get(`/company/${companyId}`)

// 删除角色
export const removeRoleList = id => request.delete(`/sys/role/${id}`)

// 添加角色
export const addRoles = data => request.post('/sys/role', data)

// 获取角色详情
export const getRoleDetail = id => request.get(`/sys/role/${id}`)

// 更新角色
export const updateRoleDetail = data => request.put(`/sys/role/${data.id}`, data)

// 给角色分配权限
export const assignPerm = data => request.put('/sys/role/assignPrem', data)
