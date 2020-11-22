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

<style lang="less" scoped>
</style>
