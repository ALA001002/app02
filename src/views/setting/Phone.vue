<template>
  <layout>
    <NavBar slot="header" back></NavBar>
    <div class="section ">
      <div class="big-title">{{ $t('app.bindPhone') }}</div>
      <van-form :show-error="false" @submit="onSubmit" ref="form">
        <div class="card-bg flex mt-2 p-1">
          <PhoneArea @select="areaSelect" />
          <div class="split"></div>
          <van-field class="flex1" v-model="form.phone" clearable :placeholder="$t('login.enterPhone')" :rules="[{ required: true, message: $t('login.enterPhone') }]" type="number" />
        </div>
        <div class="card-bg mt-4 p-0">
          <van-field class="p-2 pl-3" v-model="form.captcha" center clearable :placeholder="$t('login.enterCaptcha')" :rules="[{ required: true, message: $t('login.enterCaptcha') }]">
            <template #button>
              <div class="flex">
                <div class="split"></div>
                <SendCaptcha :areaCode="area.areaCode" :phone="form.phone" />
              </div>
            </template>
          </van-field>
        </div>
        <div class="big-btn mt-5" native-type="submit" @click="$refs.form.submit()">
          {{ $t('login.sub') }}
        </div>
      </van-form>
    </div>
  </layout>
</template>

<script>
import SendCaptcha from '@/components/SendCaptcha.vue'
import PhoneArea from '@/components/PhoneArea.vue'
import { Toast } from 'vant'
import { get } from 'vuex-pathify'
export default {
  components: { SendCaptcha, PhoneArea },
  data() {
    return {
      showPwd: false,
      sendTo: null,
      area: {},
      form: {
        areaId: null,
        phone: null,
        captcha: null,
      },
    }
  },
  computed: {
    user: get('user/info'),
  },
  watch: {
    area(val) {
      this.form.areaId = val.areaId
    },
  },
  methods: {
    onSubmit() {
      this.$http.post('user/bindPhone', this.form).then(() => {
        Toast.success(this.$t('login.forgetSuccess'))
        this.$router.back()
      })
    },
    areaSelect(val) {
      this.area = val
    },
  },
}
</script>

<style lang="scss" scoped>
.split {
  height: 24px;
  width: 1px;
  background: #424142;
}
</style>
