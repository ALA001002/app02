<template>
  <div class="hero is-full">
    <HeadSafeArea />
    <slot name="header" />
    <div class="container" v-if="!full">
      <slot />
    </div>
    <slot v-else />
  </div>
</template>

<script>
import HeadSafeArea from '../HeadSafeArea'
export default {
  components: { HeadSafeArea },
  props: {
    full: Boolean,
  },
  data() {
    return {}
  },
}
</script>

<style scoped lang="scss">
.hero {
  justify-content: flex-start;
}
.container {
  overflow: auto;
  flex-basis: 0%;
  width: 100vw;
  overflow-x: hidden;
}
.is-full {
  height: 100vh;
  width: 100%;
  background: var(--bg-color);
}
</style>
