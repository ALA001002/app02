<template>
  <layout>
    <NavBar back>
      <template #right>
<!--        <div @click="showI18n=true" style="width: 100px;text-align: left;}">{{langName}}</div>-->

        <div class="text-15px" @click="$router.push('login')">{{$t('login.login')}}</div>
      </template>
    </NavBar>
    <div class="section">
      <div class="text-24px">{{$t('extra.registerTitle')}}</div>
      <div class="tabs flex mt-2 mb-5">
        <div class="tab " :class="{active:!isPhone }" @click="isPhone=false">{{$t('login.mailRegister')}}</div>
<!--        <div class="tab" :class="{active:isPhone }" @click="isPhone=true">{{$t('login.phoneRegister')}}</div>-->
      </div>
      <van-form :show-error="false" ref="form" @submit="onSubmit">
        <div class="input flex mt-4 mb-0" v-if="isPhone">
          <van-field v-model="form.phone" type="tel" :placeholder="$t('login.enterPhone')" :rules="[{ required: true, message: $t('login.enterPhone') }]" clearable>
            <template #label>
              <div class="flex mr-1">
                <PhoneArea class="p-0 mr-4" @select="areaSelect" />
                <div class="split"></div>
              </div>
            </template>
          </van-field>
        </div>
        <div class="input" v-else>
          <van-field v-model.trim="form.email" type="text" :placeholder="$t('login.enterMail')" :rules="[{ required: true, message: $t('login.enterMail') }]" clearable />
        </div>
        <div class="input mt-4">
          <van-field v-model="form.password" autocomplete="new-password" :placeholder="$t('login.enterPWD2')" :type="!showPwd?'password':'text'" :right-icon="!showPwd?'eye-o':'closed-eye'" :rules="[{ required: true, message: $t('login.enterPWD2'), pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/ }]" clearable @click-right-icon="showPwd = !showPwd" />
        </div>
        <div class="input mt-4">
          <van-field v-model="form.captcha" class="mt-0" center clearable :placeholder="$t('login.enterCaptcha')" :rules="[{ required: true, message: $t('login.enterCaptcha') }]">
            <template #button>
              <div class="flex">
                <div class="split"></div>
                <SendCaptcha :areaCode="area.areaCode" :phone="form.phone" :mail="form.email" />
              </div>
            </template>
          </van-field>
        </div>
<!--        <van-field v-model.trim="form.whatapp" type="text" :placeholder="$t('login.enterWhatApp')" :rules="[{ required: true, message: $t('login.enterWhatApp') }]" clearable />-->
        <van-field v-model="form.invitationCode" :placeholder="$t('login.enterCode')" clearable />
      </van-form>
      <div class="flex text-12px mt-3">
        <van-checkbox v-model="read" class=" mr-1" checked-color="#F5A600" icon-size="16px"> <span class="text-shallow">{{ $t('login.read') }}</span></van-checkbox>
        <router-link tag="span" class="text-primary" to="/view?type=key&id=fwxy">《{{ $t('login.protocol') }}》</router-link>
      </div>
      <div class="big-btn mt-5 radius" @click="$refs.form.submit()"> {{ $t('login.register') }}</div>
      <div class="text-shallow mt-4 text-12px mb-6" style="line-height:20px">{{$t('login.registerHint')}}</div>
    </div>
    <van-popup v-model="showI18n" safe-area-inset-bottom position="bottom">
      <I18n @select="showI18n=false"/>
    </van-popup>
  </layout>
</template>

<script>
// import Register from '@/components/login/Register'
// import Forget from '@/components/login/Forget'
import SendCaptcha from '@/components/SendCaptcha.vue'
import PhoneArea from '@/components/PhoneArea.vue'
import { Toast } from 'vant'
import { call,get } from 'vuex-pathify'
import {langs} from '@/i18n'
import I18n from '@/components/I18n.vue'
export default {
  components: { SendCaptcha, PhoneArea,I18n },
  data() {
    return {
      showPwd: false,
      showI18n: false,
      area: {},
      type: 'phone',
      isPhone: false,
      read: false,
      form: {
        areaId: null,
        phone: null,
        email: null,
        whatapp: null,
        password: null,
        captcha: null,
        invitationCode: this.$route.query.code,
      },
    }
  },
  watch: {
    area(val) {
      this.form.areaId = val.areaId
    },
    isPhone(val) {
      if (val) {
        this.form.email = null
      } else {
        this.form.phone = null
      }
    },
  },
  computed: {
    isEmailLogin() {
      return this.type === 'email'
    },
    lang: get('lang'),
    langName() {
      return (langs.find(p => p.id == this.lang) || {}).name
    }
  },
  mounted() {
    if (this.$route.query.code) {
      this.component = 'Register'
    }
  },
  methods: {
    ...call({
      setToken: 'user/token',
      updateInfo: 'user/info',
    }),
    onSubmit() {
      this.$http.post('user/register', this.form).then(() => {
        Toast.success(this.$t('login.registerSuccess'))
        // this.change()
        this.$router.replace('/')
      })
    },
    areaSelect(val) {
      this.area = val
    },
  },
}
</script>

<style scoped lang="scss">
.tabs {
  .tab {
    margin-right: 30px;
    font-size: 15px;
    line-height: 30px;
    border-bottom: 1px solid transparent;
  }
  .active {
    color: var(--primary);
    border-bottom: 1px solid var(--primary);
  }
}
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
    margin-top: 0;
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
