<template>
  <div class="play-controller">
    <div class="left" @click="showBoard">
      <img :src="state.avatarUrl" />
      <div class="song-detail">
        <div class="name">{{ state.songName }}</div>
        <div class="tip">横滑可以切换上下首哦</div>
      </div>
    </div>
    <div class="right">
      <i
        class="iconfont play-status"
        :class="[state.isPlaying ? 'icon-zantingtingzhi' : 'icon-bofang']"
        @click="playOrPause"
      ></i>
      <i class="iconfont icon-yinleliebiao-" @click="showPlayList"></i>
    </div>

    <transition name="bounce">
      <MusicMainBoard
        v-show="state.showBoard"
        @back="hideBoard"
        @show-play-list="showPlayList"
        :bg="state.avatarUrl"
        :isPlaying="state.isPlaying"
        :playOrPause="playOrPause"
        :songName="state.songName"
        :author="state.author"
      />
    </transition>

    <van-popup
      class="popup"
      v-model:show="show"
      position="bottom"
      :duration="0.08"
      :style="{ height: '50%' }"
    >
      <div class="header">
        <div>
          <i class="iconfont icon-xunhuanbofang1"></i>
          <span class="text">播放列表</span>
        </div>
        <div>
          <i class="iconfont icon-detail" @click="clearPlayList"></i>
          <i class="iconfont icon-cha" @click="showPlayList"></i>
        </div>
      </div>
      <div class="music-list">
        <div
          class="song-item"
          :class="{
            playActive:
              currentSong.songName === song.songName &&
              currentSong.id === song.id,
          }"
          v-for="(song, i) in $store.state.playList"
          :key="song.id"
          @click="playSong(song, i)"
        >
          <div class="index">{{ i + 1 }}</div>
          <div class="song-detail">
            <div class="song-name">{{ song.songName }}</div>
            <div class="song-author">{{ song.author }}</div>
          </div>
          <div class="play-icon">
            <i class="iconfont icon-yichu" @click.stop="removeSong(i)"></i>
          </div>
        </div>
      </div>
    </van-popup>

    <audio :ref="audioRef" :src="$store.state.currentSong.musicUrl"></audio>
  </div>
</template>

<script>
import MusicMainBoard from '../music-main-board'
import { getSizeImage } from '@/utils/formatData'
import { onMounted, onUpdated, reactive, watch, ref, nextTick } from 'vue'
import { useStore, mapState } from 'vuex'
import { Toast, Dialog } from 'vant'

