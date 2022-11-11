import request from '@/utils/request'

export const login = data => request.post('/sys/login', data)

export const getUserInfo = () => request.post('/sys/profile')

export const getUserDetailById = id => request.get(`/sys/user/${id}`)

export const logout = () => request.post('')

