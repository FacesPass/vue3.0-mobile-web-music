<template>
  <div>
    <div
      class="song-item"
      :class="{ 'play-active': song.id === $store.state.currentSong.id }"
      @click="play(song)"
      v-for="(song, index) in state.songsList"
      :key="song.album.id"
    >
      <div class="index">{{ index + 1 }}</div>
      <div class="song-detail">
        <div class="song-name">{{ song.name }}</div>
        <div class="song-author">{{ getAuthor(song.artists) || '未知' }}</div>
      </div>
      <div class="play-icon">
        <i class="iconfont icon-shenglvehao"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { getSongDetail } from '@/service/api'
import { useStore } from 'vuex'
export default {
  props: {
    state: {
      type: Object,
    },
  },

  setup(props) {
    const store = useStore()
    //播放歌曲
    async function play(song) {
      console.log(song)
      let author = getAuthor(song.artists)

      const { songs } = await getSongDetail(song.id)

      store.dispatch('getMusicUrl', {
        id: songs[0].id,
        songName: songs[0].name,
        avatarUrl: songs[0].al.picUrl,
        author: author,
      })
    }

    //获取作者信息
    function getAuthor(artist) {
      if (artist.length > 4) {
        return '群星'
      }
      let author = ''
      artist.forEach((item) => {
        author += item.name + ' '
      })
      return author
    }
    return {
      getAuthor,
      play,
    }
  },
}
</script>

<style lang="less" scoped>
.song-item {
  display: flex;
  justify-content: space-around;
  padding: 0.2rem 0;
  border-bottom: 1px solid #ccc;
  .index {
    width: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .song-detail {
    width: 5rem;
    display: flex;
    flex-direction: column;
    .song-name {
      font-size: 0.28rem;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .song-author {
      font-size: 0.26rem;
      color: #a6a6a6;
    }
  }
  .play-icon {
    width: 1.5rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .iconfont {
      font-size: 0.42rem;
      color: #a6a6a6;
    }
  }
  &:last-child {
    border: none;
  }
}

.play-active {
  background-color: rgba(82, 146, 254, 0.3);
  border-radius: 0.05rem;
}
</style>