<template>
  <Layout>
    <NavBar slot="header" back></NavBar>
    <div class="big-title px-4">{{$t('wallet.withdraw')}}</div>
    <div class="section">
      <div class="card-bg  flex-between  px-3 py-3" @click="$refs.selectCoin.popup()">
        <div class="flex1">
          <div class="flex">
            <CoinImg class="box20 mr-2" :coin="coin"></CoinImg>
            <span>{{coin}}</span><span class="text-12px text-mid"></span>
          </div>
          <div class="text-12px text-shallow mt-2"> {{$t('extra.minimumWithdrawalAmount')}}: {{data.min}}{{coin}}</div>
        </div>
        <van-icon name="arrow" color="#ADACB0" size="16px"></van-icon>
      </div>
      <div class="flex-between px-3 my-3 mt-4">
        <span class="text-15px text-mid">{{$t('extra.chainName')}}</span>
        <div class="text-primary text-14px">{{coin}}</div>
      </div>
      <div class="card-bg py-2">
        <div class="flex-between mt-3">
          <div class="text-shallow text-15px">
            {{$t('extra.enterWithdrawalAmount')}}
          </div>
          <div class="text-primary text-15px" @click="setAll">
            {{$t('extra.all')}}
          </div>
        </div>
        <input class="bb text-16px" style="height:40px" v-model="form.money" type="number">
        <div class="text-mid text-12px line2 mt-3">
          <div>{{$t('wallet.fee')}}: {{fee}} {{coin}}</div>
          <!-- <div>{{$t('wallet.toNum')}}: {{num}} {{coin}}</div> -->
          <div class="">{{$t('wallet.balance')}} {{account.balance}} {{coin}}</div>
        </div>
      </div>
      <div class="card-bg  flex-between  px-3 py-4 mt-4" @click="toSelect">
        <div class="text-deep text-16px wb mr-4" v-if="form.toAddress">
          {{form.toAddress}}
        </div>
        <div class="text-shallow text-16px" v-else>
          {{$t('extra.pleaseSelectAddress')}}
        </div>
        <van-icon name="arrow" color="#ADACB0" size="16px"></van-icon>
      </div>
      <div class="big-btn radius mt-5" :disabled="!form.toAddress || !num" @click="onSubmit()">
        {{$t('wallet.withdraw')}}
      </div>
    </div>
    <!--      <QrScan v-model="showQrScan" @scan="scan"/>-->
    <van-overlay :show="showPassword" @click="showPassword=false" get-container="body">
      <div @click.stop>
        <!-- 数字键盘 -->
        <van-number-keyboard :show="true" @input="onInput" @delete="onDelete">
          <template #title-left>
            <!-- 密码输入框 -->
            <p class="mt-0 has-text-centered">{{$t('wallet.enterPayPassword')}}</p>
            <van-password-input :value="form.payPassword" :focused="true" />
          </template>
        </van-number-keyboard>
      </div>
    </van-overlay>
    <SelectCoinVue ref="selectCoin" filter="supWithdraw" @select="coin=$event" :title="$t('extra.withdrawalType')"></SelectCoinVue>
  </Layout>
</template>

<script>
// import QrScan from '@/components/QrScan.vue'
import SelectCoinVue from '@/components/SelectCoin.vue'
import { get } from 'vuex-pathify'
import { Toast, Dialog } from 'vant'
export default {
  components: { SelectCoinVue },
  data() {
    return {
      showPassword: false,
      showQrScan: false,
      remark: null,
      coin: this.$route.params.coin,
      data: {
        percent: 0,
        min: 0,
      },
      form: {
        type: '2',
        money: null,
        toAddress: null,
        payPassword: '',
        withdrawAddressId: '',
      },
    }
  },
  created() {
    const address = sessionStorage.getItem('address')
    if (address) {
      this.form.toAddress = address
      sessionStorage.removeItem('address')
    }
    const addressId = sessionStorage.getItem('addressId')
    if(addressId) {
      this.form.withdrawAddressId = addressId
      sessionStorage.removeItem('addressId')
    }
    const money = sessionStorage.getItem('money')
    if (money) {
      this.form.money = money
      sessionStorage.removeItem('address')
    }
  },
  computed: {
    wallet: get('user/wallet'),
    user: get('user/info'),
    account() {
      return this.wallet.find(p => this.coin == p.currency) || {}
    },
    num() {
      return this.toNumber(
        this.form.money - this.fee > 0 ? this.form.money - this.fee : 0
      )
    },
    fee() {
      if (this.form.type == '1') return 0
      var fee = this.form.money * this.data.percent
      return this.toNumber(fee)
    },
  },
  watch: {
    coin: {
      handler(val) {
        if (!val) return
        this.form.coin = val
        this.$http
          .get('common/getWithdrawInfo', { coin: val, type: this.form.type })
          .then(data => {
            this.data = data
          })
        // this.$http
        //   .get('common/getSysArticle?key=tb' + val.toLowerCase())
        //   .then(data => {
        //     this.remark = data && data.content
        //   })
      },
      immediate: true,
    },
  },
  beforeRouteEnter(_to, from, next) {
    // 如果不是后退过来的页面，就清楚address的缓存
    if (!from.path.includes('/wallet/withdrawAddress/')) {
      sessionStorage.removeItem('address')
      sessionStorage.removeItem('money')
    }
    next()
  },
  methods: {
    setAll() {
      this.form.money = this.account.balance
    },
    toSelect() {
      if (this.form.toAddress) sessionStorage.setItem('address', this.form.toAddress)
      if (this.form.money) sessionStorage.setItem('money', this.form.money)
      if (this.form.withdrawAddressId) sessionStorage.setItem('addressId', this.form.withdrawAddressId)
      this.$router.push('/wallet/withdrawAddress/' + this.coin)
    },
    onSubmit() {
      if (this.form.money > this.account.balance) {
        Toast.fail(this.$t('wallet.notEnough'))
        return
      }
      if (this.form.money < this.data.min) {
        Toast.fail(
          this.$t('wallet.withdrawMin') + ': ' + this.data.min + this.coin
        )
        return
      }
      if (this.user.payPwdStatus != 0) {
        this.showPassword = true
        return
      }
      Dialog.confirm({ title: this.$t('wallet.setPayPassword') }).then(() => {
        this.$router.push('/security/payPassword')
      })
    },
    // scan(data) {
    //   // this.form.toAddress = data
    // },
    onInput(key) {
      this.form.payPassword = (this.form.payPassword + key).slice(0, 6)
      if (this.form.payPassword.length === 6) {
        this.$http
          .post('asset/withdraw', this.form)
          .then(() => {
            Toast.success()
            this.showPassword = false
            this.form.payPassword = ''
            this.form.money = null
          })
          .catch(() => {
            this.form.payPassword = ''
          })
          .finally(() => {
            this.$router.back()
          })
      }
    },
    onDelete() {
      this.form.payPassword = this.form.payPassword.slice(
        0,
        this.form.payPassword.length - 1
      )
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
::v-deep {
  .van-number-keyboard__header {
    height: auto;
  }
  .van-number-keyboard__title-left {
    position: relative;
    width: 100%;
    margin: 10px 0;
  }
}
</style>
