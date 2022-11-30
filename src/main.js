import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import components from './components'
import * as directives from '@/directives'
import * as filters from '@/filters'
import i18n from '@/lang'
import CheckPermission from './mixin/checkPermission'
import '@/icons' // icon
import '@/permission' // permission control

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI, {
//   // element本身支持i18n的处理
//   // 此时i18n就会根据当前的locale属性去寻找对应的显示内容
//   i18n: (key, value) => i18n.t(key, value) // t 方法 回去对应的语言包里寻找对应的内容
// })
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

Vue.use(components)

// 表示所有的组件都有了一个检查的方法
Vue.mixin(CheckPermission)

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
