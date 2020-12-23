import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import { Dialog } from 'vant'
import { redirectLogin } from '@/utils/redirectLogin'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login'),
    // meta可以放一些信息
    meta: {
      requireAuth: false
    }
  },
  {
    path: '/',
    name: 'layout',
    component: () => import('@/views/layout'),
    children: [
      {
        path: '', //  默认子路由
        name: 'home',
        component: () => import('@/views/home'),
        meta: {
          requireAuth: false
        }
      },
      {
        path: 'qa',
        name: 'qa',
        component: () => import('@/views/qa'),
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'video',
        name: 'video',
        component: () => import('@/views/video'),
        meta: {
          requireAuth: false
        }
      },
      {
        path: 'my',
        name: 'my',
        component: () => import('@/views/my'),
        meta: {
          requireAuth: false
        }
      }
    ]
  },
  {
    // 配置搜索路由
    path: '/search',
    name: 'search',
    component: () => import('@/views/search'),
    meta: {
      requireAuth: false
    }
  },
  {
    // 配置文章详情路由
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    // 表示通过props传参，把路由参数映射到组件props数据中
    props: true,
    meta: {
      requireAuth: false
    }
  },
  {
    // 配置编辑资料路由
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile'),
    meta: {
      requireAuth: false
    }
  }
]
// 因为了路由3.0的版本使适用next(false) 所以需要以下代码解决

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject)
  }
  return originalPush.call(this, location).catch(err => err)
}
const router = new VueRouter({
  routes
})
// 路由导航守卫
router.beforeEach(async (to, from, next) => {
  // to要访问的路径
  // from从哪里来
  // next()直接放行
  // console.log(to.meta.requireAuth)
  // 如果meta.requireAuth为false,表示不需要登录，直接放行
  if (!to.meta.requireAuth) return next()

  // 将store.state中的user解构出来
  const { user } = store.state
  // 如果有user，并且user里有token，表示用户已经登录,直接放行
  if (user && user.token) {
    return next()
  } else {
    // 如果store中没有用户信息，则弹出询问框
    const r = await Dialog.confirm({
      title: '提示',
      message: '是否要登录？'
    })
      .then(r => r) // 点击时触发的结果
      .catch(e => e) // 报错信息
    // console.log(r)
    if (r === 'confirm') {
      // 点击了确定，就登录
      redirectLogin()
    } else {
      // 点击了取消，就卡在原页面
      next(false)
    }
  }
})

export default router
