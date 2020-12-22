// 文章评论模块
import request from '@/utils/request'

// 获取评论或评论回复基本信息
export const getComment = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/comments',
    // GET参数使用params进行传递
    // 我们写的时候是对象，但是最终发给后端的数据是？
    // axios会把params对象转换为key=value?key=value的根式放在url中
    params
  })
}

// 对评论或评论回复点赞
export const addCommentLike = target => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comment/likings',
    data: {
      target
    }
  })
}

// 取消对评论或评论回复点赞
export const deleteCommentLike = target => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/comment/likings/${target}`
  })
}

// 添加评论或评论回复
export const addComment = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comments',
    data
  })
}
