<template >
  <div class="songs-search">
    <BackHeader title="搜索列表" :scrollHeight="50" />
    <div class="bg"></div>
    <div class="play-all">
      <div class="left" @click="playAllSongs">
        <i class="iconfont icon-bofang"></i>
        <span
          >播放全部<span class="song-count"
            >(共{{ state.songCount }}首)</span
          ></span
        >
      </div>
    </div>
    <van-list
      class="music-list"
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <MusicList :state="state" />
    </van-list>
  </div>
</template>

<script>
import { search } from '@/service/api'
import { useRoute } from 'vue-router'
import { onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import BackHeader from '@/components/back-header'
import MusicList from './cpns/music-list'

export default {
  props: {
    keyword: { type: String, requied: true },
  },
  components: {
    BackHeader,
    MusicList,
  },

  setup() {
    const route = useRoute()
    const store = useStore()
    const state = reactive({
      keyword: route.query.keyword,
      songCount: 0,
      currentPage: 0,
      hasMoreSong: true,
      songsList: [],
    })
    const loading = ref(false)
    const finished = ref(false)

    async function onLoad() {
      try {
        const res = await search(state.keyword, state.currentPage * 30)
        if (res.result.songCount > state.songCount) {
          state.songCount = res.result.songCount
        }
        let songs = res.result.songs
        state.songsList.push(...songs)
        state.currentPage++
        state.hasMoreSong = res.result.hasMore
        loading.value = false
      } catch (err) {
        finished.value = true
      }
    }

    return {
      state,
      loading,
      finished,
      onLoad,
    }
  },
}
</script>

<style lang="less" scoped>
.songs-search {
  margin-bottom: 1.5rem;

  .bg {
    position: absolute;
    height: 2rem;
    width: 7.5rem;
    background-color: #ccc;
    top: 0;
    left: 0;
    z-index: -99;
  }
  .play-all {
    margin-top: 1.5rem;
    margin-bottom: 0.3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.1rem 0.2rem 0.2rem;
    background-color: #fff;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;

    .song-count {
      font-size: 0.25rem;
      color: #a6a6a6;
    }

    .left {
      margin-left: 0.1rem;
      .icon-bofang {
        margin-right: 0.15rem;
        font-size: 0.4rem;
      }
    }
  }
}
</style>