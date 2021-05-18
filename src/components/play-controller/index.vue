<template>
  <div class="play-controller">
    <div class="left" @click="showBoard">
      <img :src="state.avatarUrl" />
      <div class="song-detail">
        <div class="name">{{ state.songName }}</div>
        <div class="tip">{{ state.author }}</div>
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

    <!-- 音乐播放进度条 -->
    <van-slider
      v-model="currentTime"
      active-color="#5292FE"
      :max="duration"
      bar-height="2px"
    >
      <template #button></template>
    </van-slider>

    <!-- 音乐主面板 -->
    <transition name="bounce">
      <MusicMainBoard
        v-show="state.showBoard"
        @back="hideBoard"
        @change-progress="changeProgress"
        @show-play-list="showPlayList"
        @play-again="playAgain"
        :bg="state.avatarUrl"
        :isPlaying="state.isPlaying"
        :playOrPause="playOrPause"
        :songName="state.songName"
        :author="state.author"
      />
    </transition>

    <audio :ref="audioRef" :src="currentSong.musicUrl"></audio>

    <!-- 音乐播放列表弹框 -->
    <van-popup
      class="popup"
      v-model:show="isShowPlayList"
      :duration="0.08"
      position="bottom"
      :style="{ height: '45%' }"
    >
      <div class="header">
        <div>
          <span class="text"
            >播放列表
            <span class="play-list-count">(共{{ playList.length }}首) </span>
          </span>
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
          v-for="(song, i) in playList"
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
  </div>
</template>

<script>
import MusicMainBoard from '../music-main-board'
import { getSizeImage } from '@/utils/formatData'
import {
  onMounted,
  onUpdated,
  reactive,
  watch,
  ref,
  nextTick,
  computed,
} from 'vue'
import { useStore } from 'vuex'
import { Toast, Dialog } from 'vant'

export default {
  components: {
    MusicMainBoard,
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

    //进度条颜色
    const gradientColor = ref({
      '0%': '#3fecff',
      '100%': '#6149f6',
    })

    const isShowPlayList = ref(false)
    const isCurrentPlay = ref(false)

    const audioDom = ref(null)
    const audioRef = (el) => (audioDom.value = el)

    onMounted(() => {
      state.avatarUrl =
        getSizeImage(store.state.currentSong.avatarUrl, 150) ||
        requied('@/assets/img/music.png')
      state.songName = store.state.currentSong.songName
      state.author = store.state.currentSong.author

      if (store.state.currentSong.id) {
        store.dispatch('getLyric', { id: store.state.currentSong.id })
      }
    })

    onUpdated(() => {
      state.songName = store.state.currentSong.songName
      state.avatarUrl = getSizeImage(store.state.currentSong.avatarUrl, 150)
      state.author = store.state.currentSong.author
    })

    watch(
      () => store.state.currentSong,
      () => {
        if (store.state.playList.length) {
          state.isPlaying = true
          nextTick(() => {
            audioDom.value.play()
          })
          //在播放音乐后才能获得播放时长，所以这里设置延迟获取歌曲播放时长
          setTimeout(() => {
            store.commit('changeDuration', audioDom.value.duration)
          }, 1000)

          updateTime()
        } else {
          state.isPlaying = false
        }
      }
    )

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
      if (store.state.intervalId) {
        clearInterval(store.state.intervalId)
      }
      store.state.intervalId = setInterval(() => {
        store.commit('changeCurrentTime', audioDom.value.currentTime)
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
      isShowPlayList.value = !isShowPlayList.value

      //让播放列表滚动到当前播放的歌的位置
      nextTick(() => {
        let activeEl = document.querySelector('.playActive')
        if (!activeEl) return
        activeEl.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      })
    }

    //播放音乐列表里的歌
    function playSong(song, i) {
      store.commit('changeCurrentSong', song)
      store.commit('changeCurrentSongIndex', i)
      // console.log(store.state.currentSongIndex)
    }

    //移除一首播放列表里的歌
    function removeSong(songIndex) {
      // console.log(songIndex)
      store.commit('removeOneSong', songIndex)
    }

    //清空播放列表
    function clearPlayList() {
      if (store.state.playList.length === 0) {
        Toast('播放列表为空')
        return
      }
      Dialog.confirm({
        // title: '标题',
        message: '是否清空播放列表？',
      })
        .then(() => {
          //TODO
          store.commit('clearPlayList')
        })
        .catch(() => {})
    }

    //拖动滚动条的时候就改变播放时间
    function changeProgress(value) {
      audioDom.value.currentTime = value
    }

    //让一首歌重新播放
    function playAgain() {
      audioDom.value.currentTime = 0
      audioDom.value.play()
    }

    return {
      state,
      isShowPlayList,
      isCurrentPlay,
      audioRef,
      audioDom,
      gradientColor,
      playOrPause,
      store,
      showBoard,
      hideBoard,
      updateTime,
      showPlayList,
      playSong,
      changeProgress,
      removeSong,
      clearPlayList,
      playAgain,
      currentTime: computed(() => store.state.currentTime),
      currentSong: computed(() => store.state.currentSong),
      playList: computed(() => store.state.playList),
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

    .iconfont {
      font-size: 0.48rem;
    }

    .play-status {
      margin-right: 0.35rem;
    }
  }

  .van-slider {
    position: absolute;
    width: 7.5rem;
    top: 0;
    left: 0;
  }

  .popup {
    .header {
      position: fixed;
      background-color: #fff;
      width: 7.2rem;
      height: 1rem;
      margin-left: 0.15rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 0.1rem;
      z-index: 999;

      .text {
        margin-left: 0.15rem;
        font-size: 0.32rem;
        color: #666;
        font-weight: 700;
        .play-list-count {
          font-size: 0.25rem;
          color: #999;
        }
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
  animation: bounce-in 0.3s;
}
.bounce-leave-active {
  animation: bounce-in 0.3s reverse;
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

