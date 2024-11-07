<template>
  <van-button class="is-none text-primary text-16px" native-type="button" :disabled="s>0" @click="sendCode">{{ sendText }}</van-button>
</template>

<script>
export default {
  props: {
    areaCode: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    mail: {
      type: String,
      default: null,
    },
    required: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      timer: null,
      s: 0,
    }
  },
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  computed: {
    sendText() {
      return this.s > 0 ? this.s + 's' : this.$t('login.sendCaptcha')
    },
  },
  methods: {
    sendCode() {
      let form = this.getForm()
      if (this.required && !form) return
      if (this.s > 0) return
      let url = this.required ? 'common/sendCaptcha' : 'user/sendCaptcha'
      this.$http.post(url, form).then(data => {
        this.s = 60
        if (this.timer) {
          clearInterval(this.timer)
        }
        this.timer = setInterval(() => {
          this.s--
          if (!this.s) {
            clearInterval(this.timer)
          }
        }, 1000)
        this.$emit('send', data)
      })
    },
    getForm() {
      if (this.phone) {
        return {
          areaCode: this.areaCode,
          phone: this.phone,
        }
      } else if (this.mail) {
        return {
          email: this.mail,
        }
      }
      return null
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
