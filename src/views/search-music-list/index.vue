<template>
  <div class="songs-search">
    <BackHeader title="歌单" linkTo="/search" />
    <div class="music-list">
      <div v-for="(song, i) in state.songsList" :key="i">{{ song.name }}</div>
    </div>
  </div>
</template>

<script>
import { search } from '@/service/api'
import { useRoute } from 'vue-router'
import { onMounted, reactive } from 'vue'

import BackHeader from '@/components/back-header'
export default {
  props: {
    keyword: { type: String, requied: true },
  },
  components: {
    BackHeader,
  },

  setup() {
    const route = useRoute()
    const state = reactive({
      songsList: [],
    })

    onMounted(async () => {
      const res = await search(route.query.keyword)
      state.songsList = res.result.songs
    })

    return {
      state,
    }
  },
}
</script>

<style lang="less" scoped>
.songs-search {
  margin-bottom: 1.5rem;

  .music-list {
    margin-top: 1rem;
  }
}
</style>