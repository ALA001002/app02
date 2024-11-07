<template>
  <div class="subscription-switch">
    <van-nav-bar
      :title="$t('subscription.swichtitle')"
      safe-area-inset-top
      @click-left="$router.back()"
    >
      <template #left>
        <img class="activity-back" src="@/assets/images/activity/return.png" alt="">
      </template>
    </van-nav-bar>
    <div class="hero">
      <div class="section has-background-white mb-2">
        <div class="is-flex-center mt-4">
          <div class="is-grow sw-btn" @click="showFormList=true">
            <img class="pic" :src="imgs[form.from]" alt="">
            <span>{{form.from}}</span>
          </div>
          <van-icon class-prefix="icon" class="mx-3" name="qiehuan"/>
          <div class="is-grow sw-btn">
            <img class="pic" src="https://pic2.zhuanstatic.com/zhuanzh/35843616-d655-4f39-afc8-864105e570a4.png" alt="">
            <span>{{form.to}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="plan">
      <div class="plan-hyp" ><span class="plan-hy">{{fromWallet.balance}} {{fromWallet.currency}}</span>{{$t('exchange.balance')}}</div>
      <div class="input-w">
        <span>{{$t('subscription.num')}}</span>
        <van-field v-model="form.amount" class="plan-input" type="number">
          <template #button>
            <span class="has-text-info" @click="form.amount=fromWallet.balance">{{$t('wallet.all')}}</span>
          </template>
        </van-field>
      </div>
      <img class="divider" src="@/assets/images/activity/divider.png" alt="">
      <div class="info">
        <span>{{$t('wallet.rate')}} <span v-html="rateName"></span> </span> 
        <span>{{$t('wallet.anticipate')}} <sapn style="color: #F73168;">{{toNum}}</sapn> {{toWallet.currency}}</span>
      </div>
    </div>
    <div class="mt-5 btn">
      <van-button block type="info" :disabled="form.amount < data[form.from+'Min']" native-type="submit" @click="sub">{{$t('subscription.swichtitle')}}</van-button>
    </div>
    <div class="html-content mt-2" v-html="remark"/>
    <van-action-sheet v-model="showFormList" :actions="formList" :cancel-text="$t('app.cancel')" close-on-click-action @select="formSelect"/>
    <van-action-sheet v-model="showToList" :actions="toList" :cancel-text="$t('app.cancel')" close-on-click-action @select="toSelect"/>
  </div>
</template>

<script>
import { get } from 'vuex-pathify'
import { Toast, Dialog } from 'vant'
export default {
  components: { },
  data() {
    return {
      data: {},
      remark: null,
      showFormList: false,
      showToList: false,
      form: {
        from: 'ETH',
        to: 'USDT',
        amount: 0
      },
      imgs: {
        'BTC': 'https://pic1.zhuanstatic.com/zhuanzh/578d2bac-9b64-4d9b-ae5e-e611730fb34d.png',
        'USDT': 'https://pic4.zhuanstatic.com/zhuanzh/aef2d4dd-1adf-471f-a6c2-794b428eb715.png',
        'ETH': 'https://pic3.zhuanstatic.com/zhuanzh/2ed01b85-1db9-4a37-8615-567d25eb9d73.png',
        'DIEM': 'https://pic2.zhuanstatic.com/zhuanzh/35843616-d655-4f39-afc8-864105e570a4.png'
      }
    }
  },
  created() {
    this.load()
    this.form.from = this.$route.query.from || 'ETH'
    this.form.to = this.$route.query.to || 'DIEM'
  },
  computed: {
    userWallet: get('user/wallet'),
    wallet() {
      return this.userWallet.filter(p => p.supExchange === 1)
    },
    hq: get('hq/hq'),
    fromWallet() {
      return this.wallet.find(p => this.form.from == p.currency) || {}
    },
    toWallet() {
      return this.wallet.find(p => this.form.to == p.currency) || {}
    },
    rate() {
      // if (this.form.from != 'USDT') {
      //   var hqFrom = this.hq.find(p => p.from == this.form.from) || {}
      //   if (this.data[this.form.from.toLowerCase()]) {
      //     hqFrom = this.data[this.form.from.toLowerCase()]
      //   }
      //   return this.toNumber(hqFrom.price)
      // } else {
      //   var hqTo = this.hq.find(p => p.from == this.form.to) || {}
      //   if (this.data[this.form.to.toLowerCase()]) {
      //     hqTo = this.data[this.form.to.toLowerCase()]
      //   }
      //   return this.toNumber(1/hqTo.price)
      // }
      var hqTo = this.hq.find(p => p.symbolName == 'DIEM/' + this.form.from) || {}
      return this.toNumber(1/hqTo.price)
    },
    rateName() {
      return `<sapn style="color: #F73168;">1</sapn> ${this.form.from} ≈ <sapn style="color: #F73168;">${this.rate}</sapn> ${this.form.to}`
    },
    toNum() {
      var feeRate = this.data.feeRate
      var name = this.form.from !== 'USDT' ? this.form.from.toLowerCase() : this.form.to.toLowerCase()
      if (this.data[name]) feeRate = this.data[name].feeRate
      return this.toNumber((1 - feeRate) * this.rate * this.form.amount)
    },
    formList() {
      var list = this.wallet.filter(p => p.currency !== 'DIEM')
      return list.map(p => {
        return {
          name: p.currency
        }
      })
    },
    toList() {
      var list
      if (this.form.from == 'USDT') {
        list = this.wallet.filter(p => p.currency != 'USDT')
      } else {
        list = this.wallet.filter(p => p.currency == 'USDT')
      }
      return list.map(p => {
        return {
          name: p.currency
        }
      })
    }
  },
  methods: {
    load() {
      this.$http.get('common/getExchangeInfo').then(data => this.data = data)
      this.$http.get('common/getSysArticle?key=sd').then(data => this.remark = data.content)
    },
    sub() {
      Dialog.confirm({ title: this.$t('wallet.confirmSwitch') }).then(() => {
        this.$http.post('asset/quickExchange', this.form).then(() => {
          Toast.success()
          this.form.amount = null
        })
      })
    },
    sw() {
      var tmp = this.form.from
      this.form.from = this.form.to
      this.form.to = tmp
    },
    formSelect(action) {
      this.form.from = action.name
      // this.$nextTick(() => {
      //   this.form.to = this.toList[0].name
      // })
    },
    toSelect(action) {
      this.form.to = action.name
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.subscription-switch {
  .activity-back {
    width: 17px;
    height: 16px;
  }
  .van-hairline--bottom::after {
    border: none;
  }
  .hero {
    height: 100%;
  }
  .input {
    border: 1px solid #F4F5F6;
    border-radius:2px;
  }
  .disable {
    background-color: #F4F5F6;
    ::v-deep {
      .van-cell__title {
        color: #aaaaaa;
      }
      .van-field__control{
        text-align: right;
      }
    }
  }
  .sw-btn {
    width: 145px;
    height: 54px;
    background: #FFFFFF;
    box-shadow: 0px 10px 20px 0px rgba(117, 117, 170, 0.1);
    border-radius: 3px;
    border: 1px solid #F0F0F0;
    font-size: 14px;
    font-family: Eina03-SemiBold, Eina03;
    font-weight: 600;
    color: #000000;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 14px 0 15px;
    .pic {
      widows: 26px;
      height: 26px;
      margin-right: 10px;
    }
  }
  .plan {
    padding-top: 24px;
    margin: 20px auto 30px;
    width: 335px;
    height: 160px;
    background: #FFFFFF;
    box-shadow: 0px 10px 30px 0px rgba(87, 88, 176, 0.1);
    .plan-hy {
      margin-left: 14px;
      margin-right: 6px;
      height: 20px;
      font-size: 14px;
      font-family: Eina03-Bold, Eina03;
      font-weight: bold;
      color: #333333;
      line-height: 19px;
    }
    .plan-hyp {
      color: #AAAAAA;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
    }
  }
  .input-w {
    height: 44px;
    margin-top: 11px;
    margin-bottom: 9px;
    padding-left: 20px;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #333333;
    .plan-input {
      width: 200px;
      font-size: 32px;
      font-family: Eina03-SemiBold, Eina03;
      font-weight: 600;
      text-align: right;
    }
    ::v-deep {
      .van-field__control {
        color: #3E41F7 !important;
      }
    }
    
  }
  .divider {
    height: 8px;
    width: 100%;
  }
  .info {
    padding: 0 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 14px;
    font-size: 10px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #aaaaaa;
    line-height: 14px;
  }
  .btn {
    width: 334px;
    margin: 0 auto;
  }
  .has-text-info {
    font-size: 12px;
  }
}
</style>
