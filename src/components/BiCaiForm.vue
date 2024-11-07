<template>
  <div class="section">
    <div class="flex-between items-start">
      <div class="left" style="max-width:40%">
        <div class="text-17px text-bold">{{$t('extra.lastPeriod')}}</div>
        <div class="text-28px green mt-1" v-if="lastPeriodData">{{lastPeriodData.price}}</div>
        <div class="text-14px text-weight-mid mt-2">{{$t('extra.issue')}}</div>
        <div class="text-16px text-bold mt-2 mb-1">{{currentPeriod.period}}</div>
        <div class="text-14px text-weight-mid flex-between">
          {{$t('extra.countDown')}}
          <span class="text-20px" style="color:#FA6400">{{currentPeriod && currentPeriod.time}}</span>
        </div>
        <div class="flex-between flex-wrap mt-3" style="gap:7px">
          <template v-for="(item,index) in dataList">
            <span class=" small-btn mt-1 text-14px" v-bind:key="index" :class='currentIndex===index?"bg-primary":""' @click="()=>choose(index)" v-if="index<4">{{ item }}</span>
          </template>
          <!-- <template v-for="(item,index) in dataList">
            <span class=" small-btn mt-1 text-14px" v-bind:key="index" :class='currentIndex===index?"bg-primary":""' @click="()=>choose(index)" v-if="index>=4">{{ item }}</span>
          </template> -->
        </div>
        <div class="card-bg mt-3 text-center">
          <div class="text-16px">
            {{$t('extra.cuurentSelect')}}: {{dataList[currentIndex]}}
          </div>
          <div class="text-13px mt-1 text-primary flex-center">
            {{$t('extra.odds')}}:&nbsp;<span class="text-12px">{{rate}}</span>
          </div>
        </div>
      </div>
      <div class="flex1 ml-2 pt-5">
        <div class="card-bg mt-1 px-3">
          <div class="text-16px bb pb-2">{{lastPeriodData && lastPeriodData.totals.join('+')}}={{lastPeriodData && lastPeriodData.total}}</div>
          <div class="flex-between mt-2 text-mid">
            {{$t('extra.currentPeriod')}}
            <span v-if="lastPeriodData">{{lastPeriodData.total}}</span>
            <van-icon color="#fff" name="replay" size="25px" @click="queryCurrent" />
          </div>
          <div class="nums flex-between my-2 text-12px text-danger">
            <span v-if="lastPeriodData">{{dataList[+lastPeriodData.smallOrBig] || lastPeriodData.smallOrBig}}</span>
            <span v-if="lastPeriodData">{{dataList[+lastPeriodData.oddOrEvent]|| lastPeriodData.oddOrEvent}}</span>
            <span v-if="lastPeriodData">{{dataList[+lastPeriodData.twoValue]|| lastPeriodData.twoValue}}</span>
          </div>
        </div>
        <div class="money flex-between mt-2 text-12px">
          <div class="text-mid">{{$t('exchange.margin')}}</div>
          <span class="text-shallow">
            {{$t('exchange.balance')}} {{ account.balance }} {{ account.currency }}
          </span>
        </div>
        <div class="card-bg mt-1 py-3 flex-between">
          <input v-model="form.amount" class="text-16px" :placeholder="$t('extra.placeInput')" type="number" @change="mul=null" />
          <span class="text-primary nowrap ml-1" @click="mul = 1">{{$t('wallet.all')}} </span>
        </div>
        <div class="tr text-mid mt-1 mb-3 text-14px">{{$t('extra.waitTime')}}: {{currentPeriod.freezeData}}</div>
        <div class="big-btn" @click="submit" :disabled="freeze || disabled">{{$t('extra.calculate')}}</div>
      </div>
    </div>
    <DialogSuccess ref="DialogSuccess"></DialogSuccess>
    <!-- 资金账户 -->
    <!-- <van-action-sheet v-model="showAccount" close-on-click-action :cancel-text="$t('app.cancel')" :actions="accounts" :round="false" @select="accountSelect" /> -->
  </div>
</template>

