import { getUserDetailById, getUserInfo, login } from '@/api/user'
import { getToken, removeToken, setToken, setTimeStamp } from '@/utils/auth'

// 状态
const state = {
  token: getToken(), // 设置token为共享状态 初始化vuex的时候 就先从缓存中读取
  userInfo: {}
}
const mutations = {
  setToken(state, payload) {
    state.token = payload
    setToken(payload)
  },
  removeToken(state) {
    state.token = '' // 将vuex 的数据置空
    removeToken() // 同步到缓存
  },
  setUserInfo(state, payload) {
    // 更新一个对象
    // state.userInfo = pauload //这样是响应式
    state.userInfo = { ...payload } // 这样也是响应式 属于浅拷贝
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }

}
const actions = {
  async login(context, data) {
    // 调用api的接口
    const res = await login(data) // 拿到token
    context.commit('setToken', res)// 设置token
    // 拿到token 说明登录成功
    setTimeStamp()// 设置当前时间戳
  },
  logout(context) {
    // 删除token
    context.commit('removeToken')
    // 删除用户资料
    context.commit('removeUserInfo')
  },

  async getUserInfo(context) {
    const res = await getUserInfo() // 用户的基本资料
    const baseInfo = await getUserDetailById(res.userId) // 获取头像
    const baseResult = { ...res, ...baseInfo } // 合并资料
    context.commit('setUserInfo', baseResult) // 提交到mutations
    console.log(res)
    console.log(baseResult)
    return baseResult // 这里为什么要return呢 这里给我们后期做权限的时候留下的伏笔
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
