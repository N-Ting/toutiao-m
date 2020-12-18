// 搜索模块

// 导入axios实例
import request from '@/utils/request'

/* 定义封装获取搜索联想建议 */

export const getSearchSuggestion = q => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      q
    }
  })
}

// 定义一个封装获取搜索结果的方法

export const getSearchResult = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params
  })
}
