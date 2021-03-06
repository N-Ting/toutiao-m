<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="isLoading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <!-- 有文章标题，就显示文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            src="https://img.yzcdn.cn/vant/cat.jpeg"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <!-- 因为这里需要的是相对时间，所以需要使用过滤器  过滤器，就是一个全局的方法，可以对数据进行加工 -->
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>
          <!-- 关注封装的组件 -->

          <!-- 模板中的$event是事件参数 -->
          <!-- 当我们使用子组件的数据既要使用还要修改 -->
          <!-- 传递props：
          :is-followed="article.is_followed" -->
          <!-- 修改：自定义事件
          @updata-followed="article.is_followed = $event" -->
          <!-- 简写方式：在组件上使用v-model value="article.is_followed" -->
          <!-- @input="article.is_followed = $event" -->
          <!-- 如果需要修改v-model规则名称，可以通过子组件的model来配置修改 -->
          <!-- 一个组件上只能使用一次v-model
          如果有多个数据需要类似于v-model的效果，可以使用属性.sync修饰符
           -->
          <follow-user
            class="follow-btn"
            :user-id="article.aut_id"
            v-model="article.is_followed"
          />
          <!-- <van-button
            class="follow-btn"
            round
            size="small"
            v-if="article.is_followed"
            @click="onFollow"
            :loading="followLoading"
            >已关注</van-button
          >
          <van-button
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            v-else
            @click="onFollow"
            :loading="followLoading"
            >关注</van-button
          > -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>
        <comment-list
          :source="articleId"
          @updata-data="totalCommentCount = $event.total_count"
          :list="commentList"
          @click-reply="onReplyClick"
        />
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isCommentshow = true"
            >写评论</van-button
          >
          <van-icon name="comment-o" :info="totalCommentCount" color="#777" />
          <collect-article
            v-model="article.is_collected"
            :articleId="articleId"
          />
          <!-- <van-icon color="#777" name="star-o" /> -->
          <like-article v-model="article.attitude" :articleId="articleId" />
          <!-- <van-icon color="#777" name="good-job-o" /> -->
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <!-- 发布评论 -->
        <van-popup v-model="isCommentshow" position="bottom"
          ><comment-post
            :target="article.art_id"
            @post-success="onPostSuccess"
          />
        </van-popup>
        <!-- /发布评论 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <!-- 评论回复 -->
    <!-- 弹出层是懒渲染的：只有在第一次展示的时候才会渲染里面的内容 -->
    <van-popup v-model="isReplyshow" position="bottom" style="height:100%">
      <!-- v-if条件渲染
            true：渲染元素的节点
            false：不渲染，也就是组件销毁了
       -->
      <comment-reply
        v-if="isReplyshow"
        :comment="currentComment"
        @close="isReplyshow = false"
      />
    </van-popup>
    <!-- /评论回复 -->
  </div>
</template>
<script>
// 导入获取文章详情的接口方法
import { getArticleById } from '@/api/article'
// 导入ImagePreview
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import likeArticle from '@/components/like-article'
import CommentList from './component/comment-list'
import CommentPost from './component/comment-post'
import CommentReply from './component/comment-reply'

