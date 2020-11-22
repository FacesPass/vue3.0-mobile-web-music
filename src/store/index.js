import { createStore } from 'vuex'
import { getLyric } from '../service/api'
import { Toast } from 'vant'

export default createStore({
  state: {
    playList: [],   //播放列表
    currentSongIndex: 0,  //当前播放歌曲下标
    currentSong: {
      name: '暂无音乐',
      al: {
        picUrl: require('@/assets/img/music.png')
      }
    },  //当前播放歌曲，里面给一些默认初始数据
    lyric: '',  //歌词
    intervalId: '',  //定时器的id
    currentTime: '' //当前歌曲播放进度时间
  },
  mutations: {
    //改变播放列表
    CHANGE_PLAY_LIST(state, playList) {
      state.playList = playList
    },
    //改变当前歌曲的下标
    CHANGE_CURRENT_SONG_INDEX(state, songIndex) {
      state.currentSongIndex = songIndex
    },
    //改变当前播放歌曲
    CHANGE_CURRENT_SONG(state, currentSong) {
      state.currentSong = currentSong
    },
    //改变歌词信息
    CHANGE_CURRENT_LYRIC(state, lyric) {
      state.lyric = lyric
    },
    //改变播放时间
    CHANGE_CURRENT_TIME(state, time) {
      state.currentTime = time
    }
  },
  actions: {
    async GET_LYRIC(context, payload) {
      try {
        const res = await getLyric(payload.id)
        console.log(res)
        context.commit('CHANGE_CURRENT_LYRIC', res.lrc.lyric)
      } catch (err) {
        Toast('该歌曲暂无歌词')
        context.commit('CHANGE_CURRENT_LYRIC', '')
      }
    },
  },

  getters: {
    lyricList(state) {
      let arr = state.lyric.split(/\n/gis).map((item, i, arr) => {
        //分钟
        let min = item.slice(1, 3)
        //秒
        let sec = item.slice(4, 6)
        //毫秒
        let mil = item.slice(7, 9)

        return {
          min, sec, mil,
          lyric: item.slice(10, item.length).replace(']', ''),
          item,
          //将时间转成时间戳
          time: parseInt(mil) + parseInt(sec) * 1000 + parseInt(min) * 60 * 1000
        }
      })

      //计算下一段时间，用于当前歌词的高亮展示
      arr.forEach((item, i) => {
        if (i !== arr.length - 1) {
          item.nextTime = arr[i + 1].time
        }
      })
      // console.log(arr)
      return arr
    }
  },
  modules: {
  }
})
