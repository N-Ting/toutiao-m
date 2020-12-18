// 封装axios请求模块

// 导入axios
import axios from 'axios'
// 导入store
import store from '@/store'

// 创建一个axios实例
const request = axios.create({
  // 基础路径
  // baseURL: 'http://ttapi.research.itcast.cn/'
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
