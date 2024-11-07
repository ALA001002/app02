<template>
  <van-uploader :after-read="afterRead" :before-read="beforeRead">
    <van-icon name="photo" />
  </van-uploader>
</template>

<script>
import { Toast } from 'vant'
import lrz from 'lrz'
export default {
  data() {
    return {
    }
  },
  methods: {
    async afterRead (file) {
      try {
        let rst = await lrz( file.file, { width: 1080, height: 1080, quality: 0.7 })
        // 转base64
        let reader = new FileReader()
        reader.readAsDataURL(rst.file)
        reader.onload = () => {
          this.$emit('select', reader.result)
        }
      } catch(err) {
        Toast(this.$t('app.idCardImgTip'))
        // console.log(err)
        return
      }
    },
    beforeRead (file) {
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        Toast(this.$t('app.idCardImgTip'))
        return false
      }
      return true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
