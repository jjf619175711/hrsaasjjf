// 考勤
import Layout from '@/layout'
export default {
// 路由规则
  path: '/attendances', // 路由地址
  name: 'attendances', // 给模块的一级路由加一个name属性 这个属性 我们后面会在做权限的时候用到
  component: Layout,
  children: [
    {
      // 二级路由的path什么都不用写的时候，此时它表示二级路由的默认路由
      path: '', // 这里不用谢 什么都不用写表示 /employess  不但有布局 layout => 员工主页
      component: () => import('@/views/attendances'),
      // 路由的元信息，气势就是一个储存数据的地方 可以放任何内容
      meta: {
        title: '考勤',
        icon: 'skill' // 这里为什么要用title 因为左侧导航读取了这里的title
      }
    }
  ]
}
