<template>
  <div class="song-album">
    <ItemHeader title="发现好歌单" rightText="查看更多" fontSize="0.35" />
    <div class="album-list" ref="albumListRef">
      <div class="content" ref="albumRef">
        <router-link
          class="album-item"
          v-for="album in state.albumList"
          :key="album.id"
          :to="{ path: '/songList', query: { id: album.id } }"
        >
          <div class="img-detail">
            <img
              v-lazy="changePicSize(album.picUrl, 200)"
              :alt="album.copywriter"
            />
            <span class="play-count">
              <i class="iconfont icon-bofang"></i>
              <span>{{ changePlayCount(album.playCount) }}</span>
            </span>
          </div>
          <div class="album-name">{{ album.name }}</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import ItemHeader from '@/components/item-header'
import { nextTick, onMounted, reactive, ref } from 'vue'

import { changeValue, getSizeImage } from '@/utils/formatData'
import { getRecommendAlbumList } from '@/service/api'
export default {
  components: {
    ItemHeader,
  },

  setup() {
    const state = reactive({
      albumList: [],
    })

    const albumListRef = ref(null)
    const albumRef = ref(null)

    onMounted(async () => {
      const res = await getRecommendAlbumList()
      state.albumList = res.result

      //初始化better-scroll操作
      albumRef.value.style.width = state.albumList.length * 2.3 + 'rem'
      new BScroll(albumListRef.value, {
        scrollX: true,
        scrollY: false,
        click: true,
      })
    })

    function changePlayCount(val) {
      return changeValue(val)
    }

    function changePicSize(picUrl, size = 60) {
      return getSizeImage(picUrl, size)
    }

    return {
      albumListRef,
      albumRef,
      state,
      changePlayCount,
      changePicSize,
    }
  },

  // data() {
  //   return {
  //     albumList: [],
  //   }
  // },

  // async mounted() {
  //   const res = await getRecommendAlbumList()
  //   console.log(res)
  //   this.albumList = res.result

  //   //better-scroll的初始化操作
  //   this.$refs.album.style.width = this.albumList.length * 2.3 + 'rem'
  //   let scroll = new BScroll(this.$refs.albumList, {
  //     scrollX: true,
  //     scrollY: false,
  //   })
  // },

  // methods: {
  //   changePlayCount(val) {
  //     return changeValue(val)
  //   },
  // },
}
</script>

<style lang="less" scoped>
.song-album {
  width: 7.5rem;
  overflow: hidden;

  .album-list {
    margin-top: 0.15rem;
    .content {
      height: 2.82rem;
      display: flex;
    }

    .album-item {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 2.3rem;
      height: 2.1rem;
      margin-right: 0.14rem;

      img {
        width: 100%;
        border-radius: 0.15rem;
      }

      .play-count {
        position: absolute;
        right: 0.05rem;
        top: 0.05rem;
        font-size: 0.08rem;
        color: #fff;

        .icon-bofang {
          font-size: 0.08rem;
        }
      }

      .album-name {
        height: 0.6rem;
        color: #000;
        font-size: 0.2rem;
        display: -webkit-box;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }

    .album-item:first-child {
      margin-left: 0.4rem;
    }

    .album-item:last-child {
      margin-right: 0.4rem;
    }
  }
}
</style>