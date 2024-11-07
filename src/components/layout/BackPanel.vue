<template>
  <div class="hero is-full">
    <!-- <HeadSafeArea /> -->
    <slot name="header">
      <van-nav-bar :title="title" left-arrow @click-left="$router.back()">
        <template #right>
          <slot name="right" />
        </template>
      </van-nav-bar>
    </slot>
    <div class="container has-background-light">
      <slot />
    </div>
  </div>
</template>

<script>
// import HeadSafeArea from '../HeadSafeArea'
export default {
  props: {
    title: {
      type: String,
      default: null,
    },
  },
  // components: { HeadSafeArea },
  data() {
    return {}
  },
}
</script>

<style scoped lang="scss">
.container {
  overflow: auto;
  flex-basis: 0%;
  width: 100%;
}
</style>
<style>
.van-nav-bar{
  background: var(--bg-color);
}
</style>
