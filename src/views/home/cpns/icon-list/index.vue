<template>
  <div class="icon-list">
    <div class="icon-item">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-tuijian1"></use>
      </svg>
      <span>每日推荐</span>
    </div>
    <div class="icon-item">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-diantai"></use>
      </svg>
      <span>私人FM</span>
    </div>
    <div class="icon-item">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-gedan1"></use>
      </svg>
      <span>歌单</span>
    </div>
    <div class="icon-item">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-paihangbang1"></use>
      </svg>
      <span>排行榜</span>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.icon-list {
  display: flex;
  justify-content: space-between;
  padding: 0.4rem;

  .icon {
    width: 0.5rem;
    height: 0.5rem;
  }

  .icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    span {
      font-size: 0.25rem;
    }
  }
}
</style>