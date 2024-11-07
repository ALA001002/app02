<template>
  <div class="content-view">
<!--    <div class="headers ">-->
<!--      <div class="tabs">-->
<!--        <span @click="()=>changeTab(0)" :class="activeIndex==0?'active':''">{{ $t("timecontract.line") }}</span>-->
<!--        <span @click="()=>changeTab(1)" :class="activeIndex==1?'active':''">{{ $t("timecontract.exchange") }}</span>-->
<!--      </div>-->
<!--    </div>-->
    <div class="symbol-list">
      <img src="@/assets/images/contract/menu.png"/>
      <span>BTCUSDT</span>
      <span class="percent-data">{{ dataPercent }}%</span>
    </div>
    <div class="flex-data">
      <div class="flex flex-left">
        <div class="tabs">
            <span @click="()=>changeOpenIndex(0)" :class="openIndex==0?'active':''">{{
                $t("timecontract.openmore")
              }}</span>
          <span @click="()=>changeOpenIndex(1)" :class="openIndex==1?'active':''">{{
              $t("timecontract.openempty")
            }}</span>
        </div>
        <div class="account-data">USDT&nbsp;{{ $t("timecontract.account") }}</div>
        <div class="full-handling">{{ $t("timecontract.full-handling-fee") }}：{{ fee }}%</div>
        <div class="accept-profit">
          <div v-for="(item,key) in profits" v-bind:key="key"
               :class="(profitIndex===key?'data-item active':'data-item')+(openIndex===0?' green':' red')"
               @click="()=>changeProfitIndex(key)">
            <span class="period">{{ item.period }}s</span>
            <span class="profit">{{ $t("timecontract.profit") }}{{ item.profit }}%</span>
          </div>
        </div>
        <div class="flex-between-data">
<!--          <span>{{ $t("timecontract.principal") }}</span>-->
          <span>{{ $t("timecontract.canUse") }}USDT</span>
        </div>
        <div class="input-value">
          <input :placeholder="$t('timecontract.pleaseInput')"/>
          <span class="total-btn">{{ $t("timecontract.totalBtn") }}</span>
        </div>
        <div class="estimatedTransactionPrice">{{ $t("timecontract.estimatedTransactionPrice") }}：{{ price }}</div>
        <div :class="openIndex===0?'action-btn more':'action-btn empty'">
          <span>{{ $t("timecontract.openMoreBtn") }}</span>
        </div>
      </div>
      <div class="flex flex-right">
        <div class="data-info-per">
          <span>{{ $t("timecontract.fundingRate") }}/{{ $t("timecontract.settlementTime") }}</span>
          <span>-0.0043% / 09:00:44</span>
        </div>
        <div class="item-list">
          <span>
            <p>{{ $t("price") }}</p>
            <p>(USDT)</p>
          </span>
          <span>
            <p>{{ $t("amount") }}</p>
            <p>(BIT)</p>
          </span>
        </div>
        <ul class="data-item-price">
          <li class="flex" v-for="(item,index) in list1" v-bind:key="'list1-'+index">
            <span class="red">{{ item.price }}</span>
            <span>{{ item.amount }}</span>
          </li>
        </ul>
        <p style="color:#28AB5D">1.263</p>
        <p style="color:#F5A600"><img style="width: 0.5rem;height: 0.5rem;vertical-align: middle;"
                                      src="@/assets/images/contract/flag.png"/> 1.263</p>
        <ul class="data-item-price">
          <li class="flex" v-for="(item,index) in list2" v-bind:key="'list2-'+index">
            <span class="green">{{ item.price }}</span>
            <span>{{ item.amount }}</span>
          </li>
        </ul>
        <div class="action-list-select">
          <div>0.0001<img src="@/assets/images/contract/arrow.png"/></div>
          <div><img class="icon-img" src="@/assets/images/contract/line.png"/><img
              src="@/assets/images/contract/arrow.png"/></div>
        </div>
      </div>
    </div>
    <div class="historys flex">
      <div class="tabs">
          <span @click="()=>changeHistoryIndex(0)" :class="historyIndex==0?'active':''">{{
              $t("timecontract.current")
            }}</span>
        <span @click="()=>changeHistoryIndex(1)" :class="historyIndex==1?'active':''">{{
            $t("timecontract.history")
          }}</span>
      </div>
      <span :class="activeIndex===0?'more':'empty'" @click="()=>{$router.push('/timecontract/order')}">{{$t("timecontract.more")}}</span>
    </div>
    <div class="order-list-item">
      <OrderItem v-for="item in historys" :key="item.id" :data="item" :base="sup" :shareLink="shareLink" />
    </div>
  </div>
</template>

<script>
import OrderItem from '@/components/timecontract/OrderItem.vue'
// import QrScan from '@/components/QrScan.vue'
import {get} from 'vuex-pathify'

