<template>
  <div class="nav-header">
    <div class="header-left" @click="$router.push(linkTo)">
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
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    linkTo: {
      type: String,
      required: true,
    },
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

  .title {
    margin-left: 0.25rem;
  }
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