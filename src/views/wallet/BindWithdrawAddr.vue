<template>
  <BackPanel>
    <div class="py-4 has-background-white">
      <h5 class="section title mb-1">
        <span>{{ $t('app.bindWithdrawAddr') }} {{coin}}</span>
      </h5>
      <van-form :show-error="false" @submit="onSubmit">
        <van-field
            v-model="form.withdrawAddr"
            clearable
            :placeholder="$t('app.bindWithdrawAddr')"
            :rules="[{ required: true, message: $t('wallet.setBindWithdrawAddr') }]"
            type="text"
        />
        <div style="margin: 16px;">
          <van-button block type="info" native-type="submit">
            {{ $t('login.sub') }}
          </van-button>
        </div>
      </van-form>
    </div>
  </BackPanel>
</template>

<script>
import BackPanel from '@/components/layout/BackPanel.vue'
import { Toast } from 'vant'
import {call, get} from 'vuex-pathify'
export default {
  components: { BackPanel },
  data() {
    return {
      form: {
        withdrawAddr: null,
        coin: null,
      }
    }
  },
  computed: {
    user: get('user/info'),
    coin: function() {
      return this.$route.params.coin
    },
  },
  methods: {
    ...call({
      updateInfo: 'user/info',
    }),
    onSubmit() {
      this.form.coin = this.coin
      this.$http.post('user/bindWithdrawAddr', this.form).then(async () => {
        Toast.success(this.$t('login.forgetSuccess'))
        await this.updateInfo()
        this.$router.back()
      })
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
  margin-top: 0;
}
.small {
  color: #999999;
  font-size: 75%;
}
</style>
