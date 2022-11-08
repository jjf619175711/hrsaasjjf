import request from '@/utils/request'

export const login = data => request.post('', data)

export const getInfo = token => request.get('', token)

export const logout = () => request.post('')

