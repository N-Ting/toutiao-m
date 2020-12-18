<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!-- show-action是否展示右侧取消按钮 -->
    <!-- focus获取焦点，隐藏搜索结果 -->
    <!-- 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS
    输入法中显示搜索按钮。 -->
    <form action="/" class="search-form">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>
    <!-- 搜索结果-->
    <search-result v-if="isResultShow" :searchText="searchText"></search-result>
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      n
      @search="onSearch"
      :searchText="searchText"
    ></search-suggestion>
    <!-- /联想建议 -->
    <!-- 搜索历史 -->
    <search-history
      v-else
      :search-history="searchHistory"
      @search="onSearch"
      @clear-search-history="searchHistory = []"
    ></search-history>
    <!-- /搜索历史 -->
  </div>
</template>
<script>
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'
import { getItem } from '@/utils/storage'
export default {
  name: 'search',
  // 组件
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  props: {},
  data() {
    return {
      // 绑定输入框内容
      searchText: '',
      // 控制搜索结果是否显示
      isResultShow: false,
      // 添加一个数组用来存储历史记录
      searchHistory: getItem('TOUTIAO_HISTORY') || []
    }
  },
  // 计算属性
  computed: {},
  // 监听
  watch: {
    // 在子组件中监视输入框内容的变化
    searchText: {
      handler(val) {}
    }
  },
  created() {},
  mounted() {},
  // 方法
  methods: {
    // 点击键盘上的搜索或者回车按钮触发的事件
    onSearch(val) {
      // console.log(val)
      // 将传入的值赋值给输入框内容
      this.searchText = val

      // 存储搜索历史记录
      // 期望最新的值在前面，且不重复
      // indexOf()是用来查找与输入的内容相等的值，返回它的索引值
      const index = this.searchHistory.indexOf(val)
      // 如果index不等于-1，则表示当前数组中有了这个值
      if (index !== -1) {
        // 删除当前数组中的元素
        this.searchHistory.splice(index, 1)
      }
      // 将输入的内容添加进历史记录数组中的第一个
      this.searchHistory.unshift(val)
      // 展示搜索结果
      this.isResultShow = true
    },
    onCancel() {
      this.$router.back()
    }
  }
}
</script>
<style scoped lang="less">
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
