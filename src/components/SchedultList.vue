<template>
  <div style="position: fixed;left: 0;width: 100%;top: 0" id="shcedule-list" v-show="show">
    <div class="is-flex-center tab-top"  @click="()=>choose(-1)">
      <van-tabs
          ref="tab"
          v-model="tradeType"
          :title-active-color="color"
          title-inactive-color="rgba(255, 255, 255, 0.5)"
          :lazy-render="true"
          :color="color"
          :line-width="'45%'"
          :line-height="2"
          class="is-grow"
          background="transparent"
      >
        <van-tab name="1" title="收盘纪录"/>
        <van-tab name="2" title="交易记录"/>
        <van-tab name="3" title="输赢统计"/>
      </van-tabs>
      <van-button class="has-text-weight-light is-none" icon="arrow-down" @click="downClick"></van-button>
    </div>
    <!-- 资金账户 -->
    <van-action-sheet
      v-model="showAccount"
      close-on-click-action
      :cancel-text="$t('app.cancel')"
      :actions="accounts"
      :round ="false"
      @select="accountSelect"
    />

  </div>
</template>

<script>
import { get } from 'vuex-pathify'
import { Toast } from 'vant'
import http from '@/utils/http'
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    show:{
      type:Boolean,
      required: true
    }
  },
  data() {
    return {
      tradeType:1
    }
  },
  computed: {
    wallet: get('user/wallet'),
    accounts() {
      return this.wallet.map(p => {
        p.name = p.currency + ' ' + (p.virtual === 1 ? this.$t('exchange.imitate') : this.$t('exchange.account'))
        return p
      })
    },
    color() {
      return this.form.tradeType == '1' ? '#2DBC8C' : '#EB616E'
    },
    activeStyle() {
      return {
        backgroundColor: this.color,
        borderColor: this.color,
        color: '#fff'
      }
    },
    account() {
      console.log(this.accounts)
      if (this.accounts.length > 0) {
        return this.accounts[this.accountIndex]
      }
      return {}
    },
    predictPrice() {
      if (!this.data.slipPoint) return
      var ds = this.data.slipPoint.split('%')
      var val = this.form.tradeType == '1' ? Number(ds[0]) : - Number(ds[0])
      return this.toNumber(ds.length > 1 ? this.data.price * ((100 + val)/100) : this.data.price + val)
    },
    fee() {
      let fee = ((this.times.find(p => p.period === this.form.period) || {}).feeRate * 100)
      return fee
    }
  },
  watch: {
    'data.symbolCode': {
      handler(val) {
        this.times = []
        this.form.period = null
        this.$http.get('timeContract/getTimeContractPeriod?symbolCode=' + val).then(data => {
          this.times = data
          if (this.times.length > 0) {
            this.form.period = this.times[0].period
            this.form.yieldRate = this.times[0].yieldRate
            this.form.minMoney = this.times[0].minMoney
            this.form.fee = ((this.times.find(p => p.period === this.form.period) || {}).feeRate * 100)
          }
        })
      },
      immediate: true
    },
    mul(val) {
      if (val) {
        this.form.amount = this.toNumber(this.account.balance * val, 8)
      }
    },
    account(val) {
      this.form.currency = val.currency
    },
    form: {
      handler(val) {
        this.$emit('change', val)
      },
      immediate: true,
      deep: true
    }
  },
  mounted(){
    this.queryCurrent()
  },
  methods: {
    submit(){
      if(this.currentIndex<0 || this.currentIndex>7){
        Toast.fail('请选择类型')
        return
      }
      if (!this.form.amount){
        Toast.fail('请选择数量')
        return
      }
      http.getCreateOrderUrl().post('/periodOrder/create',{symbol:this.data.symbolCode,unit:this.unit,chooseType:this.currentIndex,amount:this.form.amount})
    },
    async queryCurrent(){
      let res = await this.$http.post('/periodOrder/current',{symbol:this.data.symbolCode,unit:this.unit})
      this.currentPeriod = res
      // const {start} = res
      setInterval(async ()=>{
        if(!this.currentPeriod || !this.currentPeriod.time || this.currentPeriod.time==='0:0') {
          res = await this.$http.post('/periodOrder/current', {symbol: this.data.symbolCode, unit: this.unit})
          this.currentPeriod = res
        }
        const times = this.currentPeriod.time.split(':')
        let minute = times[0],second = times[1]
        if(second>0){
          second = second-1
        }else{
          if(minute>0){
            minute -= 1
            second = 59
          }
        }
        this.currentPeriod.time=`${minute}:${second}`
      },1000)
    },
    async queryInfo(symbol){
      let res = await this.$http.post('/periodOrder/infos',{symbol,period:1})
      console.log(res)
      if(res){
        const {doubleOdds,largeDoubleOdds,largeOdds,largeSingleOdds,singleOdds,smallDoubleOdds,smallOdds,smallSingleOdds} = res
        switch (this.currentIndex){
          case 0:
            this.rate = smallOdds
            break
          case 1:
            this.rate = largeOdds
            break
          case 2:
            this.rate = singleOdds
            break
          case 3:
            this.rate = doubleOdds
            break
          case 4:
            this.rate = smallSingleOdds
            break
          case 5:
            this.rate = smallDoubleOdds
            break
          case 6:
            this.rate = largeSingleOdds
            break
          case 7:
            this.rate = largeDoubleOdds
            break
        }
      }
    },
    choose(index){
      this.currentIndex = index
      this.queryInfo(this.data.symbolCode)
    },
    load() {
      this.form.amount = null
      this.form.mul = null
    },
    downClick() {
      this.$emit('down')
    },
    resize() {
      this.$nextTick(() => {
        this.$refs.tab.resize()
      })
    },
    accountSelect(a, i) {
      this.accountIndex = i
    },
    showSetting() {
      if (this.form.amount) {
        this.showSet=true
      } else {
        Toast.fail(this.$t('exchange.amountError'))
      }
    },
    setSub(form) {
      this.showSet=false
      this.form = Object.assign({}, this.form, form)
    },
    assignment(item) {
      this.form.period = item.period
      this.form.yieldRate = item.yieldRate
      this.form.minMoney = item.minMoney
      this.form.fee = item.feeRate * 100
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
::v-deep {
  .is-border {
    >* {
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-width: 1px 0 1px 0;
      line-height: 36px;
    }
    :first-child { border-width: 1px; border-radius: 2px 0 0 2px; }
    :last-child { border-right-width: 1px; border-radius: 0 2px 2px 0; }
    .title {
      width: 75px;
      font-weight: inherit;
      font-size: inherit;
      color: white;
      margin: 0;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
  .tab-top {
    button { border-bottom: 1px solid #0B1424; }
    .van-hairline--top-bottom::after{
      border-top: 0;
      border-bottom: 2px solid #0B1424;
    }
  }
  .tab-small {
    >.van-tabs__wrap {
      height: 1.3rem;
    }
    .van-tabs__nav--card {
      margin: 0;
      height: 1.3rem;
      .van-tab {
        padding: 0;
        width: 3.5rem;
      }
      .van-tab__text--ellipsis {
        font-size: 80%;
      }
    }
  }
}
.input {
  box-sizing: border-box;
  background-color: transparent;
  border-radius: 0;
  line-height: 1.3rem;
  height: 37px;
  margin: 0;
  border-right-width: 1px;
  text-align: center;
  color: #fff;
  font-size: .7rem;
}
.yield {
  >div{
    line-height: 16px;
    padding: 5px 0;
    border-width: 1px 1px 1px 0;
  }
  .period {
    font-size: 18px;
    line-height: 28px;
  }
}
div.period-item span{
  background-color: #282c3c;
  border: 0.17rem solid #0f1118;
  border-radius: .336rem;
  flex: 1 1 5.88rem;
  font-weight: 700;
  height: 1.21rem;
  line-height: 1.04rem;
  margin-right: .42rem;
  text-align: center;
  transition: all .25s;
  margin-bottom: 0.42rem;
}
div.period-item span.active{
  border: 0.17rem solid rgb(70, 119, 215);
}
</style>
