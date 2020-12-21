<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
  >
    <comment-item
      v-for="(item, index) in list"
      :key="index"
      :comment="item"
      @updata-commitLike="item.is_liking = $event"
    />
  </van-list>
</template>
<script>
import { getComment } from '@/api/comment'
import CommentItem from './comment-item'
export default {
  name: 'CommentList',
  // 组件
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      // 如果父组件不需要，默认值为空数组，数组和对象需要用函数
      default: () => []
    }
  },
  data() {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, // 用来获取下一页数据的时间戳
      limit: 10
    }
  },
  // 计算属性
  computed: {},
  // 监听
  watch: {},
  created() {},
  mounted() {},
  // 方法
  methods: {
    async onLoad() {
      try {
        // console.log(1)
        // 1.请求回去数据
        const { data } = await getComment({
          type: 'a', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source.toString(), // 源id，文章id或评论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })
        // console.log(data.data, 999)

        const { results } = data.data
        // 2.将数据添加到列表中
        this.list.push(...results)
        // T通过自定义事件将total_count传递给父组件
        // console.log(data.data, 88888)
        this.$emit('updata-data', data.data)
        // 3.将loading设置为false
        this.loading = false
        // 4.判断是否还有数据
        if (results.length) {
          //  有就更新获取下一页的数据页码
          this.offset = data.data.last_id
        } else {
          //  没有就将finished设置结束
          this.finished = true
        }
      } catch (err) {
        // this.$toast('获取评论失败，请稍后重试！')
      }
    }
  }
}
</script>
<style scoped lang="less"></style>
