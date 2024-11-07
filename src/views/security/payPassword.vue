<template>
  <Layout>
    <NavBar slot="header" back></NavBar>
    <div class="section py-0">
      <div class="big-title mb-3">{{ $t('login.restPayPassword') }}</div>
      <van-password-input :value="form.payPassword" :focused="showKeyboard" @focus="showKeyboard=true" />
    <div class="card-bg px-1 py-0 mt-5">
      <van-field
          v-model="form.captcha"
          center
          class="cell2"
          clearable
          :placeholder="$t('login.enterCaptcha')"
          :rules="[{ required: true, message: $t('login.enterCaptcha') }]"
      >

        <template #button>
          <SendCaptcha :required="false" @send="show"/>
        </template>
      </van-field>
    </div>

      <div class="big-btn radius mt-5" @click="$refs.form.submit()">{{ $t('login.sub') }}</div>
    </div>
    <van-form ref="form" :show-error="false" @submit="onSubmit">
      <van-number-keyboard :show="showKeyboard" @input="onInput" @delete="onDelete" @blur="showKeyboard=false" />
    </van-form>
  </Layout>
</template>

<script>
import { Toast } from 'vant'
import { get, call } from 'vuex-pathify'
import SendCaptcha from '@/components/SendCaptcha.vue'
export default {
  components: { SendCaptcha },
  data() {
    return {
      showPwd: false,
      sendTo: null,
      showKeyboard: true,
      form: {
        payPassword: '',
        captcha: '',
      },
    }
  },
  computed: {
    user: get('user/info'),
  },
  methods: {
    ...call({
      updateInfo: 'user/info',
    }),
    onSubmit() {
      this.$http.post('user/modifyPwd', this.form).then(() => {
        Toast.success(this.$t('login.forgetSuccess'))
        this.updateInfo()
        this.$router.back()
      })
    },
    show(data) {
      this.sendTo = data
    },
    onInput(key) {
      this.form.payPassword = (this.form.payPassword + key).slice(0, 6)
    },
    onDelete() {
      this.form.payPassword = this.form.payPassword.slice(
          0,
          this.form.payPassword.length - 1
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.form {
  margin-top: 60px;
}
.title {
  font-size: 25px;
  font-weight: 500;
  margin-top: 0;
}
.small {
  color: #999999;
  font-size: 75%;
}
.cell2 {
  padding: 12px 10px;
  font-size: 16px;
}
</style>