export default {
  name: 'Article',
  // 组件
  components: {
    // 关注按钮组件
    FollowUser,
    // 收藏按钮组件
    CollectArticle,
    // 点赞组件
    likeArticle,
    // 文章评论组件
    CommentList,
    // 写评论弹出框
    CommentPost,
    // 回复评论弹出层
    CommentReply
  },
  // 给所有的后代组件提供数据
  provide: function() {
    return {
      articleId: this.articleId
    }
  },
  props: {
    // 这里使用props解耦路由数据，可以直接在这里访问数据
    articleId: {
      // 直接复制地址跳转是字符串，通过文章列表跳转为数字
      // 因为json-bigint转换是个对象
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      // 文章列表详情
      article: {},
      // 是否显示loading状态，加载中的loading状态
      isLoading: true,
      // 失败的状态码
      errStatus: 0,
      totalCommentCount: 0,
      // 发布评论弹出框，默认不显示
      isCommentshow: false,
      commentList: [],
      // 回复评论弹出框，默认不显示
      isReplyshow: false,
      // 存储回复评论信息的
      currentComment: {}
    }
  },
  // 计算属性
  computed: {},
  // 监听
  watch: {},
  created() {
    this.loadArticle()
  },
  mounted() {},
  // 方法
  methods: {
    // 获取文章详情的方法
    async loadArticle() {
      try {
        this.isLoading = true
        const { data } = await getArticleById(this.articleId)

        // 模拟正确的数据因网络原因加载失败
        // 当随机数大于0.5时
        // if (Math.random() > 0.5) {
        //   // 将一个错误的JSON字符串利用JSON.parse()转换
        //   JSON.parse('erfq3e5314')
        // }

        console.log(data)
        this.article = data.data

        // 因为此时的DOM害没有渲染出来，所以时undefined
        // console.log(this.$refs['article-content']);
        // 要等数据拿到，并且上面的条件成立后，DOM才渲染出来
        // 所以设置一个定时器
        setTimeout(() => {
          // 将获取img节点的方法单独封装
          this.previewImage()
        })
      } catch (err) {
        // this.$toast('获取文章详情失败！')
        // console.log(err)
        // 如果有错误响应，并且错误响应码为404
        if (err.response && err.response.status === 404) {
          // 则将失败状态码赋值为404
          this.errStatus = 404
        }
      }
      // 获取数据成功或获取数据失败，都要加加载状态关闭
      this.isLoading = false
    },
    previewImage() {
      // console.log(this.$refs['article-content'])
      // 获取div中所有的节点,对象中括号可以拿到里面的值
      const articleConent = this.$refs['article-content']
      // 获取所有的img节点
      const imgs = articleConent.querySelectorAll('img')
      // console.log(imgs)
      // 定义一个数组用来存储图片的
      const images = []
      // 遍历imgs中的图片，以及索引
      imgs.forEach((img, index) => {
        // 将遍历出来的img中的src添加进images数组
        images.push(img.src)

        // 给每一个图片设置点击事件
        img.onclick = () => {
          // ImagePreview 是一个函数，调用函数后会直接在页面中展示图片预览界面。
          ImagePreview({
            // 存储图片路径的数组
            images,
            // 指定图片的初始位置（索引值）。
            startPosition: index
          })
        }
      })
    },
    onPostSuccess(data) {
      // 关闭弹出层
      this.isCommentshow = false
      // 将添加的评论添加到commentList数组的第一个
      this.commentList.unshift(data.new_obj)
    },
    onReplyClick(comment) {
      // console.log(comment)
      // 将回复的评论信息赋值给currentComment
      this.currentComment = comment
      // 显示回复弹出层
      this.isReplyshow = true
    }
  }
}
</script>
<style scoped lang="less">
@import './github-markdown.css';
.main-wrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 92px;
  bottom: 88px;
  overflow-y: scroll;
  background-color: #fff;
}
.article-detail {
  .article-title {
    font-size: 40px;
    padding: 50px 32px;
    margin: 0;
    color: #3a3a3a;
  }

  .user-info {
    padding: 0 32px;
    .avatar {
      width: 70px;
      height: 70px;
      margin-right: 17px;
    }
    .van-cell__label {
      margin-top: 0;
    }
    .user-name {
      font-size: 24px;
      color: #3a3a3a;
    }
    .publish-date {
      font-size: 23px;
      color: #b7b7b7;
    }
    .follow-btn {
      width: 170px;
      height: 58px;
    }
  }

  .article-content {
    padding: 55px 32px;
    /deep/ p {
      text-align: justify;
    }
  }
}

.loading-wrap {
  padding: 200px 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
}

.error-wrap {
  padding: 200px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  .van-icon {
    font-size: 122px;
    color: #b4b4b4;
  }
  .text {
    font-size: 30px;
    color: #666666;
    margin: 33px 0 46px;
  }
  .retry-btn {
    width: 280px;
    height: 70px;
    line-height: 70px;
    border: 1px solid #c3c3c3;
    font-size: 30px;
    color: #666666;
  }
}

.article-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  height: 88px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
  .comment-btn {
    width: 282px;
    height: 46px;
    border: 2px solid #eeeeee;
    font-size: 30px;
    line-height: 46px;
    color: #a7a7a7;
  }
  .van-icon {
    font-size: 40px;
    .van-info {
      font-size: 16px;
      background-color: #e22829;
    }
  }
}
</style>
