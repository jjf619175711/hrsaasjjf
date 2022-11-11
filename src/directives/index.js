// 负责管理所有的自定义指令

export const imagerror = {
  // 指令对象
  inserted(dom, options) {
    // options 是指令中的变量的解释 其中有一个属性叫做 value
    // dom 表示当前的指令作用的对象
    // dom 认为此时就是图片
    // 当图片有地址 但是地址没有加载成功的时候 会报错 会触发图片的一个事件 onerror
    dom.error = function() {
      // 当图片出现异常的时候 会将指令配置的默认图片设置为该图片的内容
      // dom可以注册error事件
      dom.src = options.value // 这里不能写死
    }
  }
}
// <img v-imageerror="img" >
// data() { return { img: 'a.png' } }