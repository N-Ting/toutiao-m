import Vue from 'vue'
import Vuex from 'vuex'
// 导入封装的本地存储模块
import { setItem, getItem } from '@/utils/storage.js'

Vue.use(Vuex)

// 将token的属性名定义为一个常量
const TOKEN = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    // 用户登录状态
    // user一个对象，存储当前登录用户信息
    // 将本地存储中的toke值转换为对象
    // user: JSON.parse(window.localStorage.getItem('TOUTIAO_USER'))
    user: getItem(TOKEN),
    // 缓存的layout
    CachePages: ['layout']
  },
  mutations: {
    setUser(state, user) {
      //  将传入过来的值赋值给state中的user
      state.user = user
      // 为了防止数据丢失，需要把数据存储到本地存储中
      // 将传入过来的值转换为json字符串，存储到本地存储中，并且叫TOUTIAO_USER
      // window.localStorage.setItem(TOUTIAO_Key, JSON.stringify(state.user))
      setItem(TOKEN, state.user)
    },
    addCachePages(state, page) {
      // 如果state中没有layout缓存
      if (!state.CachePages.includes(page)) {
        // 就往CachePages数组中添加粗腰缓存的组件
        state.CachePages.push(page)
      }
    },
    removeCachePage(state, page) {
      // 查找缓存的组件,并返回它的所有值
      const index = state.CachePages.indexOf(page)
      // 从CachePages数组中删除缓存的组件
      state.CachePages.splice(index, 1)
    }
  },
  actions: {},
  modules: {}
})
