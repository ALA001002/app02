<template>
  <BackPanel>
    <div class="py-4 has-background-white">
      <van-form :show-error="false" @submit="onSubmit">
        <van-field
            v-model="lotteryCode"
            center
            clearable
        >
        </van-field>
        <van-field
            v-model="form.receiver"
            :placeholder="$t('activity.receiver')"
            clearable
        />
        <div style="margin: 16px;">
          <van-button block type="info" native-type="submit">
            {{ $t('activity.give') }}
          </van-button>
        </div>
      </van-form>
    </div>
  </BackPanel>
</template>

<script>
import BackPanel from '@/components/layout/BackPanel.vue'
import { get } from 'vuex-pathify'
import { Toast, Dialog } from 'vant'
export default {
  components: { BackPanel },
  data() {
    return {
      form: {
        lotteryCode: null,
        receiver: null
      }
    }
  },
  computed: {
    userWallet: get('user/wallet'),
    lotteryCode: function() {
      return this.$route.params.lotteryCode
    }
  },
  methods: {
    onSubmit() {
      Dialog.confirm({ title: this.$t('activity.confirmGive') }).then(() => {
        this.form.lotteryCode = this.lotteryCode
        var url = 'luck/giveLotteryCode'
        this.$http.post(url, this.form).then(() => {
          Toast.success()
          this.$router.back()
        })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
