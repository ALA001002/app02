<template>
  <layout>
    <NavBar back>
      <template #right>
        <div class="text-15px" @click="showLangSelectModal=true">{{$t('app.lang')}}</div>
      </template>
    </NavBar>
    <div class="section">
      <div class="text-24px">{{$t('extra.loginTitle')}}</div>
      <div class="text-13px mt-1 text-mid">{{$t('extra.loginTitleInfo')}}</div>
<!--      <div class="tr text-primary text-15px" v-if="isEmailLogin" @click="type='phone'">{{$t('extra.loginWithPhone')}}</div>-->
<!--      <div class="tr text-primary text-15px" v-else @click="type='email'">{{$t('extra.loginWithEmail')}}</div>-->
      <van-form :show-error="false" ref="form" @submit="onSubmit">

        <div v-if="isEmailLogin" class="input mt-4">
          <van-field autocomplete="new-password" v-model.trim="form.email" type="text" class="mt-0" :placeholder="$t('login.enterMail')" :rules="[{ required: true, message: $t('login.enterMail') }]" clearable />
        </div>
        <div v-else class="input mt-4 mb-0">
          <van-field autocomplete="new-password" class="mt-0" v-model="form.phone" clearable :placeholder="$t('login.enterPhone')" :rules="[{ required: true, message: $t('login.enterPhone') }]" type="number">
            <template slot="label">
              <div class="flex mr-1" v-if="!isEmailLogin">
                <PhoneArea class="p-0 mr-4" @select="areaSelect" />
                <div class="split"></div>
              </div>
            </template>
          </van-field>
        </div>
        <div class="input  mt-4">
          <van-field autocomplete="new-password" v-model.trim="form.password" class=" mt-0" :placeholder="$t('login.enterPWD')" :type="!showPwd?'password':'text'" :right-icon="!showPwd?'eye-o':'closed-eye'" :rules="[{ required: true, message: $t('login.enterPWD') }]" clearable @click-right-icon="showPwd = !showPwd" />
        </div>
      </van-form>
      <div class="flex-between mt-3">
        <div class="text-15px text-primary" @click="$router.push('/register')">{{$t('login.register')}}</div>
        <span class="text-primary text-15px" @click="$router.push(isEmailLogin?'/forget/email':'/forget/phone')">{{ $t('login.forget') }}</span>
      </div>
      <div class="big-btn mt-5 radius" @click="$refs.form.submit()"> {{ $t('login.login') }}</div>
    </div>
    <van-action-sheet v-model="showLangSelectModal" close-on-click-action :cancel-text="$t('app.cancel')" :actions="langs" :round="false" @select="changeLang" />
  </layout>
</template>

<script>
import PhoneArea from '@/components/PhoneArea.vue'
import { call } from 'vuex-pathify'
import { langs } from '@/i18n'
export default {
  components: { PhoneArea },
  data() {
    return {
      langs,
      showLangSelectModal: false,
      showPwd: false,
      showI18n: false,
      area: {},
      type: 'email',
      form: {
        phone: null,
        email: null,
        password: null,
      },
    }
  },
  watch: {
    isEmailLogin(val) {
      if (val) {
        this.form.phone = null
        this.form.areaId = null
      } else {
        this.form.email = null
      }
    },
  },
  computed: {
    isEmailLogin() {
      return this.type === 'email'
    },
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
    changeLang(lang) {
      this.$i18n.changeLang(lang.id)
    },
    onSubmit() {
      console.log(this.area)
      this.$http.post('user/login', this.form).then(data => {
        this.form = {
          phone: null,
          email: null,
          password: null,
        }
        this.setToken(data)
        this.updateInfo()
        this.$router.replace('/')
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
