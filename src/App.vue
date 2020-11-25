<template>
  <div>
    <!-- 切换路由的时候添加动画效果 -->
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition">
        <component :is="Component" />
      </transition>
    </router-view>

    <PlayController />
  </div>
</template>

<script>
import PlayController from '@/components/play-controller'
export default {
  components: {
    PlayController,
  },
}
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: '微软雅黑';
}

body {
  max-width: 7.5rem;
  -webkit-tap-highlight-color: transparent;
}
.icon {
  width: 0.3rem;
  height: 0.3rem;
}
</style>
