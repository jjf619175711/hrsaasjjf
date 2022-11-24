import request from '@/utils/request'

// 获取员工简单列表
export const getEmployeesSimple = () => request.get('/sys/user/simple')

// 获取员工列表
export const getEmployees = (params) => request.get('/sys/user', { params })

// 删除员工
export const removeEmployees = id => request.delete(`/sys/user/${id}`)

// 新增员工
export const addEmployees = data => request.post(`/sys/user/`, data)

// 批量导入员工
export const importEmployees = data => request.post(`/sys/user/batch`, data)

// 保存用户基本信息
export const saveUserDetailById = data => request.put(`/sys/user/${data.id}`, data)

// 获取员工个人信息
export const getPersonalDetail = id => request.get(`/employees/${id}/personalInfo`)

// 保存员工基本信息
export const savePersonalDetail = data => request.put(`/employees/${data.userId}/personalInfo`, data)

// 获取员工岗位信息
export const getJobDetail = id => request.get(`/employees/${id}/jobs`)

// 保存员工岗位信息
export const saveJobDetail = data => request.put(`/employees/${data.userId}/jobs`, data)

// 给员工分配角色
export const assignRoles = data => request.put('/sys/user/assignRoles', data)
