<template>
  <div class="updata-avatar">
    <img :src="img" alt="" />
    <div class="toolbar">
      <span @click="$emit('close')">取消</span>
      <span>完成</span>
    </div>
  </div>
</template>
<script>
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
    return {}
  },
  // 计算属性
  computed: {},
  // 监听
  watch: {},
  created() {},
  mounted() {},
  // 方法
  methods: {}
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
