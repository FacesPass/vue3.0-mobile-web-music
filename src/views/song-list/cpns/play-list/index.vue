<template>
  <div class="play-list">
    <div class="header">
      <div class="left" @click="playAllSongs">
        <i class="iconfont icon-bofang"></i>
        <span>播放全部</span>
        <span class="song-num">(共{{ tracks.length }}首)</span>
      </div>
      <div class="right">
        <span>+ </span>
        <span>收藏({{ changeData(subscribedCount) }})</span>
      </div>
    </div>

    <div class="song-list">
      <div
        class="song-item"
        :class="{ 'play-active': song.id === $store.state.currentSong.id }"
        @click="play(song)"
        v-for="(song, index) in tracks"
        :key="song.id"
      >
        <div class="index">{{ index + 1 }}</div>
        <div class="song-detail">
          <div class="song-name">{{ song.name }}</div>
          <div class="song-author">{{ song.al.name || '未知' }}</div>
        </div>
        <div class="play-icon">
          <i class="iconfont icon-shenglvehao"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { changeValue } from '@/utils/formatData'
import { nextTick, onUpdated } from 'vue'
import { useStore } from 'vuex'
export default {
  props: {
    subscribedCount: { type: Number, required: true },
    tracks: { type: Array, required: true },
  },
  setup(props) {
    const store = useStore()
    function changeData(val) {
      return changeValue(val)
    }
    //播放所有歌曲
    function playAllSongs() {
      store.commit('changePlayList', props.tracks)
      // console.log(store.state.playList)
    }
    //播放一首歌
    function play(song) {
      console.log(song)
      store.dispatch('getMusicUrl', {
        id: song.id,
        songName: song.name,
        avatarUrl: song.al.picUrl,
        author: song.al.name,
      })
    }
    return {
      changeData,
      playAllSongs,
      play,
    }
  },
}
</script>

<style lang="less" scoped>
.play-list {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.1rem 0.2rem 0.2rem;
    background-color: #fff;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    .left {
      .icon-bofang {
        margin-right: 0.15rem;
        font-size: 0.4rem;
        vertical-align: middle;
      }
      .song-num {
        color: #b8b8b6;
        font-size: 0.26rem;
      }
    }
    .right {
      color: #fdf9f9;
      background-color: #f84040;
      border-radius: 0.3rem;
      padding: 0.12rem 0.1rem;
      font-size: 0.26rem;
    }
  }
  .song-list {
    background-color: #fff;
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
        margin-bottom: 1.5rem;
        border: none;
      }
    }

    .play-active {
      background-color: rgba(82, 146, 254, 0.3);
      border-radius: 0.05rem;
    }
  }
}
</style>