<template>
  <div class="my-container">
    <!-- 已登陆 -->
    <div class="header user-info" v-if="user">
      <!-- 基本信息 -->
      <div class="base">
        <div class="left">
          <van-image round :src="userInfo.photo" class="avatar" />
          <span class="name">{{ userInfo.name }}</span>
        </div>
        <div class="right">
          <van-button size="mini" type="default" round>编辑资料</van-button>
        </div>
      </div>
      <!-- 粉丝/关注 -->
      <div class="data">
        <div class="data-item">
          <span>{{ userInfo.art_count }}</span>
          <span>头条</span>
        </div>
        <div class="data-item">
          <span>{{ userInfo.follow_count }}</span>
          <span>关注</span>
        </div>
        <div class="data-item">
          <span>{{ userInfo.fans_count }}</span>
          <span>粉丝</span>
        </div>
        <div class="data-item">
          <span>{{ userInfo.like_count }}</span>
          <span>获赞</span>
        </div>
      </div>
    </div>
    <!-- 未登录 -->
    <div class="header not-login" v-else>
      <div
        class="login-btn"
        @click="
          $router.push({
            name: 'login',
            query: {
              redirect: '/my'
            }
          })
        "
      >
        <img class="mobile-img" src="~@/assets/mobile.png" />
        <span class="text">登录 / 注册</span>
      </div>
    </div>
    <!-- 宫格导航 -->
    <van-grid class="grid-nav" :column-num="2">
      <van-grid-item class="grid-item">
        <i slot="icon" class="iconfont icon-shoucang"></i>
        <span class="text" slot="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="iconfont icon-lishi"></i>
        <span class="text" slot="text">历史</span>
      </van-grid-item>
    </van-grid>

    <!-- 单元格导航 -->
    <van-cell title="消息通知" is-link />
    <van-cell title="小智同学" is-link />
    <van-cell
      class="logout-cell"
      title="退出登录"
      clickable
      v-if="user"
      center
      @click="onLogouts"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'

// 导入获取用户信息的接口
import { getUserInfo } from '@/api/user'
export default {
  name: 'my',
  data() {
    return {
      //  定义一个对象用来保存用户信息
      userInfo: {}
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    //  初始化的时候,如果用户登录了,我才请求获取当前登录用户的信息
    if (this.user) {
      this.loadUser()
    }
  },
  methods: {
    // 监听退出事件
    onLogouts() {
      // 退出提示
      // 在组件中需要使用this.$dialog来调用弹框组件
      this.$dialog
        .confirm({
          title: '确认退出吗?'
        })
        .then(() => {
          // 确认
          // 确认退出: 清楚登录状态(容器中的user + 本地存储中的user)
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          console.log('取消执行这里')
        })
    },
    // 监听获取用户信息的事件
    async loadUser() {
      try {
        //  发送请求
        const { data: res } = await getUserInfo()
        // 成功将获取过来的数据保存到data中
        this.userInfo = res.data
        console.log(this.userInfo)
      } catch (err) {
        console.log(err)
        // 失败
        this.$toast('获取数据失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.my-container {
  > .header {
    width: 750px;
    height: 401px;
    background: url('~@/assets/banner.png') no-repeat;
    background-size: cover;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-self: center;
      align-items: center;
      .mobile-img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }
  .user-info {
    // background: red;
    .base {
      height: 231px;
      padding: 76px 32px 23px;
      // background-color: #ccc;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          border: 2px solid #fff;
        }
        .name {
          font-size: 29px;
          margin-left: 22px;
        }
      }
    }
  }
  .data {
    display: flex;
    justify-content: space-around;
    .data-item {
      height: 130px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #fff;
      span:nth-child(1) {
        font-size: 36px;
        margin-bottom: 15px;
      }
      span:nth-child(2) {
        font-size: 23px;
      }
    }
  }
  .grid-nav {
    background-color: #fff;
    .grid-item {
      height: 141px;

      .iconfont {
        font-size: 45px;
      }
      .icon-shoucang {
        color: #eb5253;
      }
      .icon-lishi {
        color: #ff9d1d;
      }
      .text {
        color: #000;
        margin-top: 8px;
        font-size: 28px;
      }
    }
  }
  .logout-cell {
    height: 100px;
    text-align: center;
    color: #eb5253;
    margin: 10px 0;
    font-size: 30px;
  }
}
</style>
