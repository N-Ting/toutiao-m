<template>
  <div id="app">
    <!-- 一级路由 -->
    <!-- keepAlive缓存组件之前加载的状态 -->
    <!-- 因为点了第一次的内容缓存起来了所以后面的都是显示第一次的内容
    所以这里需要只缓存layout组件
     -->
    <!-- 因为这里将layout缓存起来了，所以切换不同的账号时，显示的还是第一次渲染的数据
   解决方法：
   登录成功后把layout从缓存中抹掉
   当layout组件加载完毕后，再加上layout缓存
     -->
    <keep-alive :include="CachePages">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'App',
  data() {
    return {}
  },
  computed: {
    ...mapState(['CachePages'])
  }
}
</script>

<style lang="less" scoped></style>
