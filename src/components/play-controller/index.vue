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
      <i class="iconfont icon-yinleliebiao-"></i>
    </div>

    <transition name="bounce">
      <MusicMainBoard
        v-show="state.showBoard"
        @back="hideBoard"
        :bg="state.avatarUrl"
        :isPlaying="state.isPlaying"
        :playOrPause="playOrPause"
        :songName="state.songName"
        :author="state.author"
      />
    </transition>

    <audio
      :ref="audioRef"
      :src="`https://music.163.com/song/media/outer/url?id=${store.state.currentSong.id}.mp3`"
    ></audio>
  </div>
</template>

<script>
import MusicMainBoard from '../music-main-board'
import { getSizeImage } from '@/utils/formatData'
import { onMounted, onUpdated, reactive } from 'vue'
import { useStore } from 'vuex'
import { Toast } from 'vant'
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

    let audioDom
    const audioRef = (el) => (audioDom = el)

    onMounted(() => {
      state.avatarUrl = getSizeImage(store.state.currentSong.al.picUrl, 150)
      state.songName = store.state.currentSong.name
      state.author = store.state.currentSong.al.name

      if (store.state.currentSong.id) {
        store.dispatch('GET_LYRIC', { id: store.state.currentSong.id })
      }
    })

    onUpdated(() => {
      state.songName = store.state.currentSong.name
      state.avatarUrl = getSizeImage(store.state.currentSong.al.picUrl, 150)
      state.author = store.state.currentSong.al.name
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
        audioDom.play()
        updateTime()
      } else {
        //暂停歌曲
        state.isPlaying = false
        audioDom.pause()
        clearInterval(store.state.intervalId)
      }
    }

    //更新歌词的时间
    function updateTime() {
      store.state.intervalId = setInterval(() => {
        store.commit('CHANGE_CURRENT_TIME', audioDom.currentTime)
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

    return {
      state,
      audioRef,
      playOrPause,
      store,
      showBoard,
      hideBoard,
      updateTime,
    }
  },
}
</script>

<style lang="less" scoped>
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
    .iconfont {
      font-size: 0.48rem;
    }

    .play-status {
      margin-right: 0.35rem;
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