<template>
  <div>
    <router-view />
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
}
.icon {
  width: 0.3rem;
  height: 0.3rem;
}
</style>
