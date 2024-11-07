<template>
  <div>
    <div class="last-period">
      <div class="row">
        <span>{{$t('extra.lastPeriod')}}:<span v-if="lastPeriodData">{{lastPeriodData.price}}</span></span>
        <span v-if="lastPeriodData">
          <span>{{lastPeriodData && lastPeriodData.totals.join('+')}}={{lastPeriodData && lastPeriodData.total}}</span>
        </span>
        <span @click="showListAction" style="margin-right: 10px;">{{$t("exchange.record")}}</span>
        <van-button class="has-text-weight-light is-none" icon="arrow-down" @click="downClick"></van-button>
      </div>
      <div class="row">
        <span>{{$t('exchange.resultData')}}</span>
        <span class="result">
          <span v-if="lastPeriodData">{{lastPeriodData.total}}</span>
          <span v-if="lastPeriodData">{{dataList[+lastPeriodData.smallOrBig] || lastPeriodData.smallOrBig}}</span>
          <span v-if="lastPeriodData">{{dataList[+lastPeriodData.oddOrEvent]|| lastPeriodData.oddOrEvent}}</span>
          <span v-if="lastPeriodData">{{dataList[+lastPeriodData.twoValue]|| lastPeriodData.twoValue}}</span>
        </span>
        <span>
          <van-icon name="replay" style="margin-right: 30px;line-height: 40px;" size="25px" @click="queryCurrent" />
        </span>
      </div>
    </div>
    <div class="is-flex-center tab-top" @click="()=>choose(-1)">
      <div style="padding: 10px 0; width: 1px;flex:1;text-align: center;color:gray">
        <span style="font-size: 16px;"><span>{{$t("exchange.period")}}</span><span>{{currentPeriod && currentPeriod.period}}</span>
          <span style="margin-left: 10px;">{{currentPeriod && currentPeriod.time}}</span></span>
        <span style="clear: both;"></span>
      </div>
    </div>
    <div class="section pt-0 has-text-weight-light">
      <div>
        <div class="is-flex-center period-item">
          <template v-for="(item,index) in dataList">
            <span v-bind:key="index" :class='currentIndex===index?"active":""' @click="()=>choose(index)" v-if="index<4">{{ item }}</span>
          </template>
        </div>
        <div class="is-flex-center period-item">
          <template v-for="(item,index) in dataList">
            <span v-bind:key="index" :class='currentIndex===index?"active":""' @click="()=>choose(index)" v-if="index>=4">{{ item }}</span>
          </template>
        </div>
      </div>
      <div v-if="currentIndex>-1" class="is-flex-center mt-3 is-border has-text-centered yield">
        <div v-if="currentIndex>-1" class="is-grow">
          {{ $t('exchange.currentChoose') }}:<span style="margin-right: 10px;">{{dataList[currentIndex]}}</span>
          <span class="period">{{ $t('exchange.winOrLossRate') }}：{{ rate }}</span>
        </div>
      </div>
      <div v-if="currentIndex>-1" class="is-flex-center mt-3 is-border has-text-centered">
        <div class="title">{{$t('exchange.margin')}}</div>
        <input v-model="form.amount" class="is-grow input" type="number" @change="mul=null" />
        <div v-for="item in muls" style="width: 42px" :key="item.id" :style="mul == item.id?activeStyle:null" @click="mul = item.id">
          {{ item.name }}
        </div>
      </div>
      <div v-if="currentIndex>-1" class="is-flex-center mb-1 mt-2">
        <span>
          {{ $t('exchange.balance') }} {{ account.balance }} {{ account.currency }}
          <!--<router-link to="/switchp?from=USDT&to=BIGO" style="color: #377DFF">{{$t('wallet.switch')}}</router-link>-->
        </span>
        <span style="flex: 1;text-align: center;">
          {{$t('exchange.freezeTime')}}:{{freeze?$t('exchange.inResultTime'):currentPeriod.freezeData}}
        </span>
        <!--        <span>-->
        <!--          <span v-help="$t('exchange.freeze')" class="mr-1">{$t('exchange.freeze')}:{ account.freeze }}</span>-->
        <!--        </span>-->
      </div>
      <div v-if="currentIndex>-1">
        <button class="button is-primary is-grow" :disabled=freeze style="width:100%;" @click="submit">{{$t("exchange.buyGoods")}}</button>
      </div>
    </div>
    <!-- 资金账户 -->
    <van-action-sheet v-model="showAccount" close-on-click-action :cancel-text="$t('app.cancel')" :actions="accounts" :round="false" @select="accountSelect" />
    <div style="position: fixed;left: 0;width: 100%;top: 0" id="schedule-page" v-show="showList">
      <div class="is-flex-center tab-top" @click="()=>choose(-1)">
        <van-tabs ref="tab" v-model="tradeType" :title-active-color="color" title-inactive-color="rgba(255, 255, 255, 0.5)" :lazy-render="true" :color="color" :line-width="'45%'" :line-height="2" class="is-grow" background="transparent">
          <van-tab name="1" :title="$t('exchange.closeRecord')" />
          <van-tab name="2" :title="$t('exchange.tradeRecord')" />
          <van-tab name="3" :title="$t('exchange.winOrLossStat')" />
        </van-tabs>
        <!--        <van-button class="has-text-weight-light is-none" icon="arrow-down" @click="()=>{this.showList=false}"></van-button>-->
      </div>
      <div class="schedule-list-parent">
        <div v-if="tradeType==1 || tradeType==2">
          <span type="primary" style="display: block;line-height: 30px;font-size: 16px;text-align: center;" @click="startFlag=true,showTime=true">{{$t('exchange.startTime')}}：{{startTime?`${startTime}`:$t('exchange.pleaseSelect')}}</span>
          <span type="primary" style="display: block;line-height: 30px;font-size: 16px;text-align: center;" @click="startFlag=false,showTime=true">{{$t('exchange.endTime')}}：{{endTime?`${endTime}`:$t('exchange.pleaseSelect')}}</span>
          <span @click="onConfirm" style="display:block;margin-left: 10px;font-size: 22px;margin-bottom: 10px;text-align: center">{{ $t('exchange.search') }}</span>
          <van-datetime-picker v-if="showTime" v-model="currentDate" type="datetime" title="选择完整时间" :min-date="minDate" :max-date="maxDate" @confirm="showTime = false,startFlag?(startTime=parseTime(currentDate)):(endTime=parseTime(currentDate))" />
          <!--          <van-cell :title="$t('exchange.startTime')" :value="date" @click="showTime = true" />-->
          <!--          <van-field v-model="form.startTime" class="mt-4 mb-2 input " :label="$t('exchange.startTime')" />-->
          <!--          <van-field v-model="form.endTime" class="mt-4 mb-2 input" :label="$t('exchange.endTime')" />-->
        </div>
        <div style="display: flex;flex-direction: row;color:white;" v-if="tradeType==2" class="content-flex">
          <span>{{$t('exchange.period')}}</span><span>{{$t('exchange.shoupan')}}</span><span>{{$t('exchange.resultData')}}</span><span>{{$t('exchange.chooseDetail')}}</span><span>{{$t('exchange.chooseAmount')}}</span><span>{{$t('exchange.result')}}</span>
        </div>
        <div v-for="(item,index) in scheduleList" v-bind:key="index" class="content-item">
          <div v-if="tradeType==2" style="display: flex;flex-direction: row;font-size: 12px;" class="content-flex">
            <span>{{item.period}}</span><span>{{item.result}}</span><span>{{item.total}}</span><span>{{dataList[item.chooseType]}}</span><span>{{item.amount}}</span><span>{{(item.price)}}</span>
            <!--            <span><van-button class="has-text-weight-light is-none" :icon="item && item.collapse?'arrow-up':'arrow-down'" @click="()=>showDetail(index)"></van-button></span>-->
          </div>
          <div v-if="tradeType==1" style="display: flex;flex-direction: row;" class="content-flex">
            <span>{{item.period}}</span><span>{{item.price}}</span><span>{{getRule(item.price)}}</span><span>{{item.total}}</span><span>{{dataList[+item.twoValue] || item.twoValue}}</span>
          </div>
          <div v-if="item && item.collapse">
            <div style="display: flex;flex-direction: row;" class="content-flex">
              <span>{{$t('exchange.margin')}}</span><span>{{$t('exchange.lossOrWin')}}</span><span>{{$t('exchange.winOrLoss')}}</span>
            </div>
            <div v-for="(order,iIndex) in item.orderList" style="display: flex;flex-direction: row;" class="content-flex" v-bind:key="index+iIndex">
              <span>{{order.amount}}</span><span>{{order.resultFlag?$t('exchange.win'):$t('exchange.loss')}}</span><span>{{order.price}}</span>
            </div>
          </div>
          <div v-if="tradeType==3 && item" style="display: flex;flex-direction: row;" class="content-flex">
            <span>{{item && item.dayNo}}</span>
            <span>{{item && item.totalCount}}</span>
            <span>{{item && item.totalAmount}}</span>
            <span>{{item && item.totalPrice}}</span>
            <!--            <span v-if="index===0"></span>-->
            <!--            <span v-if="index>0"><van-button class="has-text-weight-light is-none" :icon="item && item.wCollapse?'arrow-up':'arrow-down'" v-if="tradeType==3" @click="()=>showDetailWin(index)"></van-button></span>-->
          </div>
          <!--          <div   v-if="item && item.wCollapse">-->
          <!--            <div v-for="(order,iIndex) in item.scheduleOrderList" style="display: flex;flex-direction: row;color:gray;" class="content-flex children" v-bind:key="index+iIndex">-->
          <!--              <span>{{order.period}}</span><span>{{getRule(order.result)}}</span><span>{{order.total}}</span><span>{{order.twoValue}}</span>-->
          <!--            </div>-->
          <!--          </div>-->
        </div>
      </div>
      <div class="close-action">
        <span style="padding: 20px" @click="()=>closeAction()">{{ $t('exchange.close') }}</span>
      </div>
    </div>
    <!--    <van-calendar style="color: black;" v-model="showTime" @confirm="onConfirm" :min-date="minDate" :max-date="maxDate"/>-->
  </div>
</template>

<script>
import { get } from 'vuex-pathify'
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
        this.$t('exchange.small'),
        this.$t('exchange.big'),
        this.$t('exchange.odd'),
        this.$t('exchange.even'),
        this.$t('exchange.smallOdd'),
        this.$t('exchange.smallEven'),
        this.$t('exchange.bigOdd'),
        this.$t('exchange.bigEven'),
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
          .get('timeContract/getTimeContractPeriod?symbolCode=' + val)
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
          Toast.success(this.$t('exchange.buySuccess'))
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
#schedule-page {
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  z-index: 100;
  display: flex;
  flex-direction: column;
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
