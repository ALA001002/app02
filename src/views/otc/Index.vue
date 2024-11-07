<template>
  <Layout>
    <div class="section pb-1 has-text-centered header" slot="header">
      <span class="has-text-weight-bold is-size-6">{{ $t("app.otc") }}</span>
      <router-link tag="i" to="/otc/order">
        <van-icon :dot="hasOrder" name="jihuaweituo" class-prefix="icon" size="20"/>
      </router-link>
    </div>
    <van-tabs
      v-model="form.type"
      :title-active-color="color"
      title-inactive-color="#aaaaaa"
      :color="color"
      :border="false"
      :line-width="'45%'"
      :line-height="3"
      background="transparent"
    >
      <van-tab name="1" :title="$t('otc.buy')"/>
      <van-tab name="2" :title="$t('otc.sell')"/>
    </van-tabs>
    <div class="section has-background-white mb-2">
      <div class="is-flex-center mt-2">
        <!-- from btn -->
        <div class="is-grow">
          <span class="has-text-grey">{{$t('otc.fromTip'+form.type)}}</span>
          <van-button class="sw-btn mt-1" block @click="showFormList=true">{{from}}</van-button>
        </div>
        <van-icon class-prefix="icon" class="mx-3 pt-4" name="zhuangshijiantou02"/>
        <!-- to btn -->
        <div class="is-grow">
          <span class="has-text-grey">{{$t('otc.toTip'+form.type)}}</span>
          <van-button class="sw-btn mt-1" block @click="showToList=true">{{to}}</van-button>
        </div>
      </div>
      <van-field v-model="rateName" class="mt-4 mb-2 input disable" :label="$t('otc.rate')" readonly/>
    </div>
    <!-- 金额表单 -->
    <div class="section has-background-white is-grow has-text-grey-light">
      <p v-show="form.type == '2'">{{$t('exchange.balance')}}: {{fromWallet.balance}} {{fromWallet.currency}}</p>
      <van-field v-model="form.num" class="input" type="number" :placeholder="$t('otc.'+(isNum?'enterNum':'enterMoney'))">
        <template #button>
          {{isNum ? form.coin : form.legal}} | <span class="has-text-info" @click="isNum=!isNum">{{$t('otc.' + (isNum?'fromMoney':'fromNum'))}}</span>
        </template>
      </van-field>
      <p>{{anticipateText}}: {{anticipate}} {{isNum ? form.legal : form.coin}}</p>
      <p v-show="form.type == '1'">
        <van-radio-group v-model="payType" direction="horizontal">
          {{$t('otc.payType')}}：
          <van-radio :name="1">BankCard</van-radio>
          <van-radio :name="2">MoonPay</van-radio>
        </van-radio-group>
      </p>
      <div class="mt-5">
        <van-button
          :disabled="form.num <= 0"
          :type="form.type == '1' ? 'primary' : 'danger'"
          block
          native-type="submit"
          @click="showConfirmPanel()"
        >
          {{$t('otc.' + (form.type == '1' ? 'buyBtn' : 'sellBtn'))}}
        </van-button>
      </div>
      <div class="html-content mt-2" v-html="remark"/>
    </div>
    <van-action-sheet v-model="showFormList" :actions="formList" :cancel-text="$t('app.cancel')" close-on-click-action @select="formSelect"/>
    <van-action-sheet v-model="showToList" :actions="toList" :cancel-text="$t('app.cancel')" close-on-click-action @select="toSelect"/>
    <!-- 确认面板 -->
    <van-dialog v-model="showConfirm" :title="$t('otc.'+(this.form.type == '1' ? 'confirmBuy' : 'confirmSell'))" show-cancel-button @confirm="sub">
      <div class="confirmPanel">
        <div>{{$t('otc.type')}}</div>
        <div :style="{color: cform.type == '1' ? '#2DBC8C' : '#EB616E'}">
          {{cform.type == '1' ? $t('otc.buy') : $t('otc.sell')}}
        </div>
        <div>{{$t('otc.rate')}}</div><div>{{rateName}}</div>
        <div>{{$t('otc.num')}}</div><div>{{cform.num}} {{cform.coin}}</div>
        <div>{{$t('otc.money')}}</div><div>{{cform.anticipate}} {{cform.legal}}</div>
      </div>
    </van-dialog>
  </Layout>
</template>

