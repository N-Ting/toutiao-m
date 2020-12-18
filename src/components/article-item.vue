<template>
  <!-- 子组件通过props可以接受到父组件传过来的数据 -->
  <!-- :to="'/artilce/' + article.art_id" -->
  <!-- :to="`/artilce/${article.art_id}`" -->
  <!-- name可以跟query和params一起用 -->
  <!-- path只能和query用 -->
  <van-cell
    class="article-item"
    :to="{
      // 根据路由名称跳转
      name: 'article',
      // 传递参数，属性名要求是配置路由时路径中指定的名称，path:'/artilce/:articleId'
      params: {
        articleId: article.art_id
      }
    }"
  >
    <!-- 标题 -->
    <div slot="title" class="title van-multi-ellipsis--l2">
      {{ article.title }}
    </div>
    <!-- 自定义下方标题内容 -->
    <div slot="label">
      <!-- 有三张封面时 -->
      <div class="cover-warp" v-if="article.cover.type === 3">
        <div
          class="cover-item"
          v-for="(img, index) in article.cover.images"
          :key="index"
        >
          <van-image fit="cover" :src="img" class="cover-item-img" />
        </div>
      </div>
      <!-- 底部文字提示 -->
      <div class="label-info-wrap">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}评论</span>
        <span>{{ article.pubdate | relativeTime }}</span>
      </div>
    </div>
    <!-- 右侧图片 -->
    <!-- type表示文章封面的数量 -->
    <van-image
      v-if="article.cover.type === 1"
      class="right-cover"
      slot="default"
      fit="cover"
      :src="article.cover.images[0]"
    />
  </van-cell>
</template>
<script>
// import Article from '@/views/article'
export default {
  name: 'ArticleItem',
  //  组件
  components: {
    // Article
  },
  // 接受article-list组件传过来的值，
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  //  计算属性
  computed: {},
  //  监听
  watch: {},
  created() {},
  mounted() {},
  //  方法
  methods: {}
}
</script>
<style scoped lang="less">
.article-item {
  .title {
    font-size: 32px;
    color: #3a3a3a;
  }
  .van-cell__value {
    //unset表示如果能继承就继承，否则就是默认的，flex不能继承
    flex: unset;
    width: 232px;
    height: 146px;
    padding-left: 25px;
  }
  .right-cover {
    width: 232px;
    height: 146px;
  }
  .label-info-wrap span {
    font-size: 22px;
    color: #b4b4b4;
    margin-right: 25px;
  }
  .cover-warp {
    display: flex;
    padding: 30px 0;
    .cover-item {
      flex: 1;
      height: 146px;
      //&:选择到父元素本身，not(:last-child)表示不选择最后一个
      &:not(:last-child) {
        padding-right: 4px;
      }
    }
    .cover-item-img {
      width: 100%;
      height: 146px;
    }
  }
}
</style>
