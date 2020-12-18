<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <!-- 这里不能直接将数组赋值，赋值后子组件的数组清空，但是父组件中的数据没有清空 -->
        <!-- <span @click="searchHistory = []">全部删除</span> -->
        <!-- 所以需要通过自定义事件来修改父组件中的数据 -->
        <span @click="$emit('clear-search-history')">全部删除</span>&nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon name="delete" v-else @click="isDeleteShow = true" />
    </van-cell>
    <van-cell
      :title="item"
      v-for="(item, index) in searchHistory"
      :key="index"
      @click="deleteSearchHistory(item, index)"
    >
      <van-icon name="close" v-show="isDeleteShow" />
    </van-cell>
  </div>
</template>
<script>
import { setItem } from '@/utils/storage'
export default {
  name: 'SearchHistory',
  // 组件
  components: {},
  props: {
    searchHistory: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      // 控制删除的显示与隐藏,默认不显示
      isDeleteShow: false
    }
  },
  // 计算属性
  computed: {},
  // 监听
  watch: {
    searchHistory(val) {
      setItem('TOUTIAO_HISTORY', val)
    }
  },
  created() {},
  mounted() {},
  // 方法
  methods: {
    deleteSearchHistory(item, index) {
      // 如果是删除状态
      if (this.isDeleteShow) {
        // 删除数组中当前的索引号
        this.searchHistory.splice(index, 1)
      } else {
        // 如果不是删除状态，就直接点击搜索
        this.$emit('search', item)
      }
    }
  }
}
</script>
<style scoped lang="less"></style>
