<template>
  <van-icon
    :color="value === 1 ? 'red' : ''"
    :name="value === 1 ? 'good-job' : 'good-job-o'"
    :loading="loading"
    @click="onlikeArticle"
  />
</template>
<script>
import { addLikeArticle, deleteLikeArticle } from '@/api/article'
export default {
  name: 'likeArticle',
  // 组件
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
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
    async onlikeArticle() {
      this.loading = true
      let attitude = -1
      try {
        if (this.value === 1) {
          console.log(111)
          await deleteLikeArticle(this.articleId)
          this.$toast.success('取消点赞')
        } else {
          await addLikeArticle(this.articleId)
          attitude = 1
          this.$toast.success('点赞成功')
        }
        this.$emit('input', attitude)
      } catch (err) {
        this.$toast.fail('操作失败')
      }
    }
  }
}
</script>
<style scoped lang="less"></style>
