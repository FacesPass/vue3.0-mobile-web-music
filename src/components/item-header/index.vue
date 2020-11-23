<template>
  <div class="item-header">
    <div class="title" :style="{ fontSize: fontSize + 'rem' }">{{ title }}</div>
    <div class="right-text" v-show="isShowRight">
      <i class="iconfont" :class="rightIcon"></i>
      <span>{{ rightText }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, required: true },
    fontSize: { type: String, required: true },
    rightIcon: String,
    rightText: String,
    isShowRight: { type: Boolean, default: true },
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
    font-weight: 800;
  }

  .right-text {
    font-size: 0.24rem;
    border: 0.01rem solid #ccc;
    border-radius: 0.2rem;
    padding: 0.04rem 0.12rem;

    .iconfont {
      font-size: 0.24rem;
      margin-right: 0.08rem;
    }
  }
}
</style>