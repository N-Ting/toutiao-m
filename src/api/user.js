// /*
//   用户相关的请求模块
// */
import request from '@/utils/request'
// import store from '@/store'
// /*
//   用户登录
// */
export const login = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data
  })
}
// 获取短信验证码
export const sendSms = mobile => {
  return request({
    method: 'Get',
    url: `/app/v1_0/sms/codes/${mobile}`
  })
}
// 获取用户自己的信息
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user'

    //  发送请求头数据
    //  该接口需要授权才能访问
    //  token的数据格式:Bearer token数据,注意Bearer后面有个空格
    //  token值存放在store中
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}

// 获取用户频道列表
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}
