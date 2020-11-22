import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/utils/rem'

//vant组件引入
import { Swipe, SwipeItem } from 'vant';

const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#app')

//按需引入vant组件
app
  .use(Swipe)
  .use(SwipeItem)



