<template>
  <div class="search">
    <div class="nav-top">
      <i class="iconfont icon-back" @click="$router.go(-1)"></i>
      <form
        class="form"
        action="javascript:return true;"
        @submit.prevent="() => false"
      >
        <input
          class="input"
          @keydown.enter="search"
          v-model="state.keyword"
          :placeholder="state.defaultKeyword"
          @focus="state.isFocus = true"
          @blur="blurInput"
        />
      </form>
    </div>
    <!-- 搜索建议框 -->
    <div class="search-suggest" v-show="state.isFocus && state.keyword">
      <div class="suggest-item" @click="toSearchMusicList(state.keyword)">
        搜索 "{{ state.keyword }}"
      </div>
      <div
        class="suggest-item"
        v-for="(item, i) in state.searchSuggestList"
        :key="i"
        @click="toSearchMusicList(item.keyword)"
      >
        <i class="iconfont icon-search3-copy"></i>
        {{ item.keyword }}
      </div>
    </div>
    <!-- 历史搜索记录 -->
    <div class="history" v-if="state.historySearch.length !== 0">
      <div class="left">历史</div>
      <div class="right" ref="rightHisRef">
        <div class="content" ref="keywordHisRef">
          <div
            class="keyword-item"
            v-for="(search, i) in state.historySearch"
            :key="i"
            @click="toSearchMusicList(search, true)"
          >
            {{ search }}
          </div>
        </div>
      </div>
      <i class="iconfont icon-detail" @click="clearHistory"></i>
    </div>

    <!-- 热搜榜单 -->
    <div class="hot-search">
      <ItemHeader fontSize="0.3" title="热搜榜" :isShowRight="false" />
      <div class="item-list">
        <div
          @click="toSearchMusicList(item.searchWord)"
          class="item"
          v-for="(item, i) in state.hotSearchList"
          :key="i"
        >
          <div class="index">{{ i + 1 }}</div>
          <div class="name">{{ item.searchWord }}</div>
          <img v-if="item.iconUrl" class="icon" :src="item.iconUrl" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import { Dialog } from 'vant'
import { nextTick, onBeforeMount, onMounted, reactive, ref, watch } from 'vue'
import ItemHeader from '@/components/item-header'

import {
  getDefaultKeyword,
  getSearchSuggest,
  getHotSearch,
} from '@/service/api'
import { debounce } from '@/utils/help'
import { useRouter } from 'vue-router'
export default {
  components: {
    ItemHeader,
  },
  setup() {
    const state = reactive({
      keyword: '',
      defaultKeyword: '',
      isFocus: false,
      searchSuggestList: [],
      hotSearchList: [],
      historySearch: [],
    })
    const rightHisRef = ref(null)
    const keywordHisRef = ref(null)
    const totalWidth = ref(0)
    const keywordItemDom = ref(null)

    const router = useRouter()

    onBeforeMount(async () => {
      state.historySearch = localStorage.historySearch
        ? JSON.parse(localStorage.historySearch)
        : []

      //获取默认搜索关键词
      const res = await getDefaultKeyword()
      // console.log(res)
      state.defaultKeyword = res.data.realkeyword

      //获取热门搜索列表
      const hotSearch = await getHotSearch()
      // console.log(hotSearch)
      state.hotSearchList = hotSearch.data
    })

    onMounted(() => {
      if (state.historySearch.length !== 0) {
        keywordItemDom.value = document.querySelectorAll('.keyword-item')
        Array.from(keywordItemDom.value).forEach((ele) => {
          totalWidth.value += ele.offsetWidth + 11
        })

        //初始化better-scroll操作
        keywordHisRef.value.style.width = totalWidth.value + 'px'
        new BScroll(rightHisRef.value, {
          scrollX: true,
          scrollY: false,
          click: true,
        })
      }
    })

    //监听关键词，输入关键词时触发搜索关键词提示，使用防抖函数
    watch(
      () => state.keyword,
      debounce(async (newKeyword) => {
        if (!state.keyword) {
          state.searchSuggestList = []
          return
        }
        const res = await getSearchSuggest(newKeyword)
        state.searchSuggestList = res.result.allMatch
        // console.log(state.searchSuggestList)
      }, 100)
    )

    function blurInput() {
      setTimeout(() => {
        state.isFocus = false
      }, 300)
    }

    function search() {
      // console.log(state.keyword)
      if (!state.keyword.trim()) return
      //每次搜索后就将搜索记录缓存到本地
      state.historySearch.unshift(state.keyword)
      localStorage.historySearch = JSON.stringify(state.historySearch)

      //路由跳转到搜索音乐列表页面
      router.push({
        path: '/searchMusicList',
        query: { keyword: state.keyword },
      })
    }

    function toSearchMusicList(keyword, isLocalStorage = false) {
      state.keyword = keyword

      //每次搜索后就将搜索记录缓存到本地
      if (!isLocalStorage) {
        state.historySearch.unshift(state.keyword)
        localStorage.historySearch = JSON.stringify(state.historySearch)
      }
      router.push({
        path: '/searchMusicList',
        query: { keyword: state.keyword },
      })
    }

    // function clickHistoryItem(item) {
    //   //路由跳转到搜索音乐列表页面
    //   router.push({
    //     path: '/searchMusicList',
    //     query: { keyword: item },
    //   })
    // }

    function clearHistory() {
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
      search,
      focus,
      rightHisRef,
      keywordHisRef,
      clearHistory,
      toSearchMusicList,
      blurInput,
    }
  },
}
</script>

