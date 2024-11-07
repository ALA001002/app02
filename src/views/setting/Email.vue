<template>
  <Layout>
    <NavBar back></NavBar>
    <div class="section ">
      <div class="page-title">{{ $t('app.bindMail') }}</div>
      <van-form :show-error="false" @submit="onSubmit" ref="form">
        <div class="card-bg flex mt-2 p-1">
          <van-field v-model="form.email" :placeholder="$t('login.enterMail')" clearable :rules="[{ required: true, message: $t('login.enterMail') }]" />
        </div>
        <div class="card-bg mt-4 p-0">
          <van-field v-model="form.captcha" center clearable :placeholder="$t('login.enterCaptcha')" :rules="[{ required: true, message: $t('login.enterCaptcha') }]">
            <template #button>
              <div class="flex">
                <div class="split"></div>
                <SendCaptcha :mail="form.email" />
              </div>
            </template>
          </van-field>
        </div>
        <div class="big-btn mt-5" @click="$refs.form.submit()">
          {{ $t('login.sub') }}
        </div>
      </van-form>
    </div>
  </Layout>
</template>

<script>
import SendCaptcha from '@/components/SendCaptcha.vue'
import { Toast } from 'vant'
import { get } from 'vuex-pathify'
export default {
  components: { SendCaptcha },
  data() {
    return {
      form: {
        email: null,
        captcha: null,
      },
    }
  },
  computed: {
    user: get('user/info'),
  },
  methods: {
    onSubmit() {
      this.$http.post('user/bindEmail', this.form).then(() => {
        Toast.success(this.$t('login.forgetSuccess'))
        this.$router.back()
      })
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
</style>
