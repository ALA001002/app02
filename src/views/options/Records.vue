<template>
  <div class="records" :class="{'page-full':!symbol}">
    <span v-if="!symbol" class="back-icon okcoin okcoin-back flex-center" :style="{'margin-top':!symbol?statusBarHeight + '!important': '' }" @click="$router.go(-1)"></span>
    <div class="flex-between mb-1 mt-2" :class="{'back-padding':!symbol}" :style="{'margin-top':!symbol?statusBarHeight + '!important': '' }">
      <van-tabs v-model="tradeType" type="card" class="flex1" animated show-header no-padding>
        <van-tab name="1" :title="$t('extra.closingRecord')"> </van-tab>
        <van-tab name="2" :title="$t('extra.forecastRecord')"> </van-tab>
        <van-tab name="3" :title="$t('extra.winLoseRecord')"></van-tab>
      </van-tabs>
      <span class="link pr-4 text-13px text-primary" v-if="symbol" @click="$router.push('/record/' + symbol + '/' + unit)">{{$t('extra.moreRecord')}}</span>
    </div>
    <van-calendar v-model="showDatePicker" title="" @select="dateConfirm" :show-confirm="false" :min-date="new Date(new Date() -  3600000 * 24 * 365)" :max-date="new Date()" />
    <div class="section" v-if="tradeType!=='3' && !symbol">
      <div class="time-pirker card-bg mb-2 px-3 py-3 flex-between text-15px" @click="showDatePicker=true,timeStr = 'startTime'">
        {{$t('extra.startTime')}}
        <div class="flex1 ml-3 text-16px">
          <div class="holder" v-if="startTime">{{startTime}}</div>
          <div class="holder text-shallow" v-else>{{$t('extra.placeChoose')}}</div>
        </div>
        <img class="box20" src="@/assets/images/new/arrow-down.svg">
      </div>
      <div class="time-pirker card-bg mb-2 px-3 py-3 flex-between text-15px" @click="showDatePicker=true,timeStr = 'endTime'">
        {{$t('extra.endTime')}}
        <div class="flex1 ml-3 text-16px">
          <div class="holder" v-if="endTime">{{endTime}}</div>
          <div class="holder text-shallow" v-else>{{$t('extra.placeChoose')}}</div>
        </div>
        <img class="box20" src="@/assets/images/new/arrow-down.svg">
      </div>
      <div class="big-btn radius" :disabled=" !((this.startTime && this.endTime) ||  (!this.startTime && !this.endTime))" @click="search">{{$t('extra.search')}}</div>
    </div>
    <div class="page-full-part flex-column">
      <template v-if="tradeType==='1'">
        <div class="section">
          <div class="header card-bg flex-between text-11px text-shallow py-1 br0">
            <div class="th flex2">{{$t('extra.tableThNum')}}</div>
            <div class="th flex1 mr-2">{{$t('extra.tableThClosing')}}</div>
            <div class="th flex1">{{$t('extra.tableThSettlement')}}</div>
            <div class="th flex1 text-center">{{$t('extra.tableThRes')}}</div>
            <div class="th flex1 tr">{{$t('extra.tableThDetail')}}</div>
          </div>
        </div>
        <ScrollMore class="section flex1 py-0" api="periodOrder/historys" :once="size===3" method="post" ref="ScrollMore" :size="size" :paramsLoad="false" :params="params" key="historys">
          <template slot-scope="{list}">
            <div v-for="(item) in list" :key="item.id" class="content-item bb text-11px text-shallow flex-between px-2" style="line-height:3.4">
              <div class="flex2">{{item.period}}</div>
              <div class="flex1 mr-2">{{item.price}}</div>
              <div class="flex1">{{getRule(item.price)}}</div>
              <div class="flex1 text-center">{{item.total}}</div>
              <div class="flex1 tr">{{dataList[+item.twoValue] || item.twoValue}}</div>
            </div>
            {{size===3?'&nbsp;':''}}
          </template>
        </ScrollMore>
      </template>
      <template v-else-if="tradeType==='2'">
        <div class="section">
          <div class=" card-bg flex-between text-11px text-shallow py-1 br0">
            <div class="th flex2">{{$t('extra.tableThNum')}}</div>
            <div class="th flex1">{{$t('extra.tableThClosing')}}</div>
            <div class="th flex1 tc">{{$t('extra.tableThRes')}}</div>
            <div class="th flex1 ">{{$t('extra.calculateDetail')}}</div>
            <div class="th flex1  ">{{$t('extra.calculatePrice')}}</div>
            <div class="th flex1 tr">{{$t('extra.tableThSettlement')}}</div>
          </div>
        </div>
        <ScrollMore class="section flex1 py-0" api="periodOrder/buylist" :once="size===3" method="post" ref="ScrollMore" :size="size" :paramsLoad="false" :params="params" key="buylist">
          <template slot-scope="{list}">
            <div v-for="(item) in list" :key="item.id" class="content-item bb text-11px text-shallow flex-between px-2" style="line-height:3.4">
              <div class="flex2">{{item.period}}</div>
              <div class="flex1 ">{{item.result}}</div>
              <div class="flex1 text-center">{{item.total}}</div>
              <div class="flex1 text-center">{{dataList[item.chooseType]}}</div>
              <div class="flex1 text-center">{{item.amount}}</div>
              <div class="flex1 tr">{{item.price}}</div>
            </div>
            {{size===3?'&nbsp;':''}}
          </template>
        </ScrollMore>
      </template>
      <template v-else>
        <div class="section">
          <div class=" card-bg flex-between text-11px text-shallow py-1 br0">
            <div class="th flex1">{{$t('extra.date')}}</div>
            <div class="th flex1 ml-4">{{$t('extra.gameTimes')}}</div>
            <div class="th flex1">{{$t('extra.totalInvestment')}}</div>
            <div class="th flex1 tc">{{$t('extra.winOrLose')}}</div>
          </div>
        </div>
        <ScrollMore class="section flex1 py-0" api="periodOrder/winOrloss" :once="size===3" method="post" ref="ScrollMore" :size="size" :paramsLoad="false" :params="params" key="winOrloss">
          <template slot-scope="{list}">
            <div v-for="(item) in list" :key="item.id" class="content-item bb text-11px text-shallow flex-between px-2" style="line-height:3.4">
              <div class="flex1">{{item.dayNo}}</div>
              <div class="flex1 ml-4">{{item.totalCount}}</div>
              <div class="flex1">{{item.totalAmount}}</div>
              <div class="flex1 tc">{{item.totalPrice}}</div>
            </div>
            {{size===3?'&nbsp;':''}}
          </template>
        </ScrollMore>
      </template>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'records',
  components: {},
  props: {
    symbol: {
      type: String,
      default: '',
    },
    unit: Number,
  },
  data() {
    return {
      tradeType: '1',
      statusBarHeight: window.plus
        ? plus.navigator.getStatusbarHeight() + 10 + 'px'
        : '30px',
      showDatePicker: false,
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
      timeStr: 'startTime',
      startTime: '',
      endTime: '',
      size: this.symbol ? 3 : 20,
      params: {
        symbol: this.symbol || this.$route.params.symbol,
        unit: this.unit || this.$route.params.unit,
        startTime: null,
        endTime: null,
      },
    }
  },
  watch: {
    symbol(symbol) {
      this.params.symbol = symbol
      this.$refs.ScrollMore.reLoad(true)
    },
    unit(unit) {
      this.params.unit = unit
      this.$refs.ScrollMore.reLoad(true)
    },
  },
  methods: {
    search() {
      this.params.startTime = this.startTime
        ? this.startTime + ' 00:00:00'
        : null
      this.params.endTime = this.endTime
        ? dayjs(
            new Date(this.endTime + ' 00:00:00').getTime() + 3600000 * 24
          ).format('YYYY-MM-DD HH:mm:ss')
        : null
      this.$refs.ScrollMore.reLoad()
    },
    dateConfirm(date) {
      this[this.timeStr] = dayjs(date).format('YYYY-MM-DD')
      this.showDatePicker = false
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
  },
}
</script>

<style scoped lang="scss">
.back-padding {
  padding: 0 40px;
}
.back-icon {
  position: absolute;
  left: 16px;
  height: 30px;
  font-size: 20px;
}
</style>