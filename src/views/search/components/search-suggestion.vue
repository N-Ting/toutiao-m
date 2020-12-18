<template>
  <div class="search-suggeation">
    <!-- 通过点击事件 $emit设置自定义事件 -->
    <van-cell
      icon="search"
      v-for="(suggestion, index) in suggestions"
      :key="index"
      @click="Onsearch(suggestion)"
    >
      <!-- 使用插槽，自定义左侧标题内容 -->
      <!-- 不要修改原有得数据，所以定义一个方法将suggestion作为参数传入 -->
      <span slot="title" v-html="highlight(suggestion)"></span>
    </van-cell>
    <!-- 双括号绑定会直接输出文本 -->
    <!-- <div>{{ htmlStr }}</div> -->
    <!-- 使用v-html指令可以绑定渲染带有HTML标签得字符串 -->
    <!-- <div v-html="htmlStr"></div> -->
  </div>
</template>
<script>
// 导入获取搜索接口方法
import { getSearchSuggestion } from '@/api/search'
// lodash 支持按需加载，有利于打包结果优化
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  // 组件
  components: {},
  props: {
    searchText: {
      // 类型为字符串
      type: String,
      required: true
    }
  },
  data() {
    return {
      htmlStr: 'Hello <span style="color: red">World</span>',
      // 保存联想建议数据
      suggestions: []
    }
  },
  // 计算属性
  computed: {},
  // 监听
  watch: {
    searchText: {
      // debounce函数
      // 参数1：函数
      // 参数2：防抖时间
      // 返回值：防抖之后得函数，和参数1功能一样
      handler: debounce(function(val) {
        // console.log(val)
        // 调用获取联想建议数据得方法，并将输入框得值传入
        this.loadSearchSuggestion(val)
      }, 200),
      // 因为当值第一次绑定的时候，不会执行监听函数，只有值发生改变才会执行
      // 这里我们需要在最初绑定值得时候页执行函数，所以需要用到immediate
      immediate: true // 首次监听触发
    }
  },
  created() {},
  mounted() {},
  // 方法
  methods: {
    // 封装获取方法
    async loadSearchSuggestion(q) {
      try {
        // 发送请求
        const { data } = await getSearchSuggestion(q)
        // 将获取得数据保存到data里
        this.suggestions = data.data.options
        console.log(this.suggestions)
      } catch (err) {
        this.$toast('获取失败！')
      }
    },
    highlight(suggestion) {
      const highlight = `<span style="color:#3296fa">${this.searchText}</span>`
      //  正则表达式//中间得内容都会当作匹配字符来使用，而不是数据变量
      // 如果需要根据数据变量动态得创建正则表达式，则手动new RegExp

      // RegExp正则表达式构造函数
      // 参数1：匹配模式字符串，它会根据这个字符串创建正则对象
      // 参数2：匹配模式，要写到字符串中，gi表示全局，忽略大小写
      const reg = new RegExp(this.searchText, 'gi')
      return suggestion.replace(reg, highlight)
    },
    Onsearch(suggestion) {
      // console.log(2222)
      this.$emit('search', suggestion)
    }
  }
}
</script>
<style scoped lang="less"></style>