<style lang="less" scoped>
@import url('../../style.less');
.search {
  width: 7.5rem;
  height: 100vh;
  overflow: hidden;
  padding: 0.2rem;
  .nav-top {
    display: flex;
    align-items: center;
    position: relative;

    .icon-back {
      font-size: 0.48rem;
      margin-right: 0.2rem;
      color: #666;
    }

    .form {
      width: 6.8rem;

      .input {
        width: 100%;
        border: none;
        border-bottom: 1px solid #ccc;
        padding-bottom: 0.06rem;

        &::placeholder {
          color: #a6a6a6;
        }
      }
    }
  }

  .search-suggest {
    position: absolute;
    width: 6.5rem;
    height: auto;
    left: 50%;
    top: 1.1rem;
    margin-left: -3.25rem;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 0.1rem;
    z-index: 99;

    .suggest-item {
      width: 100%;
      padding: 0.2rem 0.2rem;
      color: #888;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      border-bottom: 1px solid #f2f2f2;

      &:first-child {
        color: @themeColor;
      }

      .icon-search3-copy {
        margin-right: 0.1rem;
        color: #ccc;
      }

      &:hover {
        background-color: #ccc;
      }
    }
  }

  .history {
    margin-top: 0.4rem;
    display: flex;
    align-items: center;
    height: 0.5rem;
    .left {
      margin-right: 0.2rem;
      font-weight: 700;
      font-size: 0.28rem;
      width: 0.6rem;
    }

    .right {
      width: 5.6rem;
      overflow: hidden;

      .content {
        display: flex;
        flex-wrap: nowrap;
      }

      .keyword-item {
        display: inline-block;
        background-color: #f2f2f2;
        padding: 2px 6px;
        border-radius: 0.3rem;
        margin-right: 0.2rem;
        white-space: nowrap;
      }
    }
  }

  .icon-detail {
    font-size: 0.3rem;
    margin-left: 0.3rem;
    color: #999;
  }

  .hot-search {
    .item-header {
      padding-left: 0;
      margin: 0.5rem 0 0.15rem;
    }

    .item-list {
      display: flex;
      flex-wrap: wrap;
      border-top: 1px solid #ececec;
      padding-top: 0.15rem;
      .item {
        width: 50%;
        padding: 0.12rem 0;
        display: flex;
        align-items: center;
        font-size: 0.28rem;
        &:hover {
          background-color: #ccc;
        }

        // 让排行榜前三个的下标变红
        &:nth-child(-n + 3) {
          font-weight: 700;
          .index {
            color: #ff3a3a;
          }
        }

        .index {
          width: 0.6rem;
          color: #888;
        }

        .name {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          margin-right: 0.05rem;
          color: #333;
        }

        .icon {
          margin-left: 0.1rem;
          margin-right: 0.4rem;
          width: 0.28rem;
          height: 0.2rem;
        }
      }
    }
  }
}
</style>

<style lang="less">
// 动画效果
.search-enter-active {
  animation: search-in 0.6s;
  overflow: hidden;
}

@keyframes search-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
  }
}
</style>