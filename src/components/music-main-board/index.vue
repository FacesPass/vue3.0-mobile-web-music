<template>
  <div class="music-main-board">
    <!-- 背景图 -->
    <div
      class="bg"
      :style="{
        backgroundImage: `url(${bg})`,
      }"
    ></div>
    <!-- 头部 -->
    <div class="play-header">
      <div class="header-left">
        <div class="back iconfont icon-back" @click="$emit('back')"></div>
        <div class="header-center">
          <div class="name">{{ songName }}</div>
          <div class="author">{{ author }}</div>
        </div>
      </div>
      <div class="header-right">
        <div class="icon-item iconfont icon-fenxiang"></div>
      </div>
    </div>
    <!-- 那一根条条 -->
    <div class="play-content" v-show="!isLyric">
      <img
        class="needle"
        :class="[isPlaying ? 'active' : '']"
        src="@/assets/img/needle.png"
        alt=""
      />
      <!-- 旋转的CD -->
      <div :ref="rotateCdRef" class="cd-img" @click="showLyric">
        <img class="play-circle" src="@/assets/img/playCircle.png" />
        <img class="music-pic" :src="bg" />
      </div>
    </div>
    <!-- 歌词列表 -->
    <div @click="showLyric" class="lyric" v-show="isLyric" ref="lyricRef">
      <p
        v-for="(item, i) in $store.getters.lyricList"
        :key="i"
        :class="{
          active:
            currentTime * 1000 >= item.time &&
            currentTime * 1000 < item.nextTime,
        }"
      >
        {{ item.lyric }}
      </p>
    </div>
    <!-- 进度条 -->
    <div class="progress-ctrl">
      <div class="current-time">{{ formatTime(currentTime) }}</div>
      <van-slider
        class="progress"
        v-model="$store.state.currentTime"
        :max="Math.floor($store.state.duration)"
        bar-height="4px"
        active-color="#5292FE"
        button-size="12px"
        @change="changeProgress"
      />
      <div class="duration">{{ formatTime(duration) }}</div>
    </div>

    <!-- 底部控制栏 -->
    <div class="play-footer">
      <!-- 播放顺序 -->
      <div
        class="sequnce iconfont"
        :class="sequnceIcon"
        @click="changeSequence"
      ></div>
      <!-- 上一首歌 -->
      <div class="iconfont icon-shangyishou" @click="goPlay(-1)"></div>
      <div
        class="play iconfont"
        :class="[isPlaying ? 'icon-zanting' : 'icon-bofang1']"
        @click="playOrPause"
      ></div>
      <!-- 下一首歌 -->
      <div class="iconfont icon-xiayishou" @click="goPlay(1)"></div>
      <div
        class="iconfont icon-bofangliebiao1"
        @click="$emit('show-play-list')"
      ></div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, nextTick } from 'vue'
import { mapState, useStore } from 'vuex'
import { Toast } from 'vant'

import { secToMin } from '@/utils/formatData'
import { getRandomNum, debounce } from '@/utils/help'
export default {
  props: {
    bg: {
      type: String,
      required: true,
    },
    playOrPause: {
      type: Function,
      required: true,
    },
    isPlaying: {
      type: Boolean,
      required: true,
    },
    songName: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
      default: '暂无',
    },
  },

  setup(props, context) {
    const isLyric = ref(false)
    const store = useStore()

    const rotateCdDom = ref(null)
    const rotateCdRef = (el) => (rotateCdDom.value = el)

    const sequnceIcon = ref('icon-xunhuanbofang1')

    //监听时间变化
    watch(
      () => store.state.currentTime,
      () => {
        //当当前时间等于结束时间的时候，就自动播放下一首
        if (
          Math.floor(store.state.currentTime) >=
          Math.floor(store.state.duration)
        ) {
          goPlay(1)
        }
        //歌词滚动
        let el = document.querySelector('p.active')
        if (!el) return
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
    )
    //当前歌曲发生改变的时候，根据歌曲id重新获取歌词
    watch(
      () => store.state.currentSong,
      () => {
        if (store.state.playList.length) {
          store.dispatch('getLyric', {
            id: store.state.currentSong.id,
          })
        }
      }
    )

    watch(
      () => props.isPlaying,
      (newVal) => {
        if (newVal) {
          rotateCdDom.value.style.webkitAnimationPlayState = 'running'
        } else {
          rotateCdDom.value.style.webkitAnimationPlayState = 'paused'
        }
      }
    )

    //控制播放上一首和一下首（加个防抖）
    const goPlay = debounce(function (num) {
      if (store.state.playList.length === 0) {
        return
      }
      if (store.state.playList.length === 1) {
        context.emit('play-again')
        return
      }

      switch (store.state.sequence) {
        //顺序播放时
        case 0:
          let curSongIdx = store.state.currentSongIndex
          let newSongIdx = curSongIdx + num
          if (newSongIdx > store.state.playList.length - 1) {
            newSongIdx = 0
          }
          if (newSongIdx < 0) {
            newSongIdx = store.state.playList.length - 1
          }
          store.commit('changeCurrentSongIndex', newSongIdx)
          store.commit('changeCurrentSong', store.state.playList[newSongIdx])
          break
        //随机播放时
        case 1:
          let idx = getRandomNum(store.state.playList.length)
          console.log(idx, store.state.currentSongIndex)
          if (idx === store.state.currentSongIndex) {
            idx = getRandomNum(store.state.playList.length)
          }
          store.commit('changeCurrentSongIndex', idx)
          store.commit('changeCurrentSong', store.state.playList[idx])
          break
        //单曲循环时
        case 2:
          let audioEl = document.querySelector('audio')
          audioEl.currentTime = 0
          audioEl.play()
          break
        default:
          break
      }
    }, 500)

    //切换歌词显示
    function showLyric() {
      if (!store.state.lyric) {
        Toast('该歌曲暂无歌词')
        return
      }
      isLyric.value = !isLyric.value
    }

    //将歌词显示时间转化为分：秒的格式
    function formatTime(time) {
      return secToMin(time)
    }

    //触发父组件中的改变进度条方法
    function changeProgress(value) {
      // console.log(value)
      context.emit('change-progress', value)
    }

    //改变播放顺序
    function changeSequence() {
      store.commit('changeSequence')
      switch (store.state.sequence) {
        case 0:
          sequnceIcon.value = 'icon-xunhuanbofang1'
          break
        case 1:
          sequnceIcon.value = 'icon-suijibofang'
          break
        case 2:
          sequnceIcon.value = 'icon-danquxunhuan1'
          break
        default:
          sequnceIcon.value = 'icon-xunhuanbofang1'
      }
    }

    return {
      isLyric,
      rotateCdDom,
      rotateCdRef,
      sequnceIcon,
      goPlay,
      showLyric,
      formatTime,
      changeProgress,
      changeSequence,
      currentTime: computed(() => store.state.currentTime),
      currentSong: computed(() => store.state.currentSong),
      duration: computed(() => store.state.duration),
    }
  },
}
</script>

