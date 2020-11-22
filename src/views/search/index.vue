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
          placeholder="输入搜索歌曲"
        />
      </form>
    </div>
    <div class="history">
      <div class="left">历史</div>
      <div class="right" ref="rightHisRef">
        <div class="content" ref="keywordHisRef">
          <div
            class="keyword-item"
            v-for="(search, i) in state.historySearch"
            :key="i"
          >
            {{ search }}
          </div>
        </div>
      </div>
      <i class="iconfont icon-detail" @click="clearHistory"></i>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import { Dialog } from 'vant'
import { nextTick, onBeforeMount, onMounted, reactive, ref, watch } from 'vue'
export default {
  setup() {
    const state = reactive({
      keyword: '',
      historySearch: [],
    })
    const rightHisRef = ref(null)
    const keywordHisRef = ref(null)
    const totalWidth = ref(0)
    const keywordItemDom = ref(null)

    onBeforeMount(() => {
      state.historySearch = localStorage.historySearch
        ? JSON.parse(localStorage.historySearch)
        : []
    })

    onMounted(() => {
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
    })

    function search() {
      state.historySearch.push(state.keyword)
      localStorage.historySearch = JSON.stringify(state.historySearch)
      state.keyword = ''
    }

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
      rightHisRef,
      keywordHisRef,
      clearHistory,
    }
  },
}
</script>

<style lang="less" scoped>
.search {
  width: 7.5rem;
  overflow: hidden;
  padding: 0.2rem;
  .nav-top {
    display: flex;
    align-items: center;

    .icon-back {
      width: 0.5rem;
      font-size: 0.5rem;
      margin-right: 0.2rem;
      color: #666;
    }

    .form {
      width: 6.8rem;

      .input {
        width: 100%;
        border: none;
        border-bottom: 1px solid #ccc;
        padding-bottom: 0.15rem;

        &::placeholder {
          color: #a6a6a6;
        }
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
      }
    }
  }

  .icon-detail {
    font-size: 0.35rem;
    margin-left: 0.3rem;
  }
}
</style>

<style lang="less">
.van-dialog__confirm,
.van-dialog__confirm:active {
  color: #0094f7;
}
</style>