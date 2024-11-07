<template>
  <Layout>
    <NavBar slot="header" back></NavBar>
    <div class="big-title px-4">{{$t('wallet.withdraw')}}</div>
    <div class="section">
<!--      <div class="card-bg  flex-between  px-3 py-3" @click="showSelectModal=true">
        <div class="flex1">
          <div class="flex" v-if="type==1">
            <CoinImg class="box20 mr-2" :coin="coin"></CoinImg>
            <span>{{coin}}</span><span class="text-12px text-mid"></span>
          </div>
          <div class="flex" v-else>
            <span>{{$t('wallet.expressway')}}</span><span class="text-12px text-mid"></span>
          </div>
          <div class="text-12px text-shallow mt-2"> {{$t('extra.minimumWithdrawalAmount')}}: {{data.min}}{{coin}}</div>
        </div>
        <van-icon name="arrow" color="#ADACB0" size="16px"></van-icon>
      </div>-->
      <div class="card-bg flex-between  px-3 py-4" @click="showSelectModal=true">
        <div class="flex1">
          <span>{{$t('wallet.withdrawType1')}}</span>
<!--          <span v-else>{{$t('wallet.expressway')}}</span>-->
          <!--              <span>{{$t('extra.selfRecharge')}}</span>-->
        </div>
        <van-icon name="arrow" color="#ADACB0"></van-icon>
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
<!--      <van-form v-else ref="form" :show-error="false">
        <div class="card-bg  mt-3">
          <van-field autocomplete="new-password" v-model="form2.accountName" class="mt-0 p-1" :placeholder="$t('extra.accountName')" clearable />
        </div>
        <div class="card-bg  mt-3">
          <van-field autocomplete="new-password" v-model="form2.accountNo" class="mt-0 p-1" :placeholder="$t('extra.accountNo')" clearable />
        </div>
        <div class="card-bg  mt-3">
          <van-field autocomplete="new-password" v-model="form2.receiverPhone" class="mt-0 p-1" :placeholder="$t('extra.receiverPhone')" clearable />
        </div>
        <div class="card-bg  flex-between  px-3 py-4 mt-4" @click="showBankList=true">
          <div class="text-deep text-16px wb mr-4" v-if="bank.id">
            {{bank.bankName}}
          </div>
          <div class="text-shallow text-16px" v-else>
            {{$t('extra.chooseBank')}}
          </div>
          <van-icon name="arrow" color="#ADACB0" size="16px"></van-icon>
        </div>
      </van-form>-->
      <div class="big-btn radius my-5" :disabled="!form.toAddress || !num" @click="onSubmit()">
        {{$t('wallet.withdraw')}}
      </div>
<!--      <div class="big-btn radius my-5" v-else :disabled="!bank.id || !num || !form2.accountName || !form2.accountNo || !form2.receiverPhone" @click="onSubmit()">
        {{$t('wallet.withdraw')}}
      </div>-->
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
    <van-action-sheet v-model="showSelectModal" close-on-click-action :cancel-text="$t('app.cancel')" :actions="actions" :round="false" @select="setType" />
    <van-popup v-model="showBankList" round position="bottom">
      <van-picker show-toolbar :cancel-button-text="$t('extra.cancel')" :confirm-button-text="$t('extra.confirm')" value-key="bankName" :columns="banCodeList" :default-index="0" @confirm="setBank" @cancel="showBankList = false" />
    </van-popup>
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
      // persion: 2,
      type: 1,
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
      form2: {
        accountName: '',
        accountNo: '',
        receiverPhone: '',
      },
      banCodeList: [],
      bank: {},
      showSelectModal: false,
      showBankList: false,
      actions: [
        // { name: this.$t('wallet.expressway'), type: 2 },
        { name: this.$t('wallet.withdrawType1'), type: 1 },
      ],
    }
  },
  created() {
    const address = sessionStorage.getItem('address')
    if (address) {
      this.form.toAddress = address
      sessionStorage.removeItem('address')
    }
    const addressId = sessionStorage.getItem('addressId')
    if (addressId) {
      this.form.withdrawAddressId = addressId
      sessionStorage.removeItem('addressId')
    }
    const money = sessionStorage.getItem('money')
    if (money) {
      this.form.money = money
      sessionStorage.removeItem('address')
    }
    this.type = 2
    /*this.$http.get('pay/banCodeList').then(data => {
      this.banCodeList = data
    })*/
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
    setType({ type }) {
      this.persion = type
      this.type = type
      /*if (type === 2) {
        this.$http.get('pay/banCodeList').then(data => {
          this.banCodeList = data
        })
        return
      }*/
    },
    setBank(bank) {
      this.bank = bank
      this.showBankList = false
    },
    setAll() {
      this.form.money = this.account.balance
    },
    toSelect() {
      if (this.form.toAddress)
        sessionStorage.setItem('address', this.form.toAddress)
      if (this.form.money) sessionStorage.setItem('money', this.form.money)
      if (this.form.withdrawAddressId)
        sessionStorage.setItem('addressId', this.form.withdrawAddressId)
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
    onSubmitFast() {
      const data = {
        ...this.form2,
        payPassword: this.form.payPassword,
        money: this.form.money,
        bankCodeId: this.bank.id,
      }
      this.$http
          .post('asset/trans', data)
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
    },
    onInput(key) {
      this.form.payPassword = (this.form.payPassword + key).slice(0, 6)
      if (this.form.payPassword.length === 6) {
        // if (this.type === 2) {
        //   return this.onSubmitFast()
        // }
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
  .van-field__control::-webkit-input-placeholder {
    color: #666666;
    font-weight: 600;
  }
  .van-number-keyboard__title-left {
    position: relative;
    width: 100%;
    margin: 10px 0;
  }
}
</style>
