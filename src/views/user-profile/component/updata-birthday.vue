<template>
  <div updata-birthday>
    <!-- currentDate双向绑定日期选择器
       设置日期选择器的默认值
       同步日期选择器选择的日期
       minDate:可选的最小日期
       maxDate:可选的最大日期
     -->
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>
<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
  name: 'UpdataBirthday',
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
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value) // 基于this.value创建一个日期对象
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
    // 点击确认按钮时
    async onConfirm() {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0
      })
      try {
        // 格式化日期
        const birthday = dayjs(this.currentDate).format('YYYY-MM-DD')
        await updateUserProfile({
          birthday // 生日
        })
        this.$emit('input', birthday)
        this.$emit('close')
        this.$toast.success('更新数据成功!')
      } catch (err) {
        this.$toast('更新数据失败')
      }
    }
  }
}
</script>
<style scoped lang="less"></style>
