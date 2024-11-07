<template>
  <div>
    <div class="order-item">
      <div class="header">
        <span class="time">{{ data.buyTime }}</span>
        <span>{{ data.orderNo }}</span>
        <img src="@/assets/images/contract/copy.png"/>
      </div>
      <div class="body">
        <div class="body-header">
            <span>
              <span class="green">{{ $t("timecontract.openmore") }}</span>
              <span class="symbol-icon">{{data}}</span>
            </span>
          <span>
              {{ data.period }}s
            </span>
        </div>
        <div class="urealize">
          <!--            <div>{{ $t("timecontract.unrealizedProfitAndLoss") }}（USDT）：{{ item.price }}（{{ item.yieldRate }}%）</div>-->
          {{ (item.status > 0 ? $t('order.profit') : $t('order.nProfit')) + '(' + data.currency }}):
          <TextFormat :text="profit" :float="profit"/>
          (
          <TextFormat :text="profitChange" :float="profitChange" isFormat/>
          )
        </div>
        <div class="content-info">
          <div class="left">
            <div class="item-title">{{ $t("timecontract.openPrice") }}</div>
            <div class="item-price">{{ data.buyPrice }}</div>
            <div class="item-title">{{ $t("timecontract.principal") }}</div>
            <div class="item-price">{{ data.money }}</div>
          </div>
          <div class="right">
            <div class="item-title">{{ $t("timecontract.currentPrice") }}</div>
            <div class="item-price">{{ hqData.price }}</div>
            <div class="item-title">{{ $t("timecontract.fee") }}</div>
            <div class="item-price">{{ data.fee }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import QrScan from '@/components/QrScan.vue'
import {get} from 'vuex-pathify'
import TextFormat from '@/components/TextFormat.vue'
export default {
  props: {
    data: Object,
    base: Object,
    shareLink: String
  },
  components: {TextFormat},
  computed: {
    wallet: get('user/wallet'),
    hqList: get('hq/hq'),
    hqData: function() {
      console.log(this.hqList)
      return this.hqList.find(p => p.symbolCode == this.data.symbol)
    },
    total() {
      return this.data.money// * this.data.contractMultiple
    },
    profit() {
      if (this.data.status > 0) {
        return this.data.profitType != 2 ? this.data.profit : -this.data.profit
      }
      console.log(this.hqData)
      var profit = this.toNumber(this.total * this.hqData.price / this.data.buyPrice - this.total, 4)
      return this.data.tradeType=='1'?profit:-profit
    },
    profitChange() {
      return this.profit / this.data.money * 100
    },
    statusName() {
      switch(this.data.status) {
        case 1: return this.$t('order.status1')
        case 2: return this.$t('order.status2')
        case 3: return this.$t('order.status3')
      }
      return ''
    }
  },
  data() {
    return {
      deepData: {asksList: [], bidsList: []},
      amount: '0',
      accountIndex: 0,
      profitIndex: 0,
      price: 44481.3,
      historys: [{
        date: '04-14 14:44',
        orderNo: 'TC20220424984938488480001',
        symbol: 'BTC/USDT',
        period: 180,
        price: -100,
        fee: -100,
        openPrice: -100,
        principal: -100,
        percent: -100
      }],
      dataPercent: '+1.875',
      activeIndex: 1,
      tradeType: '1',
      historyIndex: 0,
      fee: 0,
      profits: [
        {
          period: 180,
          profit: 20
        },
        {
          period: 360,
          profit: 30
        },
        {
          period: 720,
          profit: 40
        },
        {
          period: 1440,
          profit: 50
        }
      ],
      list1: [
        {
          price: 11,
          amount: 12,
          deep: 12,
        }, {
          price: 11,
          amount: 12,
          deep: 12,
        }, {
          price: 11,
          amount: 12,
          deep: 12,
        }, {
          price: 11,
          amount: 12,
          deep: 12,
        }, {
          price: 11,
          amount: 12,
          deep: 12,
        }],
      list2: [
        {
          price: 11,
          amount: 12,
          deep: 12,
        }, {
          price: 11,
          amount: 12,
          deep: 12,
        }, {
          price: 11,
          amount: 12,
          deep: 12,
        }, {
          price: 11,
          amount: 12,
          deep: 12,
        }, {
          price: 11,
          amount: 12,
          deep: 12,
        }],
      form: {
        currency: 'USDT',
        amount: 0,
        fee: null,
        period: null,
        tradeType: null,
        minMoney: 100,
        yieldRate: null,
        symbolCode: null
      },
      times: []
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
  mounted() {
    this.queryDeep()
    this.queryHistorys()
  },
  methods: {
  },
}
</script>
<style scoped lang="scss">
.order-list-item {
  margin-top: 0.8125rem;

  .order-item {
    background-color: #1D1C21;
    color: #D2D2D5;
    padding: 0.5rem;

    .body-header {
      margin-top: 0.625rem;
      display: flex;
      justify-content: space-between;

      .symbol-icon {
        margin-left: 4px;
      }
    }

    .header {
      display: flex;
      justify-content: space-between;
      padding: 0.5625rem 0;
      font-size: 0.6875rem;
      border-bottom: 1px solid #3E3D41;

      .time {
        color: #626262;
      }

      img {
        height: 1rem;
      }
    }

    .urealize {
      margin-top: 0.625rem;
    }

    .content-info {
      display: flex;
      flex-direction: row;
      justify-content: left;

      div {
        flex: 1;
        margin-top: 0.5rem;

        &.item-title {
          color: #D2D2D5;
          font-size: 0.675rem;
        }

        &.item-price {
          font-size: 1rem;
          color: white;
        }
      }
    }
  }
}
</style>
