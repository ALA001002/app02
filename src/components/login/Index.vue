<template>
  <div>
    <p class="px-3 has-text-right">
      <span @click="showI18n=true">{{langName}}<i class="icon icon-gengduo is-size-7"/></span>
    </p>
    <h4 class="section title">
       <span :class="{small: !isPhone}" @click="isPhone=true">{{ $t('login.phoneLogin') }}</span>
      <span :class="{small: isPhone}" class="ml-4" @click="isPhone=false">{{ $t('login.mailLogin') }}</span>
    </h4>
    <PhoneArea :style="isPhone?'':'visibility:hidden'" @select="areaSelect"/>
    <van-form :show-error="false" @submit="onSubmit">
      <van-field
        v-if="isPhone"
        v-model.trim="form.phone"
        :placeholder="$t('login.enterPhone')"
        :rules="[{ required: true, message: $t('login.enterPhone') }]"
        clearable
      />
      <van-field
        v-else
        v-model.trim="form.email"
        type="text"
        :placeholder="$t('login.enterMail')"
        :rules="[{ required: true, message: $t('login.enterMail') }]"
        clearable
      />
      <van-field
        v-model.trim="form.password"
        :placeholder="$t('login.enterPWD')"
        :type="!showPwd?'password':'text'"
        :right-icon="!showPwd?'eye-o':'closed-eye'"
        :rules="[{ required: true, message: $t('login.enterPWD') }]"
        clearable
        @click-right-icon="showPwd = !showPwd"
      />
      <div class="section has-text-right pb-0">
        <span class="has-text-link" @click="toKefu()" style="float:left;">{{ $t('app.contactService') }}</span>
        <small class="has-text-link" @click="change('Forget')">{{ $t('login.forget') }}</small>
      </div>
      <div style="margin: 16px;">
        <van-button block type="info" native-type="submit">
          {{ $t('login.login') }}
        </van-button>
      </div>
    </van-form>
    <p class="has-text-grey-light" style="text-align: center; position: absolute; left: 0; bottom: 25px; width: 100%;">
      {{ $t('login.noAccount') }}
      <span class="has-text-link" @click="change('Register')">{{ $t('login.register') }}</span>
    </p>
    <van-popup v-model="showI18n" safe-area-inset-bottom position="bottom">
      <I18n @select="showI18n=false"/>
    </van-popup>
  </div>
</template>

<script>
import I18n from '@/components/I18n.vue'
import { get, call } from 'vuex-pathify'
import PhoneArea from '../PhoneArea.vue'
import { langs } from '@/i18n'
export default {
  components: { I18n, PhoneArea },
  data() {
    return {
      showPwd: false,
      showI18n: false,
      area: {},
      isPhone: false,
      form: {
        phone: null,
        email: null,
        password: null
      }
    }
  },
  computed: {
    lang: get('lang'),
    langName() {
      return (langs.find(p => p.id == this.lang) || {}).name
    }
  },
  watch: {
    isPhone(val) {
      if (val) { this.form.email = null }
      else { this.form.phone = null }
    }
  },
  methods: {
    ...call({
      setToken: 'user/token',
      updateInfo: 'user/info'
    }),
    toKefu(){
      this.$router.push('/iframe/0')
    },
    onSubmit() {
     /* if(this.isPhone){
        this.form.phone = `${this.area.areaCode}${this.form.phone}`
      }*/
      this.$http.post('user/login', this.form).then((data) => {
        this.form = {
          phone: null,
          password: null
        }
        this.setToken(data)
        this.updateInfo()
        this.$ws.load()
        this.$router.replace('/')
      })
    },
    change(name) {
      this.$emit('change', name)
    },
    areaSelect(val) {
      this.area = val
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  margin-top: 60px;
}
.title {
  font-size: 25px;
  font-weight: 500;
  margin-top: 15px;
}
.small {
  color: #999999;
  font-size: 75%;
}
</style>
