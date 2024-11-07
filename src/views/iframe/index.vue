<template>
  <layout full>
    <NavBar back>{{$t('app.contactService')}}</NavBar>
    <iframe class="flex1" :src="address" frameborder="0"></iframe>
  </layout>
</template>

<script>
export default {
  name: 'iframe',
  data() {
    return {
      address: '',
    }
  },
  mounted() {
    this.loadKefu(this.$route.params.type)
  },
  methods: {
    loadKefu(type) {
      let self = this
      // this.address = `https://chatlink.meiqia.cn/widget/standalone.html?eid=6656e2d7bc88534ad3ab8ef448515ccd&language=en&type=${type}`
      this.$http.get(`/common/kefuAddress?type=${type}`).then(data => {
        console.log(data)
        self.address = data
      })
    },
  },
}
</script>

<style scoped>
/* iframe {
  height: 100%;
  width: 100%;
} */
</style>
