<template>
  <div class="user-profile">
    <input type="file" hidden ref="inputRef" @change="inputChange" />
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->
    <!-- 个人信息 -->
    <van-cell title="头像" is-link @click="$refs.inputRef.click()">
      <van-image class="avatar" fit="cover" round :src="user.photo" />
    </van-cell>
    <van-cell
      title="昵称"
      :value="user.name"
      is-link
      @click="isUserNameshow = true"
    />
    <van-cell
      title="性别"
      :value="user.gender === 0 ? '男' : '女'"
      is-link
      @click="isUserGendershow = true"
    />
    <van-cell
      title="生日"
      :value="user.birthday"
      is-link
      @click="isUserBirthdayshow = true"
    />
    <!-- /个人信息 -->

    <!-- 昵称弹出层 -->
    <van-popup
      v-model="isUserNameshow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <updata-name
        v-if="isUserNameshow"
        @closePost="isUserNameshow = false"
        v-model="user.name"
      />
    </van-popup>
    <!-- /昵称弹出层 -->

    <!-- 编辑性别弹出层 -->
    <van-popup
      v-model="isUserGendershow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <updata-gender
        v-if="isUserGendershow"
        v-model="user.gender"
        @close="isUserGendershow = false"
      />
    </van-popup>
    <!-- /编辑性别弹出层 -->
    <!-- 编辑生日弹出层 -->
    <van-popup
      v-model="isUserBirthdayshow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <updata-birthday
        v-if="isUserBirthdayshow"
        v-model="user.birthday"
        @close="isUserBirthdayshow = false"
      />
    </van-popup>
    <!-- /编辑生日弹出层 -->
    <!-- 编辑头像弹出框 -->
    <van-popup
      v-model="isUserAvatarshow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <updata-avatar
        v-if="isUserAvatarshow"
        v-model="user.birthday"
        @close="isUserAvatarshow = false"
        :img="imgUrl"
      />
    </van-popup>
    <!-- /编辑头像弹出框 -->
  </div>
</template>
<script>
import { getUserProfile } from '@/api/user'
import UpdataName from './component/updata-name'
import UpdataGender from './component/updata-gender'
import UpdataBirthday from './component/updata-birthday'
import updataAvatar from './component/updata-avatar'
export default {
  name: 'UserProfile',
  // 组件
  components: {
    UpdataName,
    UpdataGender,
    UpdataBirthday,
    updataAvatar
  },
  props: {},
  data() {
    return {
      // 用户的个人信息
      user: {},
      // 显示昵称弹出层
      isUserNameshow: false,
      // 控制是否显示性别弹出层
      isUserGendershow: false,
      // 控制是否显示生日弹出层
      isUserBirthdayshow: false,
      // 控制是否显示头像弹出层
      isUserAvatarshow: false,
      imgUrl: {
        type: [String, Object]
      }
    }
  },
  // 计算属性
  computed: {},
  // 监听
  watch: {},
  created() {
    this.getUserProfile()
  },
  mounted() {},
  // 方法
  methods: {
    // 获取用户的个人信息
    async getUserProfile() {
      try {
        const { data } = await getUserProfile()
        console.log(data)
        this.user = data.data
      } catch (err) {
        this.$toast('获取用户个人信息失败，请稍后重试！')
      }
    },
    // 当input发生change事件时
    inputChange() {
      // console.log(this.$refs.inputRef.files)
      // 可以通过引用对象获取到选择文件的信息,下标为0的表示当前选择的文件
      const file = this.$refs.inputRef.files[0]
      // 创建一个blob数据
      this.imgUrl = window.URL.createObjectURL(file)
      // console.log(imgUrl)
      // 显示弹出层
      this.isUserAvatarshow = true
    }
  }
}
</script>
<style scoped lang="less">
.avatar {
  width: 60px;
  height: 60px;
}
.van-popup {
  background-color: #f5f7f9;
}
</style>