export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  components: {OrderItem},
  computed: {
    wallet: get('user/wallet'),
    accounts() {
      return this.wallet.map(p => {
        p.name = p.currency + ' ' + (p.virtual === 1 ? this.$t('exchange.imitate') : this.$t('exchange.account'))
        return p
      })
    },
    account() {
      if (this.accounts.length > 0) {
        return this.accounts[this.accountIndex]
      }
      return {}
    }
  },
  data() {
    return {
      shareLink: null,
      sup: this,
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
      openIndex: 0,
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
        }]
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

  methods: {
    load() {
      this.form.amount = null
      this.form.mul = null
    },
    changeTab(index) {
      this.activeIndex = index
    },
    changeOpenIndex(index) {
      this.openIndex = index
    },
    changeProfitIndex(index) {
      this.profitIndex = index
    },
    changeHistoryIndex(index) {
      this.historyIndex = index
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.historys {
  margin-top: 2.3125rem;
  justify-content: space-between;

  .tabs {
    width: 12.5rem;
    font-size: 0.9375rem;
  }

  .more {
    color: #F5A600;
    font-size: 0.8125rem;
  }
}

.action-list-select {
  display: flex;
  flex-direction: row;
  margin-top: 0.5rem;

  > div {
    height: 1.75rem;
    line-height: 1.75rem;
    background-color: #1D1C21;
    border-radius: 4px;
    box-sizing: border-box;
    padding: 0 5px;

    &:last-child {
      margin-left: 0.875rem;
    }

    img:last-child {
      vertical-align: middle;
      width: 0.6875rem;
      height: 0.6875rem;
      margin-left: 0.2rem;
    }

    .icon-img {
      height: 0.71875rem;
      vertical-align: middle;
    }
  }
}

.flex-right {
  .data-info-per {
    display: flex;
    flex-direction: column;
    color: #87868B;
    font-size: 10px;
    text-align: right;
  }

  margin-left: 0.4rem;

  .item-list {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 12px;
    color: #87868B;

    p {
      padding: 0;
      margin: 0;
    }
  }

  .data-item-price {
    font-size: 0.75rem;

    li {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      height: 1.25rem;
      line-height: 1.25rem;

      .green {
        color: green;
      }

      .red {
        color: red;
      }
    }

  }
}

.action-btn {
  background-color: #28AB5D;
  color: white;
  font-size: 1.065rem;
  height: 2.5rem;
  line-height: 2.5rem;
  text-align: center;
  border-radius: 4px;

  &.empty {
    background-color: #FB4C53;
  }
}

.estimatedTransactionPrice {
  font-size: 0.75rem;
  color: #B2B1B6;
  text-align: right;
  margin: 12px 0 13px 0;
}

.symbol-list {
  margin-top: 1.28rem;
  font-size: 1.0625rem;
  display: table;

  img {
    vertical-align: super;
    height: 0.46875rem;
    margin-right: 8px;
  }

  .percent-data {
    color: #2BAD5F;
    margin-left: 4px;
  }
}

.accept-profit {
  display: flex;
  flex-wrap: wrap;

  .data-item {
    &.active {
      &.green {
        background-color: #28AD5E;
      }

      &.red {
        background-color: #FB4C53;
      }
    }

    color: white;
    width: 5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    background-color: #1D1C21;
    padding: 0.5rem 0;
    border-radius: 4px;

    &:nth-child(2n) {
      margin-left: 0.625rem;
    }

    &:nth-child(n+3) {
      margin-top: 0.625rem;
    }

    span {
      text-align: center;
    }

    .period {
      font-size: 1.065rem;
    }

    &.active {
      background-color: #FB4C53;
    }
  }
}

.headers {
  margin-top: 2.5rem;
}

.content-view {
  box-sizing: border-box;
  padding: 0 4.5%;
}

.full-handling {
  margin: 6px 0 10px 0;
}

.flex-between-data {
  margin: 10px 0 4px 0;
  display: flex;
  justify-content: space-between;

  :first-child {
    color: #DBD9DF;
    font-size: 0.875rem;
  }

  :nth-child(2) {
    color: #B2B1B6;
    font-size: 0.75rem;
  }
}

.input-value {
  height: 3rem;
  line-height: 3rem;
  display: flex;
  justify-content: space-between;
  align-content: space-around;
  background-color: #1D1C21;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 0 10px;

  .total-btn {
    color: #F5A600;
    font-size: 1rem;
    width: 3rem;
  }
}

.tabs {
  background-color: #1D1C21;
  color: #87868B;
  font-size: 0.90625rem;
  height: 1.8125rem;
  display: flex;
  flex-direction: row;
  width: 100%;
  line-height: 1.8125rem;
  border-radius: 4px;

  span {
    overflow: hidden;
    flex: 1;
    text-overflow: ellipsis;
    text-align: center;
  }

  span.active {
    background-color: #44424D;
    color: #DBD9DF;
  }
}

.full-handling {
  margin-top: 6px;
  color: #B2B1B6;
  font-size: 0.75rem;
}

.headers {
  width: 100%;
  margin: 1.25rem auto 0 auto;
  display: flex;

  span {
    flex: 1;
    font-size: 0.9375rem;
  }
}

.flex-data {
  display: flex;
  flex-direction: row;
  margin-top: 0.96875rem;

  .flex {
    &.flex-left {
      flex: 6;
    }

    flex: 4;
    display: block;

    .account-data {
      width: 100%;
      height: 2.25rem;
      line-height: 2.25rem;
      color: white;
      text-align: left;
      border-radius: 4px;
      background-color: #1D1C21;
      text-indent: 10px;
      margin-top: 12px;
    }
  }
}

.flex-between {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
