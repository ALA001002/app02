<template>
  <BackPanel :title="$t('app.avatar')">
    <van-uploader v-model="avatars" preview-size="100vw" :after-read="afterRead" :before-read="beforeRead" />
  </BackPanel>
</template>

<script>
import BackPanel from '@/components/layout/BackPanel.vue'
import { get, call } from 'vuex-pathify'
import { Toast } from 'vant'
import lrz from 'lrz'
export default {
  components: { BackPanel },
  data() {
    return {
      avatars: []
    }
  },
  computed: {
    user: get('user/info')
  },
  watch: {
    'user.avatar': {
      handler() {
        if (this.user.avatar) {
          this.avatars = [this.user.avatar].map(p=>({ url: p }))
        }
      },
      immediate: true
    }
  },
  methods: {
    ...call({
      updateInfo: 'user/info'
    }),
    afterRead (file) {
      this.uploadImg(file.file)
    },
    beforeRead (file) {
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        Toast(this.$t('app.idCardImgTip'))
        return false
      }
      return true
    },
    async uploadImg (file) {
      // 创建form对象
      let formdata = new FormData()
      // 尝试压缩
      try {
        let rst = await lrz( file, { width: 1080, height: 1080, quality: 0.7 })
        formdata.append('file', rst.file, file.name)
      } catch(err) {
        Toast(this.$t('app.idCardImgTip'))
        // console.log(err)
        return
      }
      Toast.loading()
      this.$http.api({
        method: 'post',
        url: 'user/uploadAvatar',
        headers:{ 'Content-type': 'multipart/form-data'},
        data: formdata
      }).then(() => {
        Toast.success()
        this.updateInfo()
        this.$router.back()
      }).catch((err) => {
        Toast.fail(err.msg)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
