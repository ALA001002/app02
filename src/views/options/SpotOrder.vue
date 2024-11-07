<template>
  <div>
    <BackPanel style="background: var(--bg-color)" :title="$t('spot.spotOrder')">
      <template slot="right">
        <img src="@/assets/images/spot/filter.png" style="width:20px;" @click="showOrHidde()"/>
      </template>
    </BackPanel>
    <div class="spot_orders">
      <van-tabs v-model="activeTab" class="tabs-styles" @change="changeTab">
        <van-tab :title="$t('exchange.currentOrders')" name="0">
        </van-tab>
        <van-tab :title="$t('exchange.historys')" name="1">
        </van-tab>
        <van-tab :title="$t('exchange.dealOrders')" name="2">
        </van-tab>
      </van-tabs>
      <div style="text-align: center;margin-top: 20px;" v-if="!orders || orders.length===0">
        {{ $t('exchange.noData') }}
      </div>
      <div style="width: 100%;display: flex;flex-direction: column;">
        <template v-for="(item,index) in orders">
          <RunningOrder :item="item" @updateOrder="upDateOrder()" v-bind:key="index+'_item'" v-if="activeTab==0"/>
          <div v-bind:key="index+'_item'" class="order-item" v-if="activeTab==1">
            <div class="header line">
              <span>{{item.baseCoin}}/{{item.quoteCoin}}</span>
              <span class="time">{{ item.createTime }}</span>
            </div>
            <div class="desc line">
                <span class="order-type">
                  {{ item.orderType == 'MARKET' ? $t('exchange.marketType') : $t('exchange.limitType') }}/{{ item.side == 'SELL' ? $t('exchange.sent') : $t('exchange.buy') }}
                </span>
              <span>
                  {{ getTradeStatus(item) }}
                </span>
            </div>
            <div class="num flex line">
              <span class="order-title">{{ $t('exchange.orderNum') }}</span>
              <span class="value">
                  <span class="execute">{{ item.executedQty }}</span><span class="total">/{{ item.origQty }}</span>
                </span>
            </div>
            <div class="num flex line">
              <span class="order-title">{{ $t('exchange.price') }}</span>
              <span class="value">
                  <span class="execute">{{ item.executedPrice }}</span><span
                  class="total">/{{ item.orderType == 'MARKET' ? $t('exchange.marketType') : item.price }}</span>
                </span>
            </div>
          </div>
          <div v-bind:key="index+'_item'" class="order-item" v-if="activeTab==2">
            <div class="header line">
              <span>{{item.baseCoin}}/{{item.quoteCoin}}</span>
              <span class="time">{{ item.createTime }}</span>
            </div>
            <div class="desc line">
                <span class="order-type">
                  {{ item.orderType == 'MARKET' ? $t('exchange.marketType') : $t('exchange.limitType') }}/{{ item.side == 'SELL' ? $t('exchange.sent') : $t('exchange.buy') }}
                </span>
              <span>
                  {{ getTradeStatus(item) }}
                </span>
            </div>
            <div class="num flex line">
              <span class="order-title">{{ $t('exchange.orderNum') }}</span>
              <span class="value">
                  <span class="execute">{{ item.executedQty }}</span><span class="total">/{{ item.origQty }}</span>
                </span>
            </div>
            <div class="num flex line">
              <span class="order-title">{{ $t('exchange.price') }}</span>
              <span class="value">
                  <span class="execute">{{ item.executedPrice }}</span><span
                  class="total">/{{ item.orderType == 'MARKET' ? $t('exchange.marketType') : item.price }}</span>
                </span>
            </div>
          </div>
        </template>
      </div>
    </div>

    <van-action-sheet v-model="showFilter" :title="$t('spot.filter')">
      <div class="filter-date">
        <p class="desc-title">{{ $t('spot.date') }}</p>
        <div class="time-info">
          <span class="time-value" @click="showTimeAction(0)">
           {{selectDate.startTime ||'-' }}
          </span>
          <span class="center">{{ $t('spot.to') }}</span>
          <span class="time-value"  @click="showTimeAction(1)">
            {{selectDate.endTime || '-'}}
          </span>
        </div>
