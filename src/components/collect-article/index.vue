<template>
  <van-icon
    :color="value ? '#ffa500' : ''"
    :name="value ? 'star' : 'star-o'"
    @click="onCollect"
    :loading="loading"
  />
</template>
<script>
import { addCollect, deleteCollect } from '@/api/article'
export default {
  name: 'CollectArticle',
  // 组件
  components: {},
  props: {
    value: {
      type: Boolean,
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
    // 监听点击收藏按钮事件
    async onCollect() {
      this.loading = true
      try {
        // 如果is_collected为true
        if (this.value) {
          // 发送取消收藏请求
          await deleteCollect(this.articleId)
        } else {
          // 如果为false就发送收藏请求
          await addCollect(this.articleId)
        }
        // 向父组件传递一个默认为input的自定义事件，参数为!this.value
        this.$emit('input', !this.value)
        this.$toast.success(this.value ? '取消收藏' : '收藏成功')
      } catch (err) {
        // console.log(err);
        this.$toast('操作失败，请重试')
      }

      // 请求结束，关闭加载状态
      this.loading = false
    }
  }
}
</script>
<style scoped lang="less"></style>
