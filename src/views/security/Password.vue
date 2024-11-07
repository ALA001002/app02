<template>
  <Layout>
    <NavBar slot="header" back></NavBar>
    <div class="section py-0">
      <div class="big-title">{{ $t('login.restPassword') }}</div>
      <van-form ref="form" :show-error="false" @submit="onSubmit">
<!--        <div class="card-bg px-1 py-0">
          <van-field class="cell" autocomplete="new-password" v-model="form.captcha" center clearable :placeholder="$t('login.enterCaptcha')" :rules="[{ required: true, message: $t('login.enterCaptcha') }]">
            <template #button>
              <SendCaptcha class="send" :required="false" @send="show" />
            </template>
          </van-field>
        </div>-->
        <div class="card-bg px-1 py-0 mt-5">
          <van-field autocomplete="new-password" class="cell2" v-model="form.password" :placeholder="$t('login.enterPWD2')" :type="!showPwd?'password':'text'" :right-icon="!showPwd?'eye-o':'closed-eye'" :rules="[{ required: true, message: $t('login.enterPWD2'), pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/ }]" clearable @click-right-icon="showPwd = !showPwd" />
        </div>
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
      </van-form>
      <div class="big-btn radius mt-5" @click="$refs.form.submit()">{{ $t('login.sub') }}</div>
    </div>
    <!-- <p :style="sendTo?'':'visibility:hidden'" class="my-0 mx-3 has-text-grey-light">
      {{$t('app.sendTo')}} {{sendTo}}
    </p> -->
  </Layout>
</template>

<script>

import BackPanel from '@/components/layout/BackPanel.vue'
import SendCaptcha from '@/components/SendCaptcha.vue'
import { Toast } from 'vant'
import { get } from 'vuex-pathify'
export default {
  components: { BackPanel, SendCaptcha },
  data() {
    return {
      showPwd: false,
      sendTo: null,
      form: {
        password: null,
        captcha: '',
      },
    }
  },
  computed: {
    user: get('user/info'),
  },
  methods: {
    onSubmit() {
      this.$http.post('user/modifyPwd', this.form).then(() => {
        Toast.success(this.$t('login.forgetSuccess'))
        this.$router.back()
      })
    },
    show(data) {
      this.sendTo = data
    },
  },
}
</script>

<style lang="scss" scoped>
.cell {
  padding: 7px 0px 7px 10px !important;
  font-size: 16px;
}
.cell2 {
  padding: 12px 10px;
  font-size: 16px;
}
</style>
