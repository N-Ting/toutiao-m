// 文章接口模块
// 导入axios
import request from '@/utils/request'

// 获取频道的文章列表
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    // 请求参数
    params
  })
}
