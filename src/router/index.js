import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/home'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { transition: 'gohome' }
  },
  {
    path: '/songList',
    name: 'SongList',
    component: () => import('@/views/song-list'),
    meta: { transition: 'songList' }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/search'),
    meta: { transition: 'search' },
  },
  {
    path: '/searchMusicList',
    name: 'SearchMusicList',
    component: () => import('@/views/search-music-list')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
