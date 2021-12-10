/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    component: () => import('@/views/layouts/index'),
    redirect: '/home',
    meta: {
      title: '首页',
      keepAlive: false
    },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index'),
        meta: { title: '首页', keepAlive: false }
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('@/views/home/about'),
        meta: { title: '关于我', keepAlive: false }
      }
    ]
  },
  {
    path: '/aaa',
    name: 'aaa',
    component: () => import('@/views/game/golang/golang'),
    meta: { title: '关于我', keepAlive: false }
  },
  {
    path: '/goBangHall',
    name: 'goBangHall',
    component: () => import('@/views/game/golang/goBangHall')
  }
]
