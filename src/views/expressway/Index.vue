<template>
  <BackPanel :title="$t('wallet.expressway')">
<!--    <div class="section pb-1 has-text-centered header" slot="header">-->
<!--      <span class="has-text-weight-bold is-size-6">{{ $t("wallet.expressway") }}</span>-->
<!--      <router-link tag="i" to="/expressway/order">-->
<!--        <van-icon :dot="hasOrder" name="jihuaweituo" class-prefix="icon" size="20"/>-->
<!--      </router-link>-->
<!--    </div>-->
    <template slot="right">
      <router-link tag="i" to="/expressway/order">
        <van-icon :dot="hasOrder" name="jihuaweituo" class-prefix="icon" size="20"/>
      </router-link>
    </template>
    <div class="section has-background-white is-grow has-text-grey-light">
      <p v-show="form.type == '2'">{{$t('exchange.balance')}}: {{fromWallet.balance}} {{fromWallet.currency}}</p>
      <van-field v-model="form.amount" class="input" type="number" :placeholder="$t('otc.'+(isNum?'enterNum':'enterMoney'))">
        <template #button>
          USDT
        </template>
      </van-field>
<!--      <p>{{anticipateText}}: {{anticipate}} {{isNum ? form.legal : form.coin}}</p>-->
      <p>
        <van-radio-group v-model="form.payPassageId" direction="horizontal">
          {{$t('otc.payType')}}：
          <van-radio :name=item.id v-for="item in payTypes" v-bind:key="item.id">{{item.passageName}}</van-radio>
        </van-radio-group>
      </p>
      <div class="mt-5">
        <van-button
          :disabled="form.amount <= 0"
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
    <van-dialog v-model="showConfirm" :title="$t('otc.'+(this.form.type == '1' ? 'confirmBuy' : 'confirmSell'))" show-cancel-button @confirm="createOrder">
      <div class="confirmPanel">
<!--        <div>{{$t('otc.type')}}</div>-->
<!--        <div :style="{color: cform.type == '1' ? '#2DBC8C' : '#EB616E'}">-->
<!--          {{cform.type == '1' ? $t('otc.buy') : $t('otc.sell')}}-->
<!--        </div>-->
<!--        <div>{{$t('otc.rate')}}</div><div>{{rateName}}</div>-->
        <div>{{$t('otc.num')}}</div><div>{{cform.amount}} USDT</div>
      </div>
    </van-dialog>
  </BackPanel>
</template>

<script>
import { get } from 'vuex-pathify'
import { Toast } from 'vant'
import BackPanel from '../../components/layout/BackPanel'
export default {
  components: {BackPanel },
  data() {
    return {
      payTypes:[],
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
        type:1,
        amount:null,
        payPassageId: null
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
      this.$http.get('/pay/passageList').then((data)=>{
        this.payTypes = data
        this.form.payPassageId = data[0].id
      })
    },
    createOrder(){
      this.$http.post('/pay/createOrder',this.form).then((res)=>{
        Toast.success()
        this.form.amount = null
        if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
          // this.$router.push({name:'payway',params: {payUrl:res.payUrl} })
          setTimeout(
              function(){
                window.location.href = res.payUrl
              }, 5)
        } else {
          window.location.href = res.payUrl
        }
      })
    },
    sub() {
      // console.log(this.form, this.cform)
      this.$http.post('otc/order', this.cform).then((data) => {
        Toast.success()
        this.form.amount = null
        console.log(this.payType)
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
