<template>
  <div class="song-list-header">
    <NavHeader title="歌单" linkTo="/" />
    <div class="cover-bg">
      <img :src="changePicSize(state.coverBg || state.coverImgUrl, 250)" />
    </div>
    <div class="description">
      <div class="left-content">
        <img :src="changePicSize(state.coverImgUrl, 150)" />
        <div class="play-count">
          <i class="iconfont icon-bofang"></i>
          {{ changeData(state.playCount) }}
        </div>
      </div>
      <div class="right-content">
        <div class="album-name">{{ state.albumName }}</div>
        <div class="creator">
          <img class="avatar" :src="state.creator.avatarUrl" />
          <span class="nickname">{{ state.creator.nickname }}</span>
        </div>
        <div class="album-desc">{{ state.description }}</div>
      </div>
    </div>
    <div class="item-list">
      <div class="icon-item">
        <i class="iconfont icon-chat_active"></i>
        <span>{{ state.commentCount }}</span>
      </div>
      <div class="icon-item">
        <i class="iconfont icon-fenxiang"></i>
        <span>{{ state.shareCount }}</span>
      </div>
      <div class="icon-item">
        <i class="iconfont icon-xiazai"></i>
        <span>下载</span>
      </div>
      <div class="icon-item">
        <i class="iconfont icon-duoxuan"></i>
        <span>多选</span>
      </div>
    </div>
  </div>
</template>

<script>
import { changeValue, getSizeImage } from '@/utils/formatData'
import NavHeader from '../nav-header'
import { onMounted, ref } from 'vue'
export default {
  props: {
    state: { type: Object, required: true },
  },
  components: {
    NavHeader,
  },

  setup() {
    function changeData(data) {
      return changeValue(data)
    }

    function changePicSize(picUrl, size) {
      return getSizeImage(picUrl, size)
    }

    return {
      changeData,
      changePicSize,
    }
  },
}
</script>

<style lang="less" scoped>
.song-list-header {
  position: relative;
  height: 6rem;
  .cover-bg {
    width: 7.5rem;
    height: 6.5rem;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -999;
    img {
      width: 100%;
      height: 100%;
      filter: blur(100px);
    }
  }

  .description {
    display: flex;
    padding: 0.4rem 0.4rem;
    margin-top: 1rem;

    .left-content {
      position: relative;
      z-index: -99;
      img {
        border-radius: 0.12rem;
        width: 3rem;
        height: 3rem;
      }

      .play-count {
        position: absolute;
        font-size: 0.18rem;
        right: 0.1rem;
        top: 0.05rem;
        color: #fff;
      }
    }

    .right-content {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      margin-left: 0.2rem;

      .album-name {
        color: #fff;
        font-weight: 700;
        line-height: 0.55rem;
      }

      .creator {
        display: flex;
        .avatar {
          width: 0.42rem;
          height: 0.42rem;
          border-radius: 50%;
          margin-right: 0.1rem;
        }
        .nickname {
          display: block;
          height: 0.42rem;
          line-height: 0.42rem;
          color: #f2f2f2;
          font-size: 0.2rem;
        }
      }

      .album-desc {
        color: #f2f2f2;
        font-size: 0.15rem;
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }

  .item-list {
    margin-top: 0.6rem;
    display: flex;
    justify-content: space-around;

    .icon-item {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin-bottom: 0.3rem;

      .iconfont {
        color: #fff;
        font-size: 0.4rem;
      }

      span {
        color: #f1f1f1;
        padding-top: 0.12rem;
        font-size: 0.26rem;
      }
    }
  }
}
</style>