<script>
import { get, call } from 'vuex-pathify'
import { Toast } from 'vant'
import { parseTime } from '@/utils/helper'
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
    unit: {
      type: Number,
      required: true,
    },
    disabled: Boolean,
  },
  data() {
    return {
      startFlag: false,
      startTime: null,
      endTime: null,
      currentDate: null,
      minDate: new Date(2021, 8, 1),
      maxDate: new Date(),
      showTime: false,
      date: null,
      scheduleList: [],
      lastPeriodData: null,
      freeze: false,
      showList: false,
      // unit:1,
      tradeType: 1,
      time: null,
      currentPeriod: {
        freezeData: 0,
      },
      resetFlag: false,
      dataList: [
        this.$t('extra.small'),
        this.$t('extra.big'),
        this.$t('extra.odd'),
        this.$t('extra.even'),
        this.$t('extra.smallOdd'),
        this.$t('extra.smallEven'),
        this.$t('extra.bigOdd'),
        this.$t('extra.bigEven'),
      ],
      rate: 0,
      currentIndex: -1,
      showAccount: false,
      accountIndex: 0,
      mul: null,
      muls: [
        { id: 1, name: this.$t('wallet.all') },
        // { id: 0.1, name: '10%' },
        // { id: 0.2, name: '20%' },
        // { id: 0.5, name: '50%' },
        // { id: 0.9, name: '90%' }
      ],
      times: [],
      timer: null,
      form: {
        startTime: null,
        endTime: null,
        currency: null, // 账户币
        amount: null, // 下单数量
        fee: null, //下单手续费
        period: 10, // 杠杆倍数
        tradeType: '1', // 1开多 2做空
        minMoney: null, //最低下单金额
      },
    }
  },
  computed: {
    wallet: get('user/wallet'),
    accounts() {
      return this.wallet.map(p => {
        p.name =
          p.currency +
          ' ' +
          (p.virtual === 1
            ? this.$t('exchange.imitate')
            : this.$t('exchange.account'))
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
        color: '#fff',
      }
    },
    account() {
      if (this.accounts.length > 0) {
        return this.accounts[this.accountIndex]
      }
      return {}
    },
    predictPrice() {
      if (!this.data.slipPoint) return
      var ds = this.data.slipPoint.split('%')
      var val = this.form.tradeType == '1' ? Number(ds[0]) : -Number(ds[0])
      return this.toNumber(
        ds.length > 1
          ? this.data.price * ((100 + val) / 100)
          : this.data.price + val
      )
    },
    fee() {
      let fee =
        (this.times.find(p => p.period === this.form.period) || {}).feeRate *
        100
      return fee
    },
  },
  watch: {
    unit() {
      this.queryCurrent()
    },
    async tradeType(val) {
      console.log(`${val}--${this.tradeType}`)
      this.queryList()
    },
    'data.symbolCode': {
      handler(val) {
        this.times = []
        this.form.period = null
        this.$http
          .get('common/getTimeContractPeriod?symbolCode=' + val)
          .then(data => {
            this.times = data
            if (this.times.length > 0) {
              this.form.period = this.times[0].period
              this.form.yieldRate = this.times[0].yieldRate
              this.form.minMoney = this.times[0].minMoney
              this.form.fee =
                (this.times.find(p => p.period === this.form.period) || {})
                  .feeRate * 100
            }
          })
      },
      immediate: true,
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
      deep: true,
    },
  },
  mounted() {
    this.queryList()
    this.queryCurrent()
  },
  methods: {
    ...call({
      updateWallet: 'user/wallet',
    }),
    parseTime(currentDate) {
      return parseTime(currentDate)
    },
    onConfirm() {
      this.queryList()
    },
    showDetailWin(index) {
      this.scheduleList[index].wCollapse = !this.scheduleList[index].wCollapse
      this.scheduleList = [...this.scheduleList]
    },
    getRule(price) {
      let match = (price + '').match('[0-9]\\.[0-9]{0,2}')
      if (!match) {
        price = price + '.00'
        match = (price + '').match('[0-9]\\.[0-9]{0,2}')
      }
      if (!match) {
        return ''
      }
      const result = match[0].replace('.', '')
      return result.split('').join('+')
    },
    async queryLastPeriod() {
      let data = await this.$http.create_order_post('/periodOrder/last', {
        symbol: this.data.symbolCode,
        unit: this.unit,
      })
      this.lastPeriodData = data
    },
    showDetail(index) {
      this.scheduleList[index].collapse = !this.scheduleList[index].collapse
      this.scheduleList = [...this.scheduleList]
    },
    closeAction() {
      this.showList = false
    },
    async queryList() {
      const val = this.tradeType
      let content = null
      if (val == 1) {
        let data = await this.$http.create_order_post('/periodOrder/historys', {
          pageSize: 100,
          symbol: this.data.symbolCode,
          unit: this.unit,
          startTime: this.startTime,
          endTime: this.endTime,
        })
        content = data.content
      }
      if (val == 2) {
        let data = await this.$http.create_order_post('/periodOrder/buylist', {
          pageSize: 100,
          symbol: this.data.symbolCode,
          unit: this.unit,
          startTime: this.startTime,
          endTime: this.endTime,
        })
        content = data.content
      }
      if (val == 3) {
        content = await this.$http.create_order_post('/periodOrder/winOrloss', {
          pageSize: 100,
          symbol: this.data.symbolCode,
          unit: this.unit,
        })
        content.unshift({
          dayNo: this.$t('exchange.date'),
          totalCount: this.$t('exchange.totalGameCount'),
          totalAmount: this.$t('exchange.totalInvestment'),
          totalPrice: this.$t('exchange.winlose'),
        })
      }
      this.scheduleList = content
    },
    async showListAction() {
      this.showList = true
      let { content } = await this.$http.create_order_post(
        '/periodOrder/historys',
        { pageSize: 100, symbol: this.data.symbolCode, unit: this.unit }
      )
      this.scheduleList = content
    },
    submit() {
      if (this.currentIndex < 0 || this.currentIndex > 7) {
        Toast.fail(this.$t('exchange.chooseType'))
        return
      }
      if (!this.form.amount) {
        Toast.fail(this.$t('exchange.inputAmount'))
        return
      }
      if (this.form.amount < 0.1 && this.form.amount.toFixed(1) !== '0.1') {
        Toast.fail(this.$t('service.price_not_valid'))
        return
      }
      this.$http
        .create_order_post(
          '/periodOrder/create',
          {
            symbol: this.data.symbolCode,
            unit: this.unit,
            chooseType: this.currentIndex,
            amount: this.form.amount,
          },
          true
        )
        .then(() => {
          // Toast.success(this.$t('exchange.buySuccess'))
          this.$refs.DialogSuccess.show()
          this.updateWallet()
        })
        .catch(err => {
          Toast.fail(window.i18n.t(`service.${err.msg}`))
        })
      this.form.amount = null
    },
    async queryCurrentData() {
      const self = this
      clearTimeout(this.timer)
      this.resetFlag = true
      this.timer = setTimeout(async () => {
        clearTimeout(self.timer)
        self.resetFlag = false
        let res = null
        if (
          !this.currentPeriod ||
          !this.currentPeriod.time ||
          this.currentPeriod.time === '0:0'
        ) {
          res = await self.$http.create_order_post('/periodOrder/current', {
            symbol: this.data.symbolCode,
            unit: this.unit,
          })
          if (this.resetFlag) {
            return
          }
          self.currentPeriod = res
          self.queryLastPeriod()
          self.queryList()
        }
        const times = self.currentPeriod.time.split(':')
        let minute = +times[0],
          second = +times[1]
        if (second > 0) {
          second = second - 1
        } else {
          if (minute > 0) {
            minute -= 1
            second = 59
          }
        }
        let lastSecond = second
        self.freeze = false
        let lastMinute = minute
        if (lastSecond >= 15) {
          lastSecond = lastSecond - 15
        } else {
          if (lastMinute >= 1) {
            lastMinute = lastMinute - 1
            lastSecond = lastSecond - 15 + 60
          } else {
            self.freeze = true
          }
        }
        self.currentPeriod.time = `${minute}:${second}`
        self.currentPeriod.freezeData = `${lastMinute}:${lastSecond}`
        if (self.resetFlag) {
          return
        }
        self.queryCurrentData()
      }, 1000)
    },
    async refreshAccountInfo() {
      this.$http.create_api.get('common/refreshAccountInfo')
    },
    async queryCurrent() {
      if (this.unit < 0) {
        return
      }
      let res = await this.$http.create_order_post('/periodOrder/current', {
        symbol: this.data.symbolCode,
        unit: this.unit,
      })
      this.currentPeriod = res
      this.queryLastPeriod()
      this.refreshAccountInfo()
      // const {start} = res
      this.queryCurrentData()
    },
    async queryInfo(symbol) {
      let res = await this.$http.create_order_post('/periodOrder/infos', {
        symbol,
        period: this.unit,
      })
      if (res) {
        const {
          doubleOdds,
          largeDoubleOdds,
          largeOdds,
          largeSingleOdds,
          singleOdds,
          smallDoubleOdds,
          smallOdds,
          smallSingleOdds,
        } = res
        switch (this.currentIndex) {
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
    choose(index) {
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
        this.showSet = true
      } else {
        Toast.fail(this.$t('exchange.amountError'))
      }
    },
    setSub(form) {
      this.showSet = false
      this.form = Object.assign({}, this.form, form)
    },
    assignment(item) {
      this.form.period = item.period
      this.form.yieldRate = item.yieldRate
      this.form.minMoney = item.minMoney
      this.form.fee = item.feeRate * 100
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
::v-deep {
  .is-border {
    > * {
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-width: 1px 0 1px 0;
      line-height: 36px;
    }
    :first-child {
      border-width: 1px;
      border-radius: 2px 0 0 2px;
    }
    :last-child {
      border-right-width: 1px;
      border-radius: 0 2px 2px 0;
    }
    .title {
      width: 75px;
      font-weight: inherit;
      font-size: inherit;
      color: white;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .tab-top {
    button {
      border-bottom: 1px solid #0b1424;
    }
    .van-hairline--top-bottom::after {
      border-top: 0;
      border-bottom: 2px solid #0b1424;
    }
  }
  .tab-small {
    > .van-tabs__wrap {
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
  font-size: 0.7rem;
}
.yield {
  > div {
    line-height: 16px;
    padding: 5px 0;
    border-width: 1px 1px 1px 0;
  }
  .period {
    font-size: 18px;
    line-height: 28px;
  }
}
div.period-item span {
  background-color: #282c3c;
  border: 0.17rem solid #0f1118;
  border-radius: 0.336rem;
  flex: 1 1 5.88rem;
  font-weight: 700;
  height: 1.21rem;
  line-height: 1.04rem;
  margin-right: 0.42rem;
  text-align: center;
  transition: all 0.25s;
  margin-bottom: 0.42rem;
}
div.period-item span.active {
  border: 0.17rem solid rgb(70, 119, 215);
}

.content-flex span:first-child {
  flex: 1.5;
}
.content-flex {
  border-top: 1px solid #3c3b3b;
}
.content-flex span {
  flex: 1;
  text-align: center;
  color: green;
  padding: 8px 0;
}
.schedule-list-parent {
  flex: 1;
  overflow-y: scroll;
}
.schedule-list-parent .content-item {
  display: block;
}
.content-flex .van-button {
  height: initial;
}
.close-action {
  text-align: center;
  height: 50px;
  color: gray;
  font-size: 25px;
}
.last-period {
  color: gray;
}
.last-period .row {
  height: 40px;
  font-size: 12px;
  line-height: 40px;
  display: flex;
  flex-direction: row;
  text-indent: 5px;
  border-bottom: 1px solid #3c3b3b;
}
.last-period .row span.result span {
  color: yellow;
  margin-left: 5px;
}
.last-period .row span:nth-child(2) {
  flex: 1;
  text-align: center;
}
.content-flex.children span {
  color: gray;
}
</style>
