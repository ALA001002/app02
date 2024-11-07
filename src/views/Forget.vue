<template>
  <layout>
    <NavBar back>
      <template #right>
        <div class="text-15px" @click="$router.go(-1)">{{$t('login.login')}}</div>
      </template>
    </NavBar>
    <div class="section">
      <div class="text-24px" v-if="isEmailLogin">{{$t('login.forgetByMail')}}</div>
      <div class="text-24px" v-else>{{$t('login.forgetByPhone')}}</div>
      <van-form :show-error="false" ref="form" @submit="onSubmit">
        <template v-if="isEmailLogin">
          <van-field autocomplete="new-password" v-model.trim="form.email" type="text" class="input  mt-4" :placeholder="$t('login.enterMail')" :rules="[{ required: true, message: $t('login.enterMail') }]" clearable />
        </template>
        <template v-else>
          <div class="input flex-between mt-4 mb-0">
            <van-field autocomplete="new-password" class="flex1 mt-0" v-model="form.phone" clearable :placeholder="$t('login.enterPhone')" :rules="[{ required: true, message: $t('login.enterPhone') }]" type="number">
              <template #label>
                <div class="flex mr-1">
                  <PhoneArea class="p-0 mr-4" @select="areaSelect" />
                  <div class="split"></div>
                </div>
              </template>
            </van-field>
          </div>
        </template>
        <div class="input mt-5 p-0">
          <van-field class="p-2 pl-3 mt-0" v-model="form.captcha" center clearable :placeholder="$t('login.enterCaptcha')" :rules="[{ required: true, message: $t('login.enterCaptcha') }]">
            <template #button>
              <div class="flex">
                <div class="split"></div>
                <SendCaptcha :areaCode="area.areaCode" :phone="form.phone" :mail="form.email" />
              </div>
            </template>
          </van-field>
        </div>
        <div class="input  mt-5">
          <van-field autocomplete="new-password" v-model.trim="form.password" class=" mt-0" :placeholder="$t('login.enterPWD')" :type="!showPwd?'password':'text'" :right-icon="!showPwd?'eye-o':'closed-eye'" :rules="[{ required: true, message: $t('login.enterPWD') }]" clearable @click-right-icon="showPwd = !showPwd" />
        </div>
      </van-form>
      <div class="big-btn mt-5 radius" @click="$refs.form.submit()"> {{ $t('login.sub') }}</div>
    </div>
  </layout>
</template>

<script>
import SendCaptcha from '@/components/SendCaptcha.vue'
import PhoneArea from '@/components/PhoneArea.vue'
import { Toast } from 'vant'
import { call } from 'vuex-pathify'
export default {
  components: { SendCaptcha, PhoneArea },
  data() {
    return {
      showPwd: false,
      area: {},
      type: this.$route.params.type,
      isPhone: false,
      form: {
        areaId: null,
        phone: null,
        email: null,
        password: null,
        captcha: null,
      },
    }
  },
  computed: {
    isEmailLogin() {
      return this.type === 'email'
    },
  },
  mounted() {},
  methods: {
    ...call({
      setToken: 'user/token',
      updateInfo: 'user/info',
    }),
    onSubmit() {
      this.$http.post('common/resetPwd', this.form).then(() => {
        Toast.success(this.$t('login.forgetSuccess'))
        this.$roouter.go(-1)
      })
    },
    areaSelect(val) {
      this.area = val
      this.form.areaId = val.areaId
    },
  },
}
</script>

<style scoped lang="scss">
.van-form {
  .van-field {
    background: #1d1c21;
    margin-top: 24px;
    border-radius: 4px;
    font-size: 16px;
    height: 60px;
    line-height: 40px;
  }
}
.split {
  width: 1px;
  height: 25px;
  background: #424142;
}
.input {
  background: #1d1c21;
  overflow: hidden;
  .van-field {
    height: auto;
  }
  ::v-deep {
    .van-field__label {
      width: auto;
    }
  }
}
.input:-internal-autofill-selected {
  background: #1d1c21 !important;
}
.input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px white inset !important;
}
.input:-webkit-autofill,
.input:-webkit-autofill:hover,
.input:-webkit-autofill:focus,
.input:-webkit-autofill:active {
  -webkit-transition-delay: 111111s;
  -webkit-transition: color 11111s ease-out, background-color 111111s ease-out;
}
</style>
