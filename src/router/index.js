import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/home/index.vue'  完整路径
import Layout from '../views/layout' // 简写路径
import Login from '../views/login' // 简写路径

// @ 是 VueCLI 中提供的一种特殊的路径规则，它直接指向 src 目录路径
// 注意：在 VueCLI 创建的项目中，无论你在哪里使用 @ 符号，它永远指向 src
import Home from '@/views/home'
import Article from '@/views/article'
import Publish from '@/views/publish'
import Comment from '@/views/comment'
import CommentDetail from '@/views/comment-detail'
import Media from '@/views/media'
import Account from '@/views/account'

// 加载 nprogress
import NProgress from 'nprogress'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   redirect: '/home'
  // },
  // 一级路由 主页，它是最外面的那个壳子
  {
    path: '/',
    component: Layout,
    children: [
      { // 首页
        path: '', // 默认子路由，只能有一个
        component: Home
      },
      { // 文章列表
        path: '/article',
        component: Article
      },
      { // 发布文章
        path: '/publish',
        component: Publish
      },
      // 如果从 a 路由跳转到 b 路由
      // 两个，如果两个路由使用的同一个组件，那么这个组件不会重新渲染
      // 正常的路由跳转，会销毁离开的组件，渲染新匹配到的组件
      // 组件销毁也就意味着它的数据之类都被清除了
      {
        path: '/publish/:articleId',
        component: Publish
      },
      {
        path: '/comment',
        component: Comment
      },
      {
        path: '/comment/:articleId',
        component: CommentDetail,
        // 将路由参数映射给组件的 prosp 数据，这样获取参数更方便
        // 参考文档：https://router.vuejs.org/zh/guide/essentials/passing-props.html
        props: true
      },
      {
        path: '/media',
        component: Media
      },
      {
        path: '/account',
        component: Account
      }
    ]
  },
  {
    // 一级路由 登录页
    path: '/login',
    component: Login
  }
]

// Vue 为了你更方便的访问到路由实例
// 它把这个 router 起了个名字叫 $router 放到了 Vue 原型对象中了
// 所以说你在组件中访问的 this.$router 就是这里我们 new 出来的 VueRouter 实例
const router = new VueRouter({
  routes
})

// 路由的拦截器 beforeEach 方法，该方法接收一个函数作为参数
// 参数1：to，表示去哪里的路由信息
// 参数2：from，表示来自哪里的路由信息
// 参数3：next，它是一个方法，用于路由放行
// 我们具体要做的就是：判断用户的登录状态，有就通过，没有就跳转到登录页。
// to、from 都是一个 $route 对象，其中包括https://router.vuejs.org/zh/api/#%E8%B7%AF%E7%94%B1%E5%AF%B9%E8%B1%A1%E5%B1%9E%E6%80%A7数据
router.beforeEach((to, from, next) => {
  // 开启顶部导航进度条特效
  NProgress.start()

  // 停止导航
  // 我们可以在一些特殊情况下，停留在当前页面，中断当前导航
  // next(false)

  // next()

  // 1. 如果访问的是登录页面，则直接放行
  if (to.path === '/login') {
    next()

    // 停止代码往后执行
    return
  }

  // 2. 非登录页面，校验登录状态

  // 2.1 获取用户 token
  const token = window.localStorage.getItem('user-token')

  // 2.2 判断是否有 token，有就通过
  if (token) {
    // 导航通过，放行，访问哪里就往哪里走
    next()
  } else {
    // 2.3 没有，就跳转到登录页
    next('/login') // 跳转到指定路由

    // 如果在登录页并且是非登陆状态访问非登录页面，这里手动的终止进度条,否则进度条不会停止
    NProgress.done()
  }
})

/**
 * 路由导航结束以后触发的钩子函数
 */
router.afterEach((to, from) => {
  // 结束顶部的导航进度条
  NProgress.done()
})

export default router
