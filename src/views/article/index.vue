<template>
  <div class="article-container">文章列表详情</div>
</template>
<script>
export default {
  name: 'Article',
  // 组件
  components: {},
  props: {
    articleId: {
      // 直接复制地址跳转是字符串，通过文章列表跳转为数字
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {}
  },
  // 计算属性
  computed: {},
  // 监听
  watch: {},
  created() {},
  mounted() {},
  // 方法
  methods: {}
}
</script>
<style scoped lang="less"></style>
