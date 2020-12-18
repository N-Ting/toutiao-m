<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <!-- fixed固定在顶部 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        icon="search"
        class="search-btn"
        round
        type="info"
        slot="title"
        size="small"
        to="/search"
      >
        搜索
      </van-button>
    </van-nav-bar>
    <!-- 频道列表 -->
    <!-- 通过 v-model 绑定当前激活标签对应的索引值，默认情况下启用第一个标签。 -->
    <!-- animated开启切换标签哦内容时的准长动画 swipeable可以开启滑动切换标签页。-->
    <van-tabs
      class="channel-tabs"
      v-model="active"
      animated
      swipeable
      swipe-threshold
    >
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <!-- 频道列表文章 -->
        <article-list :channel="channel" />
        <!-- /频道列表文章 -->
      </van-tab>
      <!-- 添加路由占位符充当内容区域 -->
      <!-- nav-right标题右侧内容 -->
      <div slot="nav-right" class="placeholder"></div>
      <!-- 使用插槽插入汉堡按钮 -->
      <div slot="nav-right" class="hamburger-btn" @click="showPopup">
        <i class="iconfont icon-gengduo"></i>
      </div>
    </van-tabs>
    <!-- /频道列表 -->
    <!-- 弹出层 -->
    <van-popup
      v-model="show"
      position="bottom"
      closeable
      :style="{ height: '100%' }"
      close-icon-position="top-left"
    >
      <!-- 自定义属性绑定需要接收的数据 -->
      <!-- @updata-active自定义事件 -->
      <channel-edit
        :myChannels="channels"
        :active="active"
        @updata-active="onUpdataAdd"
      ></channel-edit>
    </van-popup>
    <!-- /弹出层 -->
  </div>
</template>

<script>
// 导入获取频道列表的方法
import { getUserChannels } from '@/api/user'
// 导入ArticleList组件
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
// 导入本地存储模块
import { getItem } from '@/utils/storage'
export default {
  name: 'home',
  components: {
    // 注册组件
    ArticleList,
    ChannelEdit
  },
  data() {
    return {
      // 激活标签对应的索引值
      active: 0,
      //  定义数组接受频道列表
      channels: [],
      // 默认不展示弹出层
      show: false
    }
  },
  created() {
    //  在这里可以最早获取到频道列表
    this.loadChannels()
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    // 监听加载频道列表数据的方法
    async loadChannels() {
      try {
        // //  请求成功后，将数据到存到data里
        // this.channels =
        // console.log(this.channels)
        // 定义一个空数组
        let channels = []
        // 判断是否登录
        if (this.user) {
          // 已登录
          //  发送获取用户自己频道信息的请求
          const { data: res } = await getUserChannels()
          // 请求成功，将数据保存到channels数组里
          channels = res.data.channels
        } else {
          // 未登录
          // 定义一个常量用来接收本地存储中的数据
          const localChannels = getItem('TOUTIAO_CHANNEL')
          // 判断本地存储中是否有数据
          if (localChannels) {
            // 有数据，就从本地中获取，将本地中的数据赋值给数组
            channels = localChannels
          } else {
            // 没有数据
            // 获取默认频道列表
            const { data: res } = await getUserChannels()
            channels = res.data.channels
          }
        }
        // 将获取到的数据赋值给data里的channels
        this.channels = channels
      } catch (err) {
        this.$toast('获取频道列表数据失败')
      }
    },
    // 监听点击汉堡按钮
    showPopup() {
      // 显示弹出框
      this.show = true
    },
    // 第二个参数时es6新增的，如果你传了参数就是传的值，如果没有传就默认为true
    onUpdataAdd(index, show = true) {
      // 让当前的激活高亮的所有值，等于点击时传入的下标
      this.active = index
      // 关闭弹出框
      this.show = show
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  /deep/ .channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
      height: 82px;
    }
    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      .van-tab__text {
        font-size: 30px;
        color: #777777;
      }
    }

    .van-tab--active .van-tab__text {
      color: #333 !important;
    }
    .van-tabs__line {
      width: 31px !important;
      height: 6px;
      background: rgba(50, 150, 250, 1);
      border-radius: 3px;
      bottom: 8px;
    }
    .van-tabs__nav {
      padding: 0;
    }
  }
  .placeholder {
    //flex-shrink默认值是1，代表当父亲装不下时会收缩 0代表不收缩
    flex-shrink: 0;
    width: 66px;
    height: 82px;
  }
  .hamburger-btn {
    // 固定定位
    position: fixed;
    right: 0;
    display: flex;
    // 水平居中
    justify-content: center;
    // 垂直居中
    align-items: center;
    width: 66px;
    height: 82px;
    background-color: #fff;
    // 透明度
    opacity: 0.902;
    i.iconfont {
      font-size: 33px;
    }
    &:before {
      content: '';
      position: absolute;
      left: 0;
      width: 1px;
      height: 100%;
      background-image: url(~@/assets/gradient-gray-line.png);
      background-size: contain;
    }
  }
}
</style>
