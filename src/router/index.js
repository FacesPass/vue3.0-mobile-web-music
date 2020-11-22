import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/home'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/songList',
    name: 'SongList',
    component: () => import('@/views/song-list')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/search')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
