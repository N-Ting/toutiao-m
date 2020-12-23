<template>
  <div class="updata-gender">
    <!-- default-index单列选择时，默认选中项的索引 -->
    <van-picker
      title="性别"
      show-toolbar
      :columns="columns"
      :default-index="value"
      @cancel="$emit('close')"
      @change="onChange"
      @confirm="onConfirm"
    />
  </div>
</template>
<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdataGender',
  // 组件
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      columns: ['男', '女'],
      gender: this.value
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
    // 当选项发生改变时
    onChange(Picker, value, index) {
      console.log(index)
      // 将当前选中的索引赋值给gender
      this.gender = index
      console.log(this.gender)
    },
    // 当点击确认按钮时
    async onConfirm() {
      this.$toast.loading({
        message: '保存中....',
        forbidClick: true,
        duration: 0
      })
      try {
        await updateUserProfile({
          gender: this.gender
        })
        // console.log(data)
        // 通过自定义事件，将修改后的值传给父组件
        this.$emit('input', this.gender)
        // 通过自定义事件告诉父组件关闭弹窗
        this.$emit('close')
        this.$toast.success('更新数据成功!')
      } catch (err) {
        this.$toast('更新数据失败!')
      }
    }
  }
}
</script>
<style scoped lang="less"></style>
