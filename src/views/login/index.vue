<template>
  <div class="login-container">
    <van-nav-bar title="登录" class="page-nav-bar">
      <!-- 只有传递了redirect这样一个参数,才显示返回按钮 -->
      <van-icon
        v-if="$route.query.redirect"
        slot="left"
        name="cross"
        @click="$router.back()"
      />
    </van-nav-bar>
    <!-- 表单 -->
    <van-form ref="loginForm" @submit="onSubmit">
      <van-field
        placeholder="请输入手机号"
        v-model="user.mobile"
        clearable
        name="mobile"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="iconfont icon-shouji"></i>
      </van-field>
      <!-- 验证码 -->
      <van-field
        type="number"
        name="code"
        placeholder="请输入验证码"
        v-model="user.code"
        :rules="userFormRules.code"
        maxlength="6"
      >
        <template #button>
          <!-- 监听finish事件，倒计时结束后，隐藏 -->
          <van-count-down
            v-if="isCountDownShow"
            format="ss s"
            :time="1000 * 5"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            size="small"
            class="send-sms-btn"
            type="default"
            round
            native-type="button"
            @click="onSendSms"
            >获取验证码
          </van-button>
        </template>
        <i slot="left-icon" class="iconfont icon-yanzhengma"></i>
      </van-field>
      <div class="login-btn-wrap">
        <!-- 按钮在默认情况下为行内块级元素，通过 block 属性可以将按钮的元素类型设置为块级元素。 -->
        <van-button block type="info" native-type="submit" class="login-btn"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
// 导入请求接口
import { login, sendSms } from '@/api/user.js'
export default {
  name: 'LoginPage',
  data() {
    return {
      // 表单数据
      user: {
        mobile: '',
        code: ''
      },
      // 表单验证规则
      userFormRules: {
        mobile: [
          {
            required: true,
            message: '手机号不能为空'
          },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: '手机号格式错误'
          }
        ],
        code: [
          {
            required: true,
            message: '验证码不能为空'
          },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      },
      // 用来控制倒计时得显示和隐藏
      isCountDownShow: false
    }
  },
  created() {
    console.log(this.$route)
  },
  methods: {
    // 监听表单得提交事件
    async onSubmit() {
      //  获取表单数据
      const user = this.user
      // 提交表单请求登录
      this.$toast.loading({
        duration: 0, //  持续事件，默认2000， 0表示持续展示不停止
        forbidClick: true, //  是否禁止背景点击
        message: '登录中...' //  提示消息
      })
      //  try{}catch可以捕获错误
      try {
        const res = await login(user)
        console.log('登录成功', res)
        // 登录成功后，将返回的token信息存储到state共享数据容器中
        // 利用commit触发mutations里的函数
        this.$store.commit('setUser', res.data.data)
        this.$toast.success('登录成功')
        // this.$router.back()
        // 从哪里来的登录后跳转回原来的位置
        // 携带一个你来自哪里的参数。redirect这个参数名可以身边写
        // 判断是否有this.$router.query.redirect
        // 有的话跳转回redirect，没有就跳转到首页
        // 登录成功后将layout缓存抹掉
        this.$store.commit('removeCachePage', 'layout')
        this.$router.push(this.$route.query.redirect || '/')
      } catch (err) {
        if (err.response.status === 400) {
          console.log('登录失败', err)
          this.$toast.fail('登录失败，手机号或验证码错误！')
        } else {
          this.$toast.fail('登录失败，请稍后重试')
        }
      }
    },
    // 监听发送验证码事件
    async onSendSms() {
      // console.log('onsendsms')
      // 校验手机号
      try {
        // validate里面传参表示值验证传入的，返回的时promise，'mobile'表示name属性值
        await this.$refs.loginForm.validate('mobile')
        console.log('验证通过')
      } catch (err) {
        return console.log('验证失败', err)
      }
      // 显示倒计时
      this.isCountDownShow = true

      //  请求发送验证码
      try {
        await sendSms(this.user.mobile)
        // console.log('发送成功')
        this.$toast.success('发送成功')
      } catch (err) {
        // 失败，隐藏倒计时
        this.isCountDownShow = false
        // console.log(err)
        if (err.response.status === 429) {
          this.$toast.fail('发送太频繁了，请稍后重试')
        } else {
          this.$toast.fail('发送失败，请稍后重试')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.iconfont {
  font-size: 37px;
}
.send-sms-btn {
  padding: 0;
  width: 152px;
  height: 46px;
  line-height: 46px;
  background-color: #ededed;
  font-size: 22px;
  color: #666;
}
.login-btn-wrap {
  padding: 53px 33px;
  .login-btn {
    background-color: #6db4fb;
    border: none;
  }
}
</style>
