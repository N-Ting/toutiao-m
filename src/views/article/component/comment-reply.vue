<template>
  <div class="comment-reply">
    <van-nav-bar
      :title="
        comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'
      "
    >
      <van-icon slot="left" name="cross" @click="$emit('close')" />
    </van-nav-bar>
    <!-- 滚动容器 -->
    <div class="scroll-warp">
      <!-- 当前评论项 -->
      <!-- 通过父组件传值将当前的评论项传给comment-item子组件 -->
      <comment-item :comment="comment" />
      <!-- /当前评论项 -->
      <!-- 评论的回复 -->
      <van-cell title="全部回复"> </van-cell>
      <!-- 评论列表 -->
      <!-- type前:加代表是一个变量，不加代表是一个字符串 -->
      <comment-list :source="comment.com_id" type="c" :list="commentList" />
      <!-- /评论的回复 -->
    </div>
    <!-- /滚动容器 -->
    <!-- 底部区域-->
    <div class="post-warp">
      <van-button class="post-btn" size="small" round @click="isPostshow = true"
        >写评论</van-button
      >
    </div>
    <!-- /底部区域-->

    <!-- 发布评论 -->
    <van-popup v-model="isPostshow" position="bottom">
      <!-- v-if条件渲染
            true：渲染元素的节点
            false：不渲染，也就是组件销毁了
       -->
      <comment-post :target="comment.aut_id" @post-success="onPostSuccess" />
    </van-popup>
    <!-- /发布评论 -->
  </div>
</template>
<script>
import CommentItem from './comment-item'
import CommentList from './comment-list'
import CommentPost from './comment-post'
export default {
  name: 'CommentReply',
  // 组件
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // 控制写评论的弹出框显示与隐藏
      isPostshow: false,
      commentList: []
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
    onPostSuccess(data) {
      // console.log(data)
      // 更新回复数量
      this.comment.reply_count++
      // 关闭弹出层
      this.isPostshow = false
      // 将评论回复添加到commentList的第一个
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>
<style scoped lang="less">
.scroll-warp {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto;
}
.post-warp {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  padding-top: 1px solid #d8d8d8;
  .post-btn {
    width: 60%;
  }
}
</style>
