<template>
  <van-swipe class="my-swipe" :autoplay="3000" indicator-color="orangered">
    <van-swipe-item v-for="(banner, i) in state.banners" :key="i">
      <img
        v-lazy="changePicSize(banner.imageUrl, 500, 200)"
        :alt="banner.typeTitle"
      />
    </van-swipe-item>
  </van-swipe>
</template>

<script>
import { getSizeImage } from '@/utils/formatData'
import { getBanner } from '@/service/api'
import { onMounted, reactive } from 'vue'
export default {
  setup() {
    const state = reactive({
      banners: [],
    })

    onMounted(async () => {
      const res = await getBanner()
      state.banners = res.banners
    })

    function changePicSize(picUrl, width, height) {
      return getSizeImage(picUrl, width, height)
    }

    return {
      state,
      changePicSize,
    }
  },
}
</script>

<style lang="less" scoped>
.my-swipe .van-swipe-item {
  width: 7rem;
  padding: 0 0.25rem;
  height: 2.6rem;

  img {
    border-radius: 0.1rem;
    width: 100%;
  }
}
</style>

<style lang="less">
.van-swipe__indicator {
  width: 0.12rem;
  height: 0.12rem;
}
</style>