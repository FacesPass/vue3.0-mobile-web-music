<template>
  <div class="music-main-board">
    <div
      class="bg"
      :style="{
        backgroundImage: `url(${bg})`,
      }"
    ></div>
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
    <div class="play-content" v-show="!isLyric">
      <img
        class="needle"
        :class="[isPlaying ? 'active' : '']"
        src="@/assets/img/needle.png"
        alt=""
      />
      <div class="cd-img" @click="showLyric">
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
    <div class="progress"></div>
    <!-- 底部控制栏 -->
    <div class="play-footer">
      <div class="iconfont icon-xunhuanbofang1"></div>
      <!-- 上一首歌 -->
      <div class="iconfont icon-shangyishou" @click="goPlay(-1)"></div>
      <div
        class="play iconfont"
        :class="[isPlaying ? 'icon-zanting' : 'icon-bofang1']"
        @click="playOrPause"
      ></div>
      <!-- 下一首歌 -->
      <div class="iconfont icon-xiayishou" @click="goPlay(1)"></div>
      <div class="iconfont icon-bofangliebiao1"></div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { mapState, useStore } from 'vuex'
import { Toast } from 'vant'
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

  computed: {
    ...mapState(['currentTime', 'currentSong']),
  },
  watch: {
    //监听时间变化，让歌词滚动
    currentTime(newVal) {
      let el = document.querySelector('p.active')
      if (!el) return
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    },
    //当前歌词发生改变的时候，重新获取歌词
    currentSong(newVal) {
      this.$store.dispatch('GET_LYRIC', {
        id: this.$store.state.currentSong.id,
      })
    },
  },

  setup() {
    let isLyric = ref(false)
    const store = useStore()

    //控制播放上一首和一下首
    function goPlay(num) {
      if (store.state.playList.length === 0) {
        Toast('当前暂无音乐')
        return
      }
      let curSongIdx = store.state.currentSongIndex
      let newSongIdx = curSongIdx + num
      if (newSongIdx > store.state.playList.length - 1) {
        newSongIdx = 0
      }
      if (newSongIdx < 0) {
        newSongIdx = store.state.playList.length - 1
      }
      store.commit('CHANGE_CURRENT_SONG_INDEX', newSongIdx)
      store.commit(
        'CHANGE_CURRENT_SONG',
        store.state.playList[store.state.currentSongIndex]
      )
    }

    function showLyric() {
      if (!store.state.lyric) {
        Toast('该歌曲暂无歌词')
        return
      }
      isLyric.value = !isLyric.value
    }

    return {
      isLyric,
      goPlay,
      showLyric,
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

    .play-circle {
      position: absolute;
      width: 5rem;
      top: 1.8rem;
      left: 50%;
      transform: translateX(-50%);
    }

    .music-pic {
      position: absolute;
      width: 3.25rem;
      left: 50%;
      top: 2.72rem;
      border-radius: 50%;
      transform: translateX(-50%);
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

    .iconfont {
      font-size: 0.4rem;
    }

    .play {
      font-size: 0.55rem;
    }
  }
}
</style>