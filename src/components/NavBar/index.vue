<template>
  <div class="nav-bar">
    <div class="left">
      <slot name="left">
        <span v-if="back" class="okcoin okcoin-back" @click="$router.go(-1)"></span>
      </slot>
    </div>
    <div class="nav-title">
      <slot></slot>
    </div>
    <div class="right">
      <slot name="right">
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'nav-bar',
  props: {
    back: Boolean,
  },
}
</script>

<style scoped lang="scss">
.nav-bar {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  .okcoin {
    color: #fff;
    font-size: 24px;
  }
  .nav-title {
    font-size: 17px;
    font-weight: 500;
    color: #fff;
  }
  .left,
  .right {
    width: 25%;
  }
  .right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    // gap: 15px;
  }
}
</style>