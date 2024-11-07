<template>
  <div>
    <h4 class="section title">
      <!--<span :class="{small: !isPhone}" @click="isPhone=true">{{ $t('login.forgetByPhone') }}</span>-->
      <span :class="{small: isPhone}" class="ml-4" @click="isPhone=false">{{ $t('login.forgetByMail') }}</span>
    </h4>
    <!--<PhoneArea :style="isPhone?'':'visibility:hidden'" @select="areaSelect"/>-->
    <van-form :show-error="false" @submit="onSubmit">
      <van-field
        v-if="isPhone"
        v-model="form.phone"
        type="tel"
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
        v-model="form.captcha"
        center
        clearable
        :placeholder="$t('login.enterCaptcha')"
        :rules="[{ required: true, message: $t('login.enterCaptcha') }]"
      >
        <template #button>
          <SendCaptcha :areaCode="area.areaCode" :phone="form.phone" :mail="form.email" />
        </template>
      </van-field>
      <van-field
        v-model="form.password"
        :placeholder="$t('login.enterPWD2')"
        :type="!showPwd?'password':'text'"
        :right-icon="!showPwd?'eye-o':'closed-eye'"
        :rules="[{ required: true, message: $t('login.enterPWD2'), pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/ }]"
        clearable
        @click-right-icon="showPwd = !showPwd"
      />
      <div style="margin: 16px;">
        <van-button block type="info" native-type="submit">
          {{ $t('login.sub') }}
        </van-button>
      </div>
    </van-form>
    <p class="has-text-grey-light" style="text-align: center; position: absolute; left: 0; bottom: 25px; width: 100%;">
      {{ $t('login.hasAccount') }}
      <span class="has-text-link" @click="change()">{{ $t('login.login') }}</span>
    </p>
  </div>
</template>

<script>
import SendCaptcha from '../SendCaptcha.vue'
import { Toast } from 'vant'
import PhoneArea from '../PhoneArea.vue'
export default {
  components: { SendCaptcha, PhoneArea },
  data() {
    return {
      showPwd: false,
      isPhone: false,
      area: {},
      form: {
        areaId: null,
        phone: null,
        email: null,
        password: null,
        captcha: null
      }
    }
  },
  watch: {
    area(val) {
      this.form.areaId = val.areaId
    },
    isPhone(val) {
      if (val) { this.form.email = null }
      else { this.form.phone = null }
    }
  },
  methods: {
    onSubmit() {
      this.$http.post('common/resetPwd', this.form).then(() => {
        Toast.success(this.$t('login.forgetSuccess'))
        this.change()
      })
    },
    change(name='Login') {
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
