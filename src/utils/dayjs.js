// 导入Vue
import Vue from 'vue'

// 导入dayjs
import dayjs from 'dayjs'

// 加载中文语言包
import 'dayjs/locale/zh-cn'
// 导入relativeTime插件
import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)

// dayjs默认语言为英文，我们这里配置为中文
dayjs.locale('zh-cn') //  全局使用

// 定义一个全局过滤器，然后可以在任何组件的模板中使用
// 其实过滤器就相当于一个全局可用的方法（仅供模板中使用）
// 参数1：过滤器名称
// 参数2：过滤器函数
// 使用方式：{{表达式 | 过滤器名称}}
// |为管道符，管道符前面的表达式的结果会作为参数传递到过滤器函数中
// 过滤器的返回值会渲染到使用过滤器的模板位置
Vue.filter('relativeTime', value => {
  // 返回的是计算当前时间到传入的值的时间的相对时间
  return dayjs().to(dayjs(value))
})

// dayjs()获取当前最新时间
// console.log(dayjs().format('YYYY-MM-DD'))
// 处理相对时间
// console.log(dayjs().to(dayjs('2010'))) //11年前
