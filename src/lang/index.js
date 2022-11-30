// 多语言实例化文件
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookie from 'js-cookie' // 引入Cookie工具
import elementZH from 'element-ui/lib/locale/lang/zh-CN'
import elementEN from 'element-ui/lib/locale/lang/en'
import elementJA from 'element-ui/lib/locale/lang/ja'

import customZH from './zh'
import customEN from './en'
Vue.use(VueI18n) // 完成全局注册
export default new VueI18n({
  // i18n的选项
  locale: Cookie.get('language') || 'zh', // 当前的多语言的类型 随意定义的字符串  中文zh/英文en
  messages: {
    // 当前的语言包
    // elementUI的语言包 + 自定义语言包
    zh: { ...elementZH, ...customZH },
    en: { ...elementEN, ...customEN },
    ja: { ...elementJA }
  }
})
