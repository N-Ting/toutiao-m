import router from '@/router'
export const redirectLogin = () => {
  // router.currentRoute里可以拿到跳转过来的路径
  router.replace({
    name: 'login', // 根据名称跳转
    query: {
      redirect: router.currentRoute.fullPath // 在fullPath里可以拿到跳转过来的路径
    }
  })
}
