<template>
  <div class="article-list">
    <!-- success-duration成功提示的时间 refresh下拉刷新时会触发的函数-->
    <van-pull-refresh
      v-model="isRefreshLoading"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      success-duration="1500"
    >
      <!-- 通过 loading 和 finished 两个变量控制加载状态，当组件滚动到底部时，会触发 load 事件并将 loading 设置成 true -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <!-- 将article这个对象传递给article-item这个子组件 -->
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        >
        </article-item>
        <!-- <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 导入获取频道文章列表的方法
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'

export default {
  name: 'ArticleList',
  components: {
    // 注册
    ArticleItem
  },
  // 利用props接收首页传过来的数据
  props: {
    channel: {
      // 类型为对象
      type: Object,
      // 为必须的属性
      required: true
    }
  },
  data() {
    return {
      list: [], //  存储列表数据的数组
      loading: false, //  控制加载中loading状态
      finished: false, //  控制数据加载结束的状态
      timestamp: null, //  请求获取下一页的时间戳
      error: false, //  控制失败的提示状态
      isRefreshLoading: false, //  控制下拉刷新的loading状态
      refreshSuccessText: '刷新成功' //  下拉刷新成功提示文本
    }
  },
  methods: {
    // 监听组件滑倒底部的加载事件
    async onLoad() {
      try {
        // 请求获取数据
        const { data: res } = await getArticles({
          channel_id: this.channel.id, //  将从父组件获取到的频道id赋值
          // 请求第一页数据，传当前时间戳
          // 如果请求之后的数据，使用本次接口返回的数据中的pre_timestamp
          timestamp: this.timestamp || Date.now(), //  如果有时间戳就是原本的,否则获取到最新的时间戳
          with_top: 1 //  是否包含置顶，进入页面第一次请求时要包含置顶文章，1包含指定，0不包含
        })
        // 测试报错情况
        // 如果随机数大于0.5
        /*    if (Math.random() > 0.5) {
          // 就将一个不是json格式的字符串转换为对象，会报错
          JSON.parse('ahdfhlhsf')
        } */
        // console.log(res.data)
        const { results } = res.data
        // 将数组展开，并且把展开的数据添加到list数组中
        this.list.push(...results)
        // 本次数据加载结束之后要把加载状态设置为结束
        this.loading = false
        // 判断数据是否全部加载完成
        if (results.length) {
          // 如果还有数据，就更新获取下一页数据的时间戳
          this.timestamp = res.data.pre_timestamp //  将返回数据的时间戳保存到data里
        } else {
          // 没有数据了，就将finished设置为true，不再load更多
          this.finished = true
        }
      } catch (err) {
        // console.log(err)
        // 展示错误提示状态
        this.error = true
        // 请求失败了，加载状态设置为结束
        this.loading = false
      }
    },
    // 监听下拉刷新事件
    async onRefresh() {
      // console.log(1)

      try {
        // 1.请求获取数据
        const { data: res } = await getArticles({
          channel_id: this.channel.id, //  将从父组件获取到的频道id赋值
          // 请求第一页数据，传当前时间戳
          // 如果请求之后的数据，使用本次接口返回的数据中的pre_timestamp
          timestamp: Date.now(), //  下拉刷新，每次请求的都是最新数据，所以传递当前最新时间戳
          with_top: 1 //  是否包含置顶，进入页面第一次请求时要包含置顶文章，1包含指定，0不包含
        })
        // // 模拟随机失败
        // if (Math.random() > 0.2) {
        //   // 就将一个不是json格式的字符串转换为对象，会报错
        //   JSON.parse('ahdfhlhsf')
        // }
        // 将results从返回的数据中解构出来
        const { results } = res.data
        // 2.将数据追加到列表的顶部,unshift在数组的头部添加
        this.list.unshift(...results)
        // 3.关闭下拉刷新的loading状态
        this.isRefreshLoading = false

        // 更新下拉刷新成功的提示文本
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (err) {
        // console.log('请求失败', err)
        // 关闭loading状态
        this.isRefreshLoading = false
        // 下拉刷新失败
        this.refreshSuccessText = '刷新失败'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.article-list {
  // 百分比是相对于父元素的
  // height: 100%;
  height: 79vh;
  // 让浏览器决定如何处理内容在垂直方向发生的溢出
  overflow-y: auto;
}
</style>
