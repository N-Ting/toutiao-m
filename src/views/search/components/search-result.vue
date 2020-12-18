<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onLoad"
    >
      <van-cell
        v-for="(item, index) in list"
        :key="index"
        :title="item.title"
      />
    </van-list>
  </div>
</template>
<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'SearchResult',
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
      // 获取搜索结果的数组
      list: [],
      loading: false,
      finished: false,
      error: false,
      // 页码
      page: 1,
      // 每页的大小
      perPage: 10
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
        // 1.请求获取数据
        const { data } = await getSearchResult({
          page: this.page, //  页码
          per_page: this.perPage, // 每页大小
          q: this.searchText // 查询关键字
        })
        // 测试报错情况
        // 如果随机数大于0.5
        // if (Math.random() > 0.5) {
        //   // 就将一个不是json格式的字符串转换为对象，会报错
        //   JSON.parse('ahdfhlhsf')
        // }
        // console.log(data)
        const { results } = data.data
        // 2. 将数据添加到数组列表中
        // 使用push是将获取到的数据推进数组中,如果直接赋值,是直接覆盖
        this.list.push(...results)
        // 3.将本次加载中的loading关闭
        this.loading = false
        // 4.判断是否还有数据
        // 如果结果的长度为真,则表示还有数据
        if (results.length) {
          //  如果有,则更新获取下一个数据的页码
          this.page++
        } else {
          //  如果没有,则将finished设置成true
          this.finished = true
        }
      } catch (err) {
        // 展示错误提示状态
        this.error = true
        // 请求失败了，加载状态设置为结束
        this.loading = false
      }
    }
  }
}
</script>
<style scoped lang="less"></style>
