<template>
  <div class="top-nav">
    <div class="top-left">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-liebiao"></use>
      </svg>
    </div>
    <div class="top-center">
      <span class="nav-btn active">我的</span>
      <span class="nav-btn">发现</span>
      <span class="nav-btn">云村</span>
      <span class="nav-btn">视频</span>
    </div>
    <div class="top-right">
      <i class="iconfont icon-icon-search" @click="$router.push('/search')"></i>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.top-nav {
  width: 7.5rem;
  height: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.2rem;

  .icon {
    padding-top: 0.05rem;
    width: 0.38rem;
    height: 0.38rem;
  }

  .top-left,
  .top-right {
    display: flex;
  }

  .top-center {
    width: 4rem;
    display: flex;
    justify-content: space-around;
    font-size: 0.4rem;
    align-items: center;
    .active {
      font-weight: 900;
    }
  }

  .icon-icon-search {
    font-size: 0.43rem;
  }
}
</style>
