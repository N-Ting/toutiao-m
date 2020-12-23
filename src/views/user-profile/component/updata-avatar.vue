<template>
  <div class="updata-avatar">
    <img :src="img" alt="" ref="img" />
    <div class="toolbar">
      <span @click="$emit('close')">取消</span>
      <span @click="onConfirm">完成</span>
    </div>
  </div>
</template>
<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhoto } from '@/api/user'
export default {
  name: 'updataAvatar',
  // 组件
  components: {},
  props: {
    img: {
      type: [String, Object],
      reuqired: true
    }
  },
  data() {
    return {
      cropper: null
    }
  },
  // 计算属性
  computed: {},
  // 监听
  watch: {},
  created() {},
  mounted() {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1, // 裁剪框限制在画布当中
      dragMode: 'move', // 不允许直接选择裁剪框的大小,只能移动画布
      aspectRatio: 1, // 截图框的比例
      autoCropArea: 1, // 自动截取的比例, 一边填满
      cropBoxMovable: false, // 不允许拖动来移动裁剪框
      cropBoxResizable: false, // 截图区域不允许缩放放大小
      background: false // 关闭自带背景
    })
  },
  // 方法
  methods: {
    // 点击完成按钮时
    onConfirm() {
      // 基于服务端的裁切使用getData方法获取裁切参数
      // console.log(this.cropper.getData())

      // 纯客户端的裁切使用getCroppedCanvas获取裁切的文件对象(也就是file类型文件选择对象)
      // blob是 file类型input文件选择对象
      this.cropper.getCroppedCanvas().toBlob(blob => {
        // console.log(blob)
        this.updatePhoto(blob)
      })
    },
    async updatePhoto(blob) {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0
      })
      try {
        // 如果接口要求Content-Type是application/json
        // 则传递普通JavaScript对象
        // updateUserPhoto({
        //   photo: blob
        // })
        // 如果接口要求Content-Type是multipart/form-data
        // 则你必须传递FormData对象
        const formData = new FormData()
        // 向formData对象中添加的参数名称,以及参数
        formData.append('photo', blob)
        // 发起请求
        const { data } = await updateUserPhoto(formData)

        // 关闭弹出层
        this.$emit('close')

        // 更新视图
        this.$emit('update-photo', data.data.photo)
        this.$toast.success('更新成功!')
      } catch (err) {
        this.$toast.fail('更新失败!')
      }
    }
  }
}
</script>
<style scoped lang="less">
.updata-avatar {
  background: #000;
  width: 100%;
  height: 100%;
  .toolbar {
    position: fixed;
    bottom: 10px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 28px;
    color: #fff;
    padding: 0 15px;
    box-sizing: border-box;
  }
}
</style>