<script>
import Layout from '@/components/layout/Index.vue'
import { get } from 'vuex-pathify'
import { Toast, Dialog } from 'vant'
export default {
  components: { Layout },
  data() {
    return {
      payType:1,
      data: {},
      isNum: true,
      remark: null,
      showFormList: false,
      showToList: false,
      showConfirm: false,
      hasOrder: false,
      cform: {},
      form: {
        type: '1',
        coin: null,
        legal: null,
        num: null
      },
      legalList: [],
      coinList: [],
      rateList: []
    }
  },
  created() {
    this.load()
  },
  computed: {
    wallet: get('user/wallet'),
    hq: get('hq/hq'),
    color() {
      return this.form.type == '1' ? '#2DBC8C' : '#EB616E'
    },
    fromWallet() {
      return this.wallet.find(p => this.form.coin == p.currency) || {}
    },
    rate() {
      var rateData = (this.rateList.find(p => p.legalCurrency == this.form.legal) || {})
      return this.form.type == '1' ? rateData.buyRate : rateData.sellRate
    },
    rateName() {
      return `${this.rate} ${this.form.legal} ≈ 1 ${this.form.coin}`
    },
    anticipate() {
      return this.isNum ? this.toNumber(this.rate * this.form.num) : this.toNumber(this.form.num / this.rate)
    },
    formList() {
      return (this.form.type == '1' ? this.legalList : this.coinList).map(p => ({ name: p }))
    },
    toList() {
      return (this.form.type == '2' ? this.legalList : this.coinList).map(p => ({ name: p }))
    },
    from() {
      return this.form.type == '1' ? this.form.legal : this.form.coin
    },
    to() {
      return this.form.type == '2' ? this.form.legal : this.form.coin
    },
    anticipateText() {
      if (this.form.type == '1') {
        return this.$t('otc.'+(this.isNum?'anticipateMoney':'anticipateNum'))
      }
      return this.$t('otc.'+(!this.isNum?'anticipateMoney':'anticipateNum'))
    }
  },
  watch: {
    legalList() {
      this.$nextTick(() => {
        this.form.legal = this.legalList[0]
        this.form.coin = this.coinList[0]
      })
    }
  },
  methods: {
    load() {
      this.$http.get('common/getSysArticle?key=cwjy').then(data => this.remark = data.content)
      this.$http.get('common/getLegalList').then(data => {
        this.legalList = data.map(p => p.legalCurrency)
        this.rateList = data
      })
      this.coinList = ['USDT']
      // 查看是否进行中的订单
      this.$http.get('otc/myOrderList').then((data) => {
        data = data.find(p => [0,1,4].includes(p.status))
        if (data) {
          this.hasOrder = true
          Dialog.confirm({ message: this.$t('otc.hasOrder') }).then(() => {
            this.$router.push('/otc/order/'+data.id)
          })
        }
      })
    },
    sub() {
      // console.log(this.form, this.cform)
      this.$http.post('otc/order', this.cform).then((data) => {
        Toast.success()
        this.form.amount = null
        this.$router.push(`/otc/order/${data}?payType=${this.payType}`)
      })
    },
    formSelect(action) {
      if (this.form.type == '1') {
        this.form.legal = action.name
      } else {
        this.form.coin = action.name
      }
    },
    toSelect(action) {
      if (this.form.type == '2') {
        this.form.legal = action.name
      } else {
        this.form.coin = action.name
      }
    },
    showConfirmPanel() {
      this.cform = Object.assign({}, this.form)
      if (!this.isNum) {
        this.cform.num = this.anticipate
      }
      this.cform.anticipate = this.isNum ? this.anticipate : this.form.num
      this.showConfirm = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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
  ::v-deep {
    .van-button__content{
      justify-content: space-between;
      &::after {
        font-family: "icon" !important;
        align-items: center;
        display: inline-flex;
        justify-content: center;
        content: "\e622";
        font-size: 8px;
        color: #aaaaaa;
      }
    }
  }
}
::v-deep {
  .van-dialog {
    text-align: left;
  }
  .van-dialog__content {
    padding: 20px 30px 30px 30px;
    color: #999999;
    line-height: 20px;
    font-size: 14px;
  }
}
.confirmPanel {
  >div{width: 50%; display: inline-block; padding: 1px 4px; box-sizing: border-box;; }
  >div:nth-child(even) { color: #242424; }
  small {color: rgba(255, 255, 255, 0.8);}
}
.header {
  position: relative;
  >i {
    position: absolute;
    right: 10px;
  }
}
</style>