<style lang="less" scoped>
@import url('../../style.less');
@fontColor: #fff;
.music-main-board {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: @themeColor;
  z-index: 999;

  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    background-size: auto 100%;
    background-position: center;
    filter: blur(70px);
  }

  .play-header,
  .header-left,
  .header-right {
    z-index: 99;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: @fontColor;
  }

  .play-header {
    padding: 0.2rem 0.25rem;
    width: 7.5rem;

    .header-center {
      width: 5.5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow: hidden;

      .name,
      .author {
        margin-left: 0.25rem;
        color: @fontColor;
      }

      .name {
        font-size: 0.35rem;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        animation: scroll 7s linear infinite;
      }

      @keyframes scroll {
        0% {
          transform: translateX(6rem);
        }

        100% {
          transform: translateX(-6rem);
        }
      }

      .author {
        font-size: 0.25rem;
      }
    }
  }

  .header-left,
  .header-right,
  .iconfont {
    font-size: 0.5rem;
  }

  .play-content {
    width: 7.5rem;
    position: absolute;
    left: 0;
    top: 1.3rem;
    .needle {
      width: 2.2rem;
      position: absolute;
      left: 3.2rem;
      z-index: 10;
      transform-origin: 0.3rem 0;
      transition: all 1s;
      transform: rotate(-20deg);
    }

    .needle.active {
      transform: rotate(0deg);
    }

    .cd-img {
      position: absolute;
      left: 20%;
      top: 14vh;
      animation: cd-rotate 10s linear infinite;
      animation-play-state: paused;

      .play-circle {
        width: 5rem;
      }

      .music-pic {
        position: absolute;
        width: 3.25rem;
        left: 50%;
        top: 0.85rem;
        border-radius: 50%;
        transform: translateX(-50%);
      }

      @keyframes cd-rotate {
        0% {
          transform: rotate(0deg);
        }

        100% {
          transform: rotate(360deg);
        }
      }
    }
  }

  .lyric {
    width: 7.5rem;
    height: 8rem;
    margin-top: 0.8rem;
    padding: 0 0.25rem;
    overflow: scroll;
    text-align: center;
    position: absolute;
    left: 0;
    top: 1.3rem;
    color: #fff;
    p {
      padding: 0.15rem 0;
      font-size: 0.3rem;
    }
    .active {
      color: @lyricColor;
      font-size: 0.38rem;
      transition: all 1s ease;
    }
  }

  // 进度条
  .progress-ctrl {
    width: 7.5rem;
    position: absolute;
    bottom: 2rem;
    display: flex;
    align-items: center;
    .current-time,
    .duration {
      width: 1.5rem;
      text-align: center;
      color: #fff;
    }
  }

  // 底部控制
  .play-footer {
    width: 7.5rem;
    position: absolute;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0.4rem;
    color: @fontColor;

    .sequnce {
      width: 0.5rem;
    }

    .iconfont {
      font-size: 0.4rem;
    }

    .play {
      font-size: 0.55rem;
    }
  }
}
</style>