export default {
  components: {
    MusicMainBoard,
  },
  computed: {
    ...mapState(['currentSong', 'currentTime']),
  },

  watch: {
    currentSong(newVal) {
      if (this.$store.state.playList.length !== 0) {
        this.state.isPlaying = true
        this.$nextTick(() => {
          this.audioDom.play()
          setTimeout(() => {
            console.log(this.audioDom.duration)
          }, 100)
        })
        this.updateTime()
      } else {
        this.state.isPlaying = false
      }
    },
    currentTime(newVal) {
      console.log(newVal)
    },
  },

  setup() {
    const store = useStore()
    const state = reactive({
      isPlaying: false,
      avatarUrl: '',
      showBoard: false,
      songName: '',
      author: '',
    })

    const show = ref(false)
    const isCurrentPlay = ref(false)
    const activeEl = ref(null)

    const audioDom = ref(null)
    const audioRef = (el) => (audioDom.value = el)

    onMounted(() => {
      state.avatarUrl =
        getSizeImage(store.state.currentSong.avatarUrl, 150) ||
        requied('@/assets/img/music.png')
      state.songName = store.state.currentSong.songName
      state.author = store.state.currentSong.author

      if (store.state.currentSong.id) {
        store.dispatch('GET_LYRIC', { id: store.state.currentSong.id })
      }
    })

    onUpdated(() => {
      state.songName = store.state.currentSong.songName
      state.avatarUrl = getSizeImage(store.state.currentSong.avatarUrl, 150)
      state.author = store.state.currentSong.author
    })

    //控制播放或者暂停
    function playOrPause() {
      if (!store.state.currentSong.id) {
        Toast('当前暂无音乐')
        return
      }
      if (!state.isPlaying) {
        //播放歌曲
        state.isPlaying = true
        audioDom.value.play()
        updateTime()
      } else {
        //暂停歌曲
        state.isPlaying = false
        audioDom.value.pause()
        clearInterval(store.state.intervalId)
      }
    }

    //更新歌词的时间
    function updateTime() {
      store.state.intervalId = setInterval(() => {
        store.commit('CHANGE_CURRENT_TIME', audioDom.value.currentTime)
        // console.log(store.state.currentTime)
      }, 1000)
    }

    //显示音乐面板
    function showBoard() {
      state.showBoard = !state.showBoard
      document.body.style.overflow = 'hidden' //禁止页面划动
    }

    //隐藏音乐面板
    function hideBoard() {
      state.showBoard = !state.showBoard
      document.body.style.overflow = '' //恢复滚动
    }

    //显示播放列表
    function showPlayList() {
      show.value = !show.value
      //让播放列表滚动到当前播放的歌的位置
      nextTick(() => {
        let activeEl = document.querySelector('.playActive')
        // console.log(activeEl)
        activeEl.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      })
    }

    //播放音乐列表里的歌
    function playSong(song, i) {
      store.commit('CHANGE_CURRENT_SONG', song)
      store.commit('CHANGE_CURRENT_SONG_INDEX', i)
      // console.log(store.state.currentSongIndex)
    }

    //移除一首播放列表里的歌
    function removeSong(songIndex) {
      // console.log(songIndex)
      store.commit('REMOVE_ONE_SONG', songIndex)
    }

    //清空播放列表
    function clearPlayList() {
      if (store.state.playList.length === 0) {
        Toast('播放列表为空')
        return
      }
      Dialog.confirm({
        // title: '标题',
        message: '是否清空全部历史记录？',
      })
        .then(() => {
          localStorage.clear('historySearch')
          state.historySearch = []
        })
        .catch(() => {})
    }

    return {
      state,
      show,
      isCurrentPlay,
      audioRef,
      audioDom,
      playOrPause,
      store,
      showBoard,
      hideBoard,
      updateTime,
      showPlayList,
      playSong,
      removeSong,
      clearPlayList,
    }
  },
}
</script>

<style lang="less" scoped>
@import url('../../style.less');
.play-controller {
  width: 7.5rem;
  position: fixed;
  left: 0;
  bottom: 0;
  border-top: 1px solid #ccc;
  padding: 0.12rem 0.15rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;

  .left {
    display: flex;
    img {
      width: 0.8rem;
      height: 0.8rem;
      border-radius: 50%;
      margin-right: 0.15rem;
    }

    .name {
      padding-top: 0.08rem;
      font-size: 0.26rem;
      width: 4.5rem;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .tip {
      font-size: 0.24rem;
      color: #a6a6a6;
    }
  }

  .right {
    display: flex;
    align-items: center;

    .van-circle {
      position: absolute;
      right: 0.925rem;
      top: 0.225rem;
      width: 0.6rem !important;
      height: 0.6rem !important;
      z-index: -5;
    }
    .iconfont {
      font-size: 0.48rem;
    }

    .play-status {
      margin-right: 0.35rem;
    }
  }

  .popup {
    .header {
      position: fixed;
      background-color: #fff;
      width: 7.5rem;
      height: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 0.3rem;
      z-index: 90;

      .text {
        margin-left: 0.15rem;
        font-size: 0.32rem;
        color: #666;
        font-weight: 700;
      }

      .iconfont {
        font-size: 0.32rem;
      }

      .icon-detail {
        padding-right: 0.3rem;
        font-size: 0.35rem;
      }
    }
    .music-list {
      position: absolute;
      top: 1rem;

      .song-item {
        display: flex;
        justify-content: space-around;
        margin-bottom: 0.25rem;
        padding-bottom: 0.2rem;
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

      .playActive {
        color: @themeColor !important;

        .song-author {
          color: @themeColor !important;
        }
        .iconfont {
          color: @themeColor !important;
        }
      }
    }
  }
}

.bounce-enter-active {
  animation: bounce-in 0.6s;
}
.bounce-leave-active {
  animation: bounce-in 0.6s reverse;
}
@keyframes bounce-in {
  0% {
    transform: translateY(100vh);
  }

  100% {
    transform: translateY(0);
  }
}
</style>

