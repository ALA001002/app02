<template>
  <div :style="{ height: height,minHeight: height, backgroundColor: color }"></div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: '#100F15',
    },
  },
  data() {
    return {
      height: '20px',
    }
  },
  mounted() {
    if (window.plus) {
      this.height = plus.navigator.getStatusbarHeight() + 'px'
    }
  },
  watch: {},
}
</script>
