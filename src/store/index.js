import { createStore } from 'vuex'
import { getLyric, getMusicUrl } from '../service/api'
import { Toast } from 'vant'

export default createStore({
  state: {
    playList: [],   //播放列表
    currentSongIndex: 0,  //当前播放歌曲下标
    currentSong: {
      songName: '暂无歌曲', //歌名
      author: '暂无', //作者
      avatarUrl: require('@/assets/img/music.png'),//头像地址
      musicUrl: '',//cd图片地址
    },  //当前播放歌曲，里面给一些默认初始数据
    lyric: '',  //歌词
    intervalId: '',  //定时器的id
    sequence: 0, //播放状态：0 - 顺序播放  1 - 随机播放  2 - 单曲循环
    currentTime: '', //当前歌曲播放进度时间
    duration: '',//当前播放歌曲的总时长
  },
  mutations: {
    //改变播放列表
    changePlayList(state, playList) {
      state.playList = playList
    },
    //改变当前歌曲的下标
    changeCurrentSongIndex(state, songIndex) {
      state.currentSongIndex = songIndex
    },
    //改变当前播放歌曲
    changeCurrentSong(state, currentSong) {
      try {  //如果列表中没有这首歌了则添加进列表，有的话就直接播放
        let idx = state.playList.findIndex((item, i) => {
          return currentSong.id === item.id
        })
        if (idx === -1) {
          state.currentSong = currentSong
          state.playList.push(currentSong)
          state.currentSongIndex = state.playList.length - 1
        } else {
          state.currentSong = state.playList[idx]
          state.currentSongIndex = idx
        }
      } catch (err) {
        console.log(err)
      }
    },
    //改变歌词信息
    changeCurrentLyric(state, lyric) {
      state.lyric = lyric
    },
    //改变播放时间
    changeCurrentTime(state, time) {
      state.currentTime = time
    },
    //播放总时长
    changeDuration(state, duration) {
      state.duration = duration
    },
    changeSequence(state, payload) {
      state.sequence += 1
      if (state.sequence > 2) {
        state.sequence = 0
      }
    },
    //从播放列表中移除一首歌
    removeOneSong(state, index) {
      // console.log(index, state.currentSongIndex, state.playList)
      if (index === state.currentSongIndex) {
        state.playList.splice(index, 1)
        state.currentSongIndex = state.playList.length - 1
        //如果删除列表中最后一首歌的时候，就将当前歌曲恢复初始化
        if (state.currentSongIndex === -1) {
          state.currentSong = {
            songName: '暂无歌曲',
            author: '暂无',
            avatarUrl: require('@/assets/img/music.png'),
            musicUrl: ''
          }
        } else {
          state.currentSong = state.playList[state.currentSongIndex]
        }
      } else {
        state.playList.splice(index, 1)
        state.currentSongIndex = state.playList.length - 1
      }
    },
    //清空播放列表
    clearPlayList(state, playlaod) {
      state.playList = []
      state.duration = 0
      state.currentTime = 0
      state.currentSongIndex = 0
      state.lyric = ''
      state.currentSong = {
        songName: '暂无歌曲',
        author: '暂无',
        avatarUrl: require('@/assets/img/music.png'),
        musicUrl: ''
      }
    }
  },
  actions: {
    //获取歌词
    async getLyric(context, payload) {
      try {
        const res = await getLyric(payload.id)
        // console.log(res)
        if (!res.lrc.lyric) {
          Toast('该歌曲暂无歌词')
          return
        }
        context.commit('changeCurrentLyric', res.lrc.lyric)
      } catch (err) {
        // console.log(err)
        Toast('该歌曲暂无歌词')
        context.commit('changeCurrentLyric', '')
      }
    },

    //获取音乐URL
    async getMusicUrl(context, payload) {
      try {
        const res = await getMusicUrl(payload.id)
        // console.log(res)
        if (!res.data[0].url) {
          Toast('该歌曲暂时无法播放')
          return
        }
        let currentSong = Object.assign({}, payload, { musicUrl: res.data[0].url })
        context.commit('changeCurrentSong', currentSong)
      } catch (err) {
        console.log(err)
      }
    }
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
