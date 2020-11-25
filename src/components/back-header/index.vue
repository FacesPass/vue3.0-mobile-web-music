<template>
  <div class="nav-header" :class="{ changeHeaderStyle: isScrollBottom }">
    <div class="header-left" @click="$router.go(-1)">
      <div class="back iconfont icon-back"></div>
      <div class="title">{{ title }}</div>
    </div>
    <div class="header-right">
      <div
        class="icon-item iconfont icon-icon-search"
        @click="$router.push('/search')"
      ></div>
      <div class="icon-item iconfont icon-shenglvehao"></div>
    </div>
  </div>
</template>

<script>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { throttle } from '@/utils/help'
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    //滚动到离顶部一定高度的时候就开始渐变
    scrollHeight: {
      type: Number,
      requied: true,
    },
  },

  setup(props) {
    const isScrollBottom = ref(false)

    onMounted(() => {
      document.addEventListener('scroll', throttleFn)
    })
    onBeforeUnmount(() => {
      document.removeEventListener('scroll', throttleFn)
    })

    //经过节流处理的滚动事件函数
    let throttleFn = throttle(function () {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop
      // console.log(scrollTop)

      if (scrollTop > props.scrollHeight) {
        isScrollBottom.value = true
      } else {
        isScrollBottom.value = false
      }
    }, 20)

    return {
      isScrollBottom,
    }
  },
}
</script>


<style lang="less" scoped>
.nav-header,
.header-left,
.header-right {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
}

.nav-header {
  padding: 0.2rem 0.25rem;
  width: 7.5rem;
  height: 1rem;
  position: fixed;
  top: 0;

  .title {
    margin-left: 0.25rem;
  }
}
.changeHeaderStyle {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.6),
    rgba(255, 255, 255, 0.2)
  );
}

.header-left,
.header-right,
.iconfont {
  font-size: 0.35rem;
}

.icon-icon-search {
  font-size: 0.45rem;
  margin-right: 0.25rem;
}

.icon-shenglvehao {
  font-size: 0.55rem;
}
</style>