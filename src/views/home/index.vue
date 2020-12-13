<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar">
      <van-button
        icon="search"
        class="search-btn"
        round
        type="info"
        slot="title"
        size="small"
      >
        搜索
      </van-button>
    </van-nav-bar>
    <!-- 频道列表 -->
    <!-- 通过 v-model 绑定当前激活标签对应的索引值，默认情况下启用第一个标签。 -->
    <!-- animated开启切换标签哦内容时的准长动画 swipeable可以开启滑动切换标签页。-->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab :title="item.name" v-for="item in channels" :key="item.id"
        >{{ item.name }}的内容</van-tab
      >
      <!-- 添加路由占位符充当内容区域 -->
      <!-- nav-right标题右侧内容 -->
      <div slot="nav-right" class="placeholder"></div>
      <!-- 使用插槽插入汉堡按钮 -->
      <div slot="nav-right" class="hamburger-btn">
        <i class="iconfont icon-gengduo"></i>
      </div>
    </van-tabs>
    <!-- /频道列表 -->
  </div>
</template>

<script>
// 导入获取频道列表的方法
import { getUserChannels } from '@/api/user'
export default {
  name: 'home',
  data() {
    return {
      // 激活标签对应的索引值
      active: 0,
      //  定义数组接受频道列表
      channels: []
    }
  },
  created() {
    //  在这里可以最早获取到频道列表
    this.loadChannels()
  },
  methods: {
    // 监听加载频道列表数据的方法
    async loadChannels() {
      try {
        //  发送获取用户自己频道信息的请求
        const { data: res } = await getUserChannels()
        //  请求成功后，将数据到存到data里
        this.channels = res.data.channels
        console.log(this.channels)
      } catch (err) {
        this.$toast('获取频道列表数据失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
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
    //flex-shrink默认值是1，代表当父亲装不下时，会收缩 0代表不收缩
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
