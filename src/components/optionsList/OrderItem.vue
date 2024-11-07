<template>
  <router-link tag="div" class="has-background-white mt-1 has-text-grey" style="font-family:PingFangSC-Regular,PingFang SC;" to="">
    <div class="section is-flex-center van-hairline--bottom">
      <span>{{ parseTime(data.buyTime, '{m}-{d} {h}:{i}') }}</span>
      <span v-copy>{{ data.orderNo }} <i class="icon icon-fuzhi"/></span>
    </div>
    <div class="section">
      <div class="mb-2 has-text-dark is-flex-center">
        <div class="is-grow">
          <span :style="{color: data.tradeType == '1' ? '#2DBC8C' : '#EB616E'}">
            {{ data.tradeType == '1' ? $t('exchange.long') : $t('exchange.short') }}
          </span>
          <strong> {{ data.symbolName }} </strong>
        </div>
        <div>{{remainTime}}{{ data.period }}s</div>
      </div>
      <div class="mb-2">
        {{ (data.status > 0 ? $t('order.profit') : $t('order.nProfit'))  + '(' + data.currency }}):
        <TextFormat :text="profit" :float="profit"/>
        (<TextFormat :text="profitChange" :float="profit" isFormat/>)
      </div>
      <div class="columns is-mobile mt-0 mb-1">
        <div class="column">
          <p>{{$t('order.buyPrice')}}</p>
          <p class="title is-6">{{data.buyPrice}}</p>
        </div>
        <div class="column">
          <p>{{data.status > 0 ? $t('order.sellPrice') : $t('order.nowPrice')}}</p>
          <p class="title is-6">{{data.status > 0 ? data.settlementPrice : hqData.price}}</p>
        </div>
      </div>
      <!-- 杂项 -->
      <div class="columns is-mobile is-small mt-0 mb-1">
        <div class="column">
          <p class="is-flex-center">
            <span class="is-grow">{{$t('order.money')}}</span>
            <span class="is-grow">{{data.money}}</span>
          </p>
          <p v-if="data.status>0" class="is-flex-center">
            <span class="is-grow">{{$t('order.settleTime')}}</span>
            <span class="is-grow">{{parseTime(data.settlementTime, '{m}-{d} {h}:{i}')}}</span>
          </p>
        </div>
        <div class="column">
          <p class="is-flex-center">
            <span class="is-grow">{{$t('order.fee')}}</span>
            <span class="is-grow">{{data.fee}}</span>
          </p>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
import TextFormat from '@/components/TextFormat.vue'
import { Toast, Dialog } from 'vant'
import { get } from 'vuex-pathify'
import { parseTime } from '@/utils/helper'
import saveImg from '@/utils/saveImg'

export default {
  props: {
    data: Object,
    base: Object,
    shareLink: String
  },
  data() {
    return {
      showSet: false,
      showShare: false,
      showReplenish: false,
      stopInfo: {},
      shareOptions: [
        { name: this.$t('invite.saveImage'), icon: 'poster' }
      ]
    }
  },
  components: { TextFormat },
  computed: {
    hqList: get('hq/hq'),
    user: get('user/info'),
    hqData: function() {
      return this.hqList.find(p => p.symbolCode == this.data.symbol)
    },
    total() {
      return this.data.money * this.data.contractMultiple
    },
    profit() {
      if (this.data.status > 0) {
        return this.data.profitType != 2 ? this.data.profit : -this.data.profit
      }
      var isWin = this.data.tradeType == '1' ? this.hqData.price > this.data.buyPrice : this.hqData.price < this.data.buyPrice
      return this.toNumber(this.data.money*(isWin?this.data.yieldRate:-1), 4)
    },
    profitChange() {
      return this.profit / this.data.money * 100
    },
    statusName() {
      return this.$t('order.profitType'+this.data.profitType)
    },
    remainTime() {
      return this.data.remainTime > 0 ? this.data.remainTime + '/' : ''
    },
    shareIndex() {
      if (this.profitChange > 50) {
        return '4'
      } else if (this.profitChange > 20) {
        return '3'
      } else if (this.profitChange > 10) {
        return '2'
      } else if (this.profitChange > 5) {
        return '1'
      } else if (this.profitChange < -50) {
        return '-5'
      } else if (this.profitChange < -20) {
        return '-4'
      } else if (this.profitChange < -10) {
        return '-3'
      } else if (this.profitChange < -5) {
        return '-2'
      } else if (this.profitChange < 0) {
        return '-1'
      } else {
        return '0'
      }
    }
  },
  watch: {
    showSet(val) {
      if (val) {
        this.stopInfo = Object.assign({}, this.data.stopInfo)
      }
    }
  },
  methods: {
    parseTime,
    close() {
      Dialog.confirm({ title: this.$t('order.confirmSell') }).then(() => {
        this.$http.post('contract/closeContract', {
          contractId: this.data.id
        }).then(() => {
          Toast.success()
          this.base.load()
        })
      })
    },
    setSub(form) {
      var f = Object.assign({}, form, { contractId: this.data.id })
      this.$http.post('contract/updateStopInfo', f).then(() => {
        this.showSet=false
        this.base.load()
        Toast.success()
      })
    },
    replenishSub(form) {
      var f = Object.assign({}, form, { contractId: this.data.id })
      this.$http.post('contract/replenishContract', f).then(() => {
        this.showReplenish=false
        this.base.load()
        Toast.success()
        // this.$refs.replenish.load()
      })
    },
    shareSelect() {
      saveImg(this.$refs.shareImg)
    }
  }
}
</script>
<style lang="scss" scoped>
p{margin-top: 0; margin-bottom: 5px;}
.column {padding-top: 0; padding-bottom: 0;}
.is-6 {font-size: 16px;}
.share-panel {
  font-family:PingFangSC-Medium,PingFang SC;
  font-size: 14px;
  color: #242424;
  height: 50vh;
  min-height: 500px;
  background-color: #E1ECFF;
  strong { font-size: 16px; }
  .tag {
    border-radius:2px;
  }
  .dq {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
  }
  .yk-image {
    height: 158px;
    width: 158px;
    padding: 4px;
    border: 1px dotted #377DFF;
    border-radius: 50%;
    img { width: 100%; height: 100%; }
  }
}
.share-content{
  background-color: #1A2D50;
  border-radius:10px 10px 0px 0px;
  font-size: 14px;
  line-height: 16px;
  text-align: left;
  color: white;
  padding: 10px 15px;
  img { height: 2rem; width: 2rem; }
}
.qr {
  height: 3.1rem;
  width: 3.1rem;
  overflow: hidden;
  img { height: 3.1rem; width: 3.1rem; }
}
.contract-set {
  background-color: white;
  ::v-deep {
    .has-text-white, .is-flex-center, .van-field__label, input {
      color: #242424 !important;
    }
    .section .is-flex-center {
      background:rgba(55,125,255,.1) !important;
    }
    .is-border >* {
      border-color: #aaaaaa !important;
    }
    small{
      color: #aaaaaa !important;
    }
    .button:not(.is-selected) {
      border-color: #aaaaaa !important;
      color: #242424 !important;
    }
  }
}
</style>
