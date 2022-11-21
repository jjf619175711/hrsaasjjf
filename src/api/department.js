import request from '@/utils/request'

// 获取组织架构
export const getDepartments = () => request.get('/company/department')

// 删除
export const delDepartments = id => request.delete(`/company/department/${id}`)

// 新增
export const addDepartments = data => request.post(`/company/department/`, data)

// 查询部门详情
export const getDepartDetail = id => request.get(`/company/department/${id}`)

// 修改部门信息
export const updatetDepartDetail = (data) => request.put(`/company/department/${data.id}`, data)
