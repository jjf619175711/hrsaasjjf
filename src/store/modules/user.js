import { getUserDetailById, getUserInfo, login } from '@/api/user'
import { getToken, removeToken, setToken, setTimeStamp } from '@/utils/auth'
import { resetRouter } from '@/router'

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
    // 重置路由
    resetRouter()
    // 去设置权限模块下的路由为初始状态
    // Vuex 子模块怎么调用子模块的actions，都没加锁的情况下 可以随意调用
    // 不加命名空间的情况下 所有的mutations和actions都是挂载全局上的 可以直接调用
    // 但是加了命名空间的子模块 如何调用另外一个加了命名空间的子模块的mutations
    // 加了命名空间的context指的不是全局的context
    // mutations 名称 载荷 第三个参数 { root:true } 表示调用根级的mutations和actions
    context.commit('permission/setRoutes', [], { root: true })
  },

  async getUserInfo(context) {
    const res = await getUserInfo() // 用户的基本资料
    const baseInfo = await getUserDetailById(res.userId) // 获取头像
    const baseResult = { ...res, ...baseInfo } // 合并资料
    context.commit('setUserInfo', baseResult) // 提交到mutations
    return baseResult // 这里为什么要return呢 这里给我们后期做权限的时候留下的伏笔
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
