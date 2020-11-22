<template>
  <div class="play-list">
    <Header
      :coverBg="state.coverBg"
      :coverImgUrl="state.coverImgUrl"
      :albumName="state.albumName"
      :description="state.description"
      :playCount="state.playCount"
      :commentCount="state.commentCount"
      :shareCount="state.shareCount"
      :creator="state.creator"
    />
    <PlayList
      :playList="state.playList"
      :tracks="state.tracks"
      :subscribedCount="state.subscribedCount"
    />
  </div>
</template>

<script>
import { getAlbumListDetail } from '@/service/api'

import Header from './cpns/header'
import PlayList from './cpns/play-list'

import { computed, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
export default {
  components: {
    Header,
    PlayList,
  },

  setup() {
    const state = reactive({
      playList: [],
      coverBg: '',
      coverImgUrl: '',
      albumName: '',
      description: '',
      playCount: 0,
      commentCount: 0,
      shareCount: 0,
      subscribedCount: 0,
      creator: {},
      tracks: [],
    })
    const route = useRoute()
    const store = useStore()

    onMounted(async () => {
      const id = route.query.id
      const res = await getAlbumListDetail(id)
      console.log(res)

      //传递给子组件的参数处理
      const list = res.playlist
      state.playList = list
      state.coverBg = list.backgroundCoverUrl
      state.coverImgUrl = list.coverImgUrl
      state.albumName = list.name
      state.description = list.description
      state.playCount = list.playCount
      state.commentCount = list.commentCount
      state.shareCount = list.shareCount
      state.subscribedCount = list.subscribedCount
      state.creator = list.creator
      state.tracks = list.tracks
    })

    return {
      state,
    }
  },
}
</script>

<style>
</style>