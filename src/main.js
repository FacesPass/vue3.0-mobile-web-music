import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/utils/rem'
import VueLazyLoad from 'vue3-lazyload'

//vant组件引入
import { Swipe, SwipeItem, List, Popup } from 'vant';

const app = createApp(App)
app.use(store)
  .use(router)
  .use(VueLazyLoad)
app.mount('#app')

//按需引入vant组件
app
  .use(Swipe)
  .use(SwipeItem)
  .use(List)
  .use(Popup)


