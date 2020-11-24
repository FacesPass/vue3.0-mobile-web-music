<template>
  <div class="home">
    <TopNav />
    <Swiper />
    <IconList />
    <SongAlbum />
  </div>
</template>

<script>
import TopNav from './cpns/top-nav'
import Swiper from './cpns/swiper'
import IconList from './cpns/icon-list'
import SongAlbum from './cpns/song-album'

export default {
  name: 'Home',
  components: {
    TopNav,
    Swiper,
    IconList,
    SongAlbum,
  },
}
</script>



<style lang="less">
//进入主页的动画效果
.gohome-enter-active {
  animation: home-enter 0.6s;
}

@keyframes home-enter {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
