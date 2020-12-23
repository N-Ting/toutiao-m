// 封装axios请求模块

// 导入axios
import axios from 'axios'
// 导入store
import store from '@/store'
// 导入json-bigint第三方包
// json-bigint 会把超出 JS 安全整数范围的数字转为一个 BigNumber 类型的对象，对象数据是它内部的一个算法处理之后的，我们要做的就是在使用的时候转为字符串来使用。
import jsonBig from 'json-bigint'
import { Toast } from 'vant'
// import router from '@/router'
import { redirectLogin } from './redirectLogin'

// 创建一个axios实例
const request = axios.create({
  // 基础路径
  // baseURL: 'http://ttapi.research.itcast.cn',
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
// 专门用来获取token的的请求
const requestToken = axios.create()

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

// 响应拦截器,统一处理错误
request.interceptors.response.use(
  function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  async function(error) {
    const status = error.response.status
    if (status === 400) {
      Toast.fail('客户端请求参数错误')
    } else if (status === 401) {
      // 无效token
      // Toast.fail('无效的TOKEN')
      // 用refresh_token获取新的token
      // 因为refresh_token存储在store.state中的user里
      const { user } = store.state
      // 如果没有user或者没有刷新token
      if (!user || !user.refresh_token) {
        // 直接跳转到登录页面
        // 在组件里才是this.$router
        // 直接将router拿过来在js文件里
        // 因为push会保留历史记录
        // router.push('/login')
        // 登录理由没有必要保留历史记录所有用replace
        // return router.replace('/login')

        // console.log(router)
        // return false
        return redirectLogin()
      }

      try {
        // 用refresh_token去获取新的token
        // 直接用现有的request去请求,假如请求的结果还是401,会形成死循环，所以需要另外定义一个requestToken的axios
        const { data } = await requestToken({
          method: 'PUT',
          url: '/app/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${user.refresh_token}`
          }
        })
        // 将获取过来的refresh_token赋值给user.token
        user.token = data.data.token
        // 用新的token更新store里面的无效的token
        store.commit('setUser', user)
        // 把之前的错误请求重新完整的再发一次
        // console.dir(error)
        // error.config里能够获取到上一次的请求信息
        // 这里发送请求,带过去的token确实时无效的token,但是没关系,因为这个请求会经过自己的请求拦截器
        // 自己的请求拦截器里面会有重新获取的token的操作
        // 发送的是错误的信息，但是又会走request请求，request里又做了获取token的操作
        return request(error.config)
      } catch (err) {
        // 用refresh_token换取token出错,重新登录下
        return redirectLogin()
      }
    } else if (status === 403) {
      Toast.fail('客户端没有权限')
    } else if (status === 404) {
      Toast.fail('请求资源不存在')
    } else if (status === 405) {
      Toast.fail('请求方法不支持')
    } else if (status >= 500) {
      Toast.fail('服务器抽风了')
    }

    return Promise.reject(error)
  }
)

// // 将跳转到登录页面的，再回原来的位置封装成一个方法
// function redirectLogin() {
//   // router.currentRoute里可以拿到跳转过来的路径
//   router.replace({
//     name: 'login', // 根据名称跳转
//     query: {
//       redirect: router.currentRoute.fullPath // 在fullPath里可以拿到跳转过来的路径
//     }
//   })
// }
//  响应拦截器

// 导出axios实例
export default request
