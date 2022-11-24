// 权限拦截再跳转路由  导航守卫

import router from '@/router'
import store from '@/store' // 引入store实例 和组件中的this.store是一回儿事
import NProgress from 'nprogress' // 引入进度条
import 'nprogress/nprogress.css' // 引入进度条样式

// 不需要到处 因为只需要让代码执行即可

// 前置守卫
// next是前置守卫必须要执行的钩子 next必须执行 如果不执行 页面就死了
// next() 放过
// next(false) 跳转终止
// next(地址) 跳转某个地址
const whileList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  if (store.getters.token) {
    if (to.path === '/login') {
      // 有token的情况下 才能获取资料
      // 如果要访问的是 登录页
      next('/') // 跳到主页  有token 不用处理
    } else {
      // 只有放过的时候才获取用户资料
      // 每次都获取吗
      // 如果当前vuex有用户的资料id 表示已经有资料了 不需要获取了
      if (!store.getters.userId) {
        // 如果没有id  才表示当用户资料没有获取过
        // async函数 所return的内容await就能接收到
        const { roles } = await store.dispatch('user/getUserInfo')
        // 筛选用户的可用路由
        const data = await store.dispatch('permission/filterRoutes', roles.menus)// 筛选得到当前用户可用的动态路由
        // data就是筛选得到的动态路由
        // 动态路由 添加到路由表中 默认的路由表 只有静态路由表 没有动态路由表
        // addRoutes 必须用next(地址) 不能直接next()
        router.addRoutes(data)// 添加动态路由到路由表
        // 添加动态路由之后 执行next
        next(to.path)// 相当于跳到对应的地址 相当于多做一次跳转  为什么要多做一次跳转
        // 进门了，但是进门后我要去的地方路还没铺好，直接走，掉坑里，
        // 多做一次跳转，再从门外往里近义词 跳转之前 把路铺好 再次进来的时候 路就铺好了
      } else {
        next()
      }
    }
  } else {
    // 没有token的情况
    if (whileList.includes(to.path)) {
      // 表示要去的地址再白名单
      next()
    } else {
      next('/login')
    }
  }
  NProgress.done() // 解决手动切换地址时 进度条不关闭的问题
})

// 后置守卫
router.afterEach(() => {
  NProgress.done()
})
