// 封装axios请求模块

// 导入axios
import axios from 'axios'
// 导入store
import store from '@/store'
// 导入json-bigint第三方包
// json-bigint 会把超出 JS 安全整数范围的数字转为一个 BigNumber 类型的对象，对象数据是它内部的一个算法处理之后的，我们要做的就是在使用的时候转为字符串来使用。
import jsonBig from 'json-bigint'

// 创建一个axios实例
const request = axios.create({
  // 基础路径
  // baseURL: 'http://ttapi.research.itcast.cn/'
  // 通过 Axios 请求得到的数据都是 Axios 处理（JSON.parse）之后的，我们应该在 Axios 执行处理之前手动使用 json-bigint 来解析处理。Axios 提供了自定义处理原始后端返回数据的 API：transformResponse 。
  transformResponse: [
    function(data) {
      try {
        // 如果转换成功则返回转换的数据结果
        return jsonBig.parse(data) // 将josn格式的字符串转换为js对象
      } catch (err) {
        // 如果转换失败，则包装为统一数据格式并返回
        return { data }
      }
    }
  ]
})
// 请求拦截器
request.interceptors.request.use(
  function(config) {
    //  在发送请求之前做些什么
    //  config:本次请求的配置对象
    //  config里面有意属性:headers
    //  将state中的user解构出来
    const { user } = store.state
    //  如果里面有user并且有token这个属性
    if (user && user.token) {
      // 添加请求头
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // 要返回配置对象，否则请求就停留在这里出不去
    return config
  },
  function(error) {
    // 如果请求出错了（还没有发出去）会进入这里
    return Promise.reject(error)
  }
)

//  响应拦截器

// 导出axios实例
export default request
