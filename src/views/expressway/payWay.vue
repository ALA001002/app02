<template>
  <div id="iframe-view">
    <BackPanel :title="$t('app.payment')">
      <vue-iframe
          :src="address"
          allow="camera *; geolocation *; microphone *; autoplay *"
          frame-id="my-ifram"
          name="my-frame"
          width="150px"
          height="200px"
          frameborder="0"
      />
    </BackPanel>
  </div>
</template>

<script>
import BackPanel from '@/components/layout/BackPanel.vue'
export default {
  name: 'iframe-data',
  data(){
    return {
      address:''
    }
  },
  components:{
    BackPanel
  },
  mounted() {
    let {payUrl} = this.$route.params
    window.location.href=payUrl
  },
  methods:{
  }
}
</script>

<style scoped>
#iframe-view,iframe{
  height: 100%;
  width: 100%;
}
</style>