<!--        <div class="filter-tags">-->
<!--          <span @click="()=>choose(index)" :class="`filter-tag ${filterInfo.tagIndex==index?'active':''}`"-->
<!--                v-for="(item,index) in tags" v-bind:key="index+'-tag'">-->
<!--            {{ item }}-->
<!--          </span>-->
<!--        </div>-->
        <div class="symbols">
          <p class="desc-title">{{ $t('spot.symbol') }}</p>
          <div class="symbol-select" @click="showSymbolPicker=true">
            {{this.selectOption.text||$t('spot.total')}}
          </div>
        </div>
        <div class="direction">
          <p class="desc-title">{{ $t('spot.direction') }}</p>
          <div class="symbol-select">
            <span @click="chooseFilterType(0)" :class="`${filterInfo.tradeType[0]==1?'active':''}`"><van-icon
                name="checked"/>{{ $t('spot.buy') }}</span>
            <span @click="chooseFilterType(1)" :class="`${filterInfo.tradeType[1]==1?'active':''}`"><van-icon
                name="checked"/>{{ $t('spot.sell') }}</span>
          </div>
        </div>
        <div style="margin-top: 10px" class="spot-btns">
          <div class="btn bg-primary" @click="reset()">{{ $t('spot.reset') }}</div>
          <div class="btn" @click="query();showFilter=false">{{ $t('spot.finish') }}</div>
        </div>
      </div>
    </van-action-sheet>
    <van-popup
        style="width: 100%"
        v-model="showTime"
    >
      <DatetimePicker
          @confirm="confirm()"
          v-model="chooseTime"
          type="date"
          :title="$t('spot.chooseTime')"
      />
    </van-popup>
    <van-popup v-model="showSymbolPicker" round position="bottom">
      <van-picker
          :show-toolbar="true"
          toolbar-position="top"
          :columns="symbols"
          @cancel="showSymbolPicker = false"
          @confirm="(val)=>{this.selectOption=val;this.showSymbolPicker=false}"
      />
    </van-popup>
  </div>
</template>
<script>
import {Toast, DatetimePicker} from 'vant'
import BackPanel from '@/components/layout/BackPanel.vue'
import RunningOrder from '@/components/orderItem/RunningOrder.vue'
import {formatter} from '@/utils/time'
import dayjs from 'dayjs'

export default {
  name: 'spot_orders',
  components: {RunningOrder, BackPanel, DatetimePicker},
  data() {
    return {
      showSymbolPicker:false,
      tags: [this.$t('spot.1day'), this.$t('spot.1week')],
      showTime: false,
      chooseTime:null,
      symbols: [],
      selectOption:{value:-1},
      timeType:0,
      filterInfo: {
        tagIndex: 0,
        tradeType: [1, 1]
      },
      selectDate: {
        symbol:null,
        startTime:null,
        endTime:null
      },
      showFilter: false,
      orders: [],
      activeTab: 0
    }
  },
  mounted() {
    const now = dayjs()
    this.chooseTime = now
    this.selectDate.startTime = formatter(now)
    this.selectDate.endTime = formatter(now)
    this.query()
    this.updateData()
  },
  watch:{
    chooseTime(val){
      if(this.timeType==0){
        this.selectDate.startTime = formatter(val)
      }else{
        this.selectDate.endTime = formatter(val)
      }
    }
  },
  methods: {
    upDateOrder(){
      self.query()
    },
    confirm(){
      this.showTime =false
    },
    showTimeAction(type) {
      this.timeType = type
      this.showTime = true
    },
    reset(){
      this.selectDate={}
    },
    updateData() {
      const self = this
      this.$http.create_api
          .get('common/hqInfo')
          .then((data) => {
            const contractInfo = data.data.contractInfo
            const symbolDatas = []
            symbolDatas.push({value:-1,text:this.$t('spot.total')})
            contractInfo.forEach((e,index) => {
              symbolDatas.push({value:index,text:e.symbolCode.toUpperCase()})
            })
            self.symbols = symbolDatas
          })
          .catch(() => {
          })
    },
    showOrHidde() {
      this.showFilter = true
    },
    choose(index) {
      this.filterInfo.tagIndex = index
    },
    // invoke(orderId) {
    //   const self = this
    //   this.$http.create_api.post('/ico/revoke', {orderIds: [orderId]}).then(() => {
    //     Toast.success()
    //     self.query()
    //   })
    // },
    chooseFilterType(index) {
      this.filterInfo.tradeType[index] = !this.filterInfo.tradeType[index]
      this.filterInfo.tradeType = [...this.filterInfo.tradeType]
    },
    changeTab(val) {
      this.activeTab = val
      this.query()
    },
    getTradeStatus(item) {
      if(item.status=='NEW') {
        return this.$t('spot.running')
      }
      if(item.status=='FILLED') {
        return this.$t('spot.fullTrade')
      }
      if(item.status=='CANCELED') {
        return this.$t('spot.cancelled')
      }
      if (item.origQty == item.executedQty) {
        return this.$t('spot.fullTrade')
      }
    },
    cancelOrder(orderId) {
      this.$http.create_api.post('/ico/revoke', {orderIds: [orderId]}).then(
          () => {
            Toast.success()
            self.updateAccountInfo()
          }
      )
    },
    // newQuery() {
    //   const self = this
    //   const params = {
    //     symbol:this.selectDate.text,
    //     // side:'BUY',
    //     // status: ['NEW', 'FILLED', 'CANCELED'][this.activeTab]
    //   }
    //   if(this.selectDate.startTime){
    //     params.startTime = `${this.selectDate.startTime} 00:00:00`
    //   }
    //   if(this.selectDate.endTime){
    //     params.endTime = `${this.selectDate.endTime} 23:59:59`
    //   }
    //   this.$http.post('/ico/newOrders', params).then((data) => {
    //     // console.log(data)
    //     self.orders = data
    //   })
    // },
    query() {
      const self = this
      const params = {
          symbol:this.selectDate.text
      }
      if(this.activeTab==2){
        params.status='FILLED'
      }
      if(this.filterInfo.tradeType[0]!=1 || this.filterInfo.tradeType[1]!=1){
        if(this.filterInfo.tradeType[0]==1){
          params.side='BUY'
        }
        if(this.filterInfo.tradeType[1]==1){
          params.side='SELL'
        }
      }
      const url = this.activeTab==0?'/ico/newOrders':'/ico/tradeOrders'
      if(this.selectDate.startTime){
        params.startTime = `${this.selectDate.startTime} 00:00:00`
      }
      if(this.selectDate.endTime){
        params.endTime = `${this.selectDate.endTime} 23:59:59`
      }
      this.$http.post(url, params).then((data) => {
        // console.log(data)
        self.orders = data
      })
    }
  }
}
</script>
<style lang="scss">
* {
  touch-action: pan-y;
}

