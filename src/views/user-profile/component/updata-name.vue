<template>
  <div upadata-name>
    <van-nav-bar
      title="昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('closePost')"
      @click-right="onClickRight"
    />
    <!-- 输入框 -->
    <div class="field-warp">
      <van-field
        v-model.trim="message"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
    <!-- /输入框 -->
  </div>
</template>
<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdataName',
  // 组件
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 输入的文本内容
      message: this.value
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
    async onClickRight() {
      this.$toast.loading({
        message: '保存中....',
        forbidClick: true,
        duration: 0
      })
      try {
        await updateUserProfile({
          name: this.message // 更新的昵称
        })
        //  通过自定义事件将修改后的昵称传给父组件
        this.$emit('input', this.message)
        this.$emit('closePost')
        this.$toast.success('更新数据成功！')
      } catch (err) {
        // console.dir(err)
        let message = '修改用户昵称失败，请稍后重试！'
        if (err.response && err.response.status === 409) {
          message = '用户名已经存在'
        }
        this.$toast(message)
      }
    }
  }
}
</script>
<style scoped lang="less">
.field-warp {
  padding: 20px;
}
</style>
