<template>
  <van-button
    round
    size="small"
    v-if="value"
    @click="onFollow"
    :loading="loading"
    >已关注</van-button
  >
  <van-button
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    v-else
    @click="onFollow"
    :loading="loading"
    >关注</van-button
  >
</template>
<script>
import { addFollow, deleteFollow } from '@/api/user'
export default {
  name: 'FollowUser',
  // 组件
  components: {},
  props: {
    value: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      // 控制按钮加载状态
      loading: false
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
    async onFollow() {
      // 点击按钮时设置为加载中
      this.loading = true
      try {
        // console.log(1)
        // 如果是已关注状态
        if (this.value) {
          // console.log(this.article.aut_id, 123)
          // 就发送取消关注用户请求
          await deleteFollow(this.userId)
          //   // 将关注状态设置为false
          //   // this.article.is_followed = false
        } else {
          // console.log(45)
          // 未关注状态
          await addFollow(this.userId)
          //   // 将关注状态设置为true
          // this.article.is_followed = true
        }
        // this.article.is_followed = !this.article.is_followed
        this.$emit('input', !this.value)
      } catch (err) {
        // console.log(err)
        let message = '请求失败，请稍后重试'
        // 如果有错误响应并且错误响应为400，表示关注了自己
        if (err.response && err.response.status === 400) {
          message = '你不能关注你自己'
        }
        this.$toast(message)
      }
      // 请求发送成功或失败，结束加载
      this.loading = false
    }
  }
}
</script>
<style scoped lang="less"></style>
