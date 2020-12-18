<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <!-- 这里不用屑插槽的名字的原因是因为默认就插入右侧  -->
      <!-- 点击编辑按钮时展示关闭的字体图标取反 -->
      <van-button
        size="mini"
        round
        type="danger"
        plain
        class="edit-btn"
        @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>
    <!-- 宫格 -->
    <van-grid :gutter="10">
      <van-grid-item
        class="channel-item"
        v-for="(channelItem, index) in myChannels"
        :key="index"
        icon="close"
        @click="myChannelClick(channelItem, index)"
      >
        <!-- v-show为true的时候显示 -->
        <!-- includes方法判断数组中是否包含 -->
        <van-icon
          v-show="isEdit && !fiexdChannel.includes(channelItem.id)"
          slot="icon"
          name="close"
        ></van-icon>
        <!-- active:为css类名 当index等于父组件传过来的active值就添加active这个类名 -->
        <span slot="text" class="text" :class="{ active: index === active }">{{
          channelItem.name
        }}</span>
      </van-grid-item>
    </van-grid>
    <!-- /宫格 -->
    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <!-- 宫格 -->
    <van-grid :gutter="10" class="recommend-grid">
      <van-grid-item
        class="channel-item"
        v-for="value in recommendChannels"
        :key="value.id"
        icon="plus"
        :text="value.name"
        @click="onAddChannel(value)"
      />
    </van-grid>
    <!-- /宫格 -->
    <!-- /频道推荐 -->
  </div>
</template>
<script>
// 导入channel.js中封装的请求方法
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel
} from '@/api/channel.js'
// 需要访问state中的数据，所以按需导入mapState函数
import { mapState } from 'vuex'
// 导入本地存储模块
import { setItem } from '@/utils/storage'
// 导入lodash
import { differenceBy } from 'lodash'

export default {
  name: 'ChannelEdit',
  // 组件
  components: {},
  props: {
    myChannels: {
      // 类型为数组
      type: Array,
      // 为必要属性
      required: true
    },
    active: {
      type: Number,
      require: true
    }
  },
  data() {
    return {
      // 保存获取到的频道数据
      allChannels: [],
      // 默认不展示关闭的字体图标
      isEdit: false,
      // 固定的频道，不允许删除
      fiexdChannel: [0]
    }
  },
  // 计算属性
  computed: {
    // 通过展开运算符将user映射为计算属性
    ...mapState(['user']),
    // 计算属性货观测内部依赖数据的变化
    // 如果依赖的数据发生变化，则计算属性会重新计算
    recommendChannels() {
      // 利用filter遍历allChannels数组，满足条件的就返回，返回的是一个新数组
      // channel为allChannels数组的的每一项元素
      /*       return this.allChannels.filter(channel => {
        // find方法将返回的第一个元素的值赋值给一个常量
        // myChannel为myChannels数组的每一项元素
        const myChannel = this.myChannels.find(myChannel => {
          // 如果在myChannels数组中有跟allChannels数组的id相等的就返回
          return myChannel.id === channel.id
        })
        // 如果在myChannels中找不到与channel.id相等的值就保留
        return !myChannel
      }) */
      // 通过id将allChannels数组中有的myChannels数组的元素过滤出来，返回的是不包含myChannels数组中的新数组
      return differenceBy(this.allChannels, this.myChannels, 'id')
    }
  },
  // 监听
  watch: {},
  created() {
    // 在此可以最早的获取到data里的数据
    this.loadAllChannels()
  },
  mounted() {},
  // 方法
  methods: {
    // 监听请求所有频道的事件
    async loadAllChannels() {
      try {
        // 发送请求，获取所有的频道数据
        const { data: res } = await getAllChannels()
        // console.log(res.data.channels)
        // 获取成功后将数据保存到data里
        this.allChannels = res.data.channels
      } catch (err) {
        // console.log(err)
        // 有错误就会做这里
        this.$toast('获取频道列表数据失败')
      }
    },
    // 监听推荐频道的点击事件
    // 因为是点推荐频道将器添加进我的频道，所以需要将其频道的数据传入
    async onAddChannel(value) {
      // 将传入的数据添加进myChannels数组中
      this.myChannels.push(value)
      // 这里不需要删除推荐频道中的数据，是因为推荐频道使用过计算属性获取的
      // 计算属性中使用了myChannels（我的频道）数据，
      // 只要在我的频道中的数据发生变化，计算属性就会重新运算获取最新的数据

      // 数据持久化的处理
      if (this.user) {
        // console.log(4455)
        try {
          // 已登录，把数据请求接口放到线上
          await addUserChannel({
            // 频道id
            id: value.id,
            // 序号
            seq: this.myChannels.length
          })
        } catch (err) {
          this.$toast('保存失败，请稍后重试')
        }
      } else {
        // console.log(111222)
        // 未登录，把数据放在本地存储中
        // 调用本地存储模块中的存储数据方法
        setItem('TOUTIAO_CHANNEL', this.myChannels)
      }
    },
    myChannelClick(channelItem, index) {
      // console.log(channelItem, index)
      // 当isEdit为true时表示为编辑状态
      if (this.isEdit) {
        // 1.如果删除的时固定频道，则返回
        if (this.fiexdChannel.includes(channelItem.id)) {
          return
        }
        // splice方法：
        //    参数1：要删除元素的开始索引（包括）
        //    参数2：删除的个数，如果不指定，则从参数1开始一直删除
        // 2.根据索引删除数组中指定的元素
        this.myChannels.splice(index, 1)
        // 3.如果删除的时激活频道之前的，则激活索引减1
        if (index <= this.active) {
          this.$emit('updata-active', this.active - 1, true)
        }

        // 处理持久化删除频道
        // 传入每一项频道的id值
        this.deleteChannel(channelItem.id)

        // 编辑状态，删除
      } else {
        // 非编辑状态，切换频道
        // 子组件通过$this.$emit设置自定义事件，修改父组件的值
        this.$emit('updata-active', index, false)
      }
    },

    // 处理持久化删除频道的方法
    async deleteChannel(id) {
      // 已登录，就将数据请求放到线上
      if (this.user) {
        try {
          await deleteUserChannel(id)
        } catch (err) {
          this.$toast('删除用户频道失败！')
        }
      } else {
        // 未登录，将数据更新到本地
        // 直接将数据再存一边就可以覆盖原来的
        setItem('TOUTIAO_CHANNEL', this.myChannels)
      }
    }
  }
}
</script>
<style scoped lang="less">
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 28px;
    color: #333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/.channel-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      background-color: #f5f5f6;
      .van-grid-item__text,
      .text {
        color: #222;
        font-size: 28px;
        // margin-top: 0;
        white-space: nowrap;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        // 不继承定位属性
        position: unset;
      }
      .van-icon-close {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 36px;
        color: #ccc;
      }
    }
  }
  /deep/.recommend-grid {
    .van-grid-item__content {
      // 内部元素是如何在 flex 容器中布局的,row 表示从左到右定向的水平轴，
      flex-direction: row;
      color: #222;
      .van-icon {
        font-size: 24px;
      }
      .van-grid-item__text {
        font-size: 28px;
        margin-top: 0;
      }
    }
  }
}
</style>
