<template>
  <layout full>
    <iframe class="iframe" v-if="src" :src="src" frameborder="0"></iframe>
  </layout>
</template>

<script>
export default {
  data() {
    return {
      src: '',
    }
  },
  created(){
    this.src = localStorage.payUrl
  },
  methods: {
  },
}
</script>

<style scoped>
.iframe {
  height: 100%;
  width: 100%;
}
</style>