.desc-title {
  color: rgba(255, 255, 255, 0.3);
}

.spot-btns {
  display: flex;
  flex-direction: row;

  div {
    flex: 1;
    margin: 0 20px;
    text-align: center;
    padding: 10px;
    border-radius: 10px;

    &:last-child {
      background: var(--main-text-color-white);
    }
  }
}

.symbol-select {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  > span {
    margin-right: 5px;
    text-align: center;

    i {
      margin-right: 5px;
    }

    &.active {
      color: #f2a603;
    }

    &:last-child {
      margin-left: 100px;
    }
  }
}

.filter-date {
  margin-bottom: 20px;
  height: 300px;
  padding: 10px;
  box-sizing: border-box;

  .time-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;

    .center {
      padding: 0 5px;
    }

    .time-value {
      color: white;
      font-size: 20px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      padding: 5px;
    }
  }

  .filter-tags {
    margin-top: 20px;

    .filter-tag {
      border-radius: 5px;
      margin-right: 10px;
      background: rgba(255, 255, 255, 0.2);
      padding: 5px;
      color: rgba(255, 255, 255, 0.3);

      &.active {
        color: white;
      }
    }
  }
}

.tabs-styles {
  border-bottom: 1px solid rgba(221, 221, 221, 0.24);
}

.line {
  margin-bottom: 5px;
}

.order-item-col {
  display: flex;
  flex-direction: row;

  .col {
    margin-right: 10px;
    flex: 1.5;
    display: flex;
    flex-direction: column;
    align-items: center;

    &.content {
      flex: 2;

      .line {
        width: 100%;
      }
    }

    .order-type {
      color: var(--color-green);
    }

    .flex {
      display: flex;
      justify-content: space-between;
    }
  }

  .num {
    font-size: 12px;

    .order-title {
      color: var(--text-mid);
    }

    .value {
      .total {
        color: var(--text-mid);
      }

      .execute {
        color: var(--text-deep);
      }
    }
  }
}

.spot_orders {
  padding: 20px;

  .order-item {
    margin-top: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid rgba(221, 221, 221, 0.24);

    .flex {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }

    .header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .title {
        color: var(--text-deep);
        font-size: 12px;
        font-width: bold;
      }

      .time {
        color: var(--text-mid);
      }
    }

    .desc {
      color: var(--color-green);
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .order-type {

      }
    }

    .num {
      font-size: 12px;

      .order-title {
        color: var(--text-mid);
      }

      .value {
        .total {
          color: var(--text-mid);
        }

        .execute {
          color: var(--text-deep);
        }
      }
    }
  }
}

.van-nav-bar {
  background: var(--bg-color);
}
</style>
