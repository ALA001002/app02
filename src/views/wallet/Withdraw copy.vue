<template>
  <BackPanel :title="coin+' '+$t('wallet.withdraw')">
    <van-tabs class="tab" v-model="form.type" color="#377DFF" title-inactive-color="#AAAAAA" type="card">
      <van-tab :title="$t('wallet.withdrawType1')" name="2"></van-tab>
<!--      <van-tab :title="$t('wallet.withdrawType2')" name="1"></van-tab>-->
    </van-tabs>
    <div class="section">
      <van-form @submit="onSubmit">
        <p class="mt-0 pl-2">{{$t('wallet.balance')}} {{account.balance}} {{coin}}</p>
        <div class="has-background-white panel">
          <van-field v-model.trim="form.toAddress" :label="$t('wallet.address')" :disabled="form.type!='1'" :placeholder="$t('wallet.enterAddress')">
            <!--<template #right-icon>
              <i class="icon icon-saoma" @click="showQrScan=true"/>
            </template>-->
          </van-field>
          <van-field v-model="form.money" type="number" :label="$t('wallet.num')" :placeholder="$t('wallet.enterNum')"/>
          <van-field v-model="form.remark" type="text" :label="$t('wallet.remark')" :placeholder="$t('wallet.enterRemark')"/>
        </div>
        <p class="px-2 is-flex-center">
          <span class="has-text-grey-light">{{$t('wallet.fee')}}: <span class="has-text-danger">{{fee}}</span> {{coin}}</span>
          <span class="has-text-grey-light">{{$t('wallet.toNum')}}: <span class="has-text-danger">{{num}}</span> {{coin}}</span>
        </p>
        <div style="margin: 16px 0;">
          <van-button :disabled="!form.toAddress || !num" block type="info" native-type="submit">
            {{$t('wallet.withdraw')}}
          </van-button>
        </div>
        <div class="html-content" v-html="remark"/>
      </van-form>
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
    </div>
  </BackPanel>
</template>

<script>
import BackPanel from '@/components/layout/BackPanel.vue'
// import QrScan from '@/components/QrScan.vue'
import { get} from 'vuex-pathify'
import { Toast, Dialog } from 'vant'
export default {
  components: { BackPanel },
  data() {
    return {
      showPassword: false,
      showQrScan: false,
      remark: null,
      data: {
        percent: 0
      },
      form: {
        type: '2',
        money: null,
        toAddress: null,
        payPassword: ''
      }
    }
  },
  computed: {
    wallet: get('user/wallet'),
    user: get('user/info'),
    account() {
      return this.wallet.find(p => this.coin == p.currency) || {}
    },
    coin: function() {
      return this.$route.params.coin
    },
    num() {
      return this.toNumber(this.form.money-this.fee>0?this.form.money-this.fee:0)
    },
    fee() {
      if (this.form.type == '1') return 0
      var fee = this.form.money * (this.data.percent)
      return this.toNumber(fee)
    }
  },
  watch: {
    user(){
      this.initAddress(this.coin)
    },
    coin: {
      handler(val) {
        if (!val) return
        this.form.coin = val
        this.initAddress(val)
        this.$http.get('common/getWithdrawInfo', {coin: val, type: this.form.type}).then(data => {
          this.data = data
        })
        this.$http.get('common/getSysArticle?key=tb'+val.toLowerCase()).then(data => {
          this.remark = data && data.content
        })
      },
      immediate: true
    }
  },
  methods: {
    initAddress(val){
      const self = this
      if(!this.user){
        setTimeout(()=>{
          self.initAddress()
        },1000)
        return
      }
      const data = typeof this.user==='string'?JSON.parse(this.user):this.user
      const {usdtWithdrawAddr,ethWithdrawAddr,btcWithdrawAddr,usdtTrc20WithdrawAddr} = data
      if(val === 'USDT'){
        this.form.toAddress = usdtWithdrawAddr
      }else if(val === 'BTC'){
        this.form.toAddress = btcWithdrawAddr
      }else if(val === 'ETH'){
        this.form.toAddress = ethWithdrawAddr
      }else if(val == 'USDT_TRC20') {
        this.form.toAddress = usdtTrc20WithdrawAddr
      }
      if(!this.form.toAddress) {
        Dialog.confirm({title: this.$t('wallet.setBindWithdrawAddr')}).then(() => {
          this.$router.push(`/wallet/bindWithdrawAddr/${val}`)
        })
      }else{
        this.form = {...this.form}
      }
    },
    onSubmit() {
      if (this.form.money > this.account.balance) {
        Toast.fail(this.$t('wallet.notEnough'))
        return
      }
      if (this.form.money < this.data.min) {
        Toast.fail(this.$t('wallet.withdrawMin') + ': ' + this.data.min + this.coin)
        return
      }
      if (this.user.payPwdStatus!=0) {
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
        this.$http.post('asset/withdraw', this.form).then(() => {
          Toast.success()
          this.showPassword = false
          this.form.payPassword = ''
          this.form.money = null
        }).catch(() => {
          this.form.payPassword = ''
        }).finally(()=>{
          this.$router.back()
        })
      }
    },
    onDelete() {
      this.form.payPassword = this.form.payPassword.slice(0, this.form.payPassword.length - 1)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
* {
  font-family:PingFangSC-Regular,PingFang SC;
}
.tab {
  width: 200px;
  margin: 20px auto;
}
.panel {
  border-radius:4px;
}
.title {
  margin-top: 10px;
}
.address {
  background:rgba(55,125,255,.06);
  border-radius:4px;
  padding: 10px 15px;
  margin-top: 10px;
}
$color: rgba(55,125,255,.4);
::v-deep{
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
