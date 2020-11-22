<template>
  <div class="item-header">
    <div class="title">{{ title }}</div>
    <div class="right-text">
      <i class="iconfont" :class="rightIcon"></i>
      <span>{{ rightText }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, required: true },
    rightIcon: String,
    rightText: { type: String, required: true },
  },
}
</script>


<style lang="less" scoped>
.item-header {
  width: 7.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.4rem;

  .title {
    font-size: 0.35rem;
    font-weight: 800;
  }

  .right-text {
    font-size: 0.24rem;
    border: 0.01rem solid #ccc;
    border-radius: 0.18rem;
    padding: 0.04rem 0.12rem;

    .icon-bofang {
      font-size: 0.24rem;
    }
  }
}
</style>