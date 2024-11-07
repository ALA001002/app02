<template>
  <div class="setting">
  <!-- 设置 -->
    <div class="section">
      <p class="is-size-6 has-text-white py-4"> {{$t('order.setting')}} </p>
      <div class="is-flex-center" style="background:rgba(0,0,0,.2);order-radius:10px; padding: 10px 15px">
        <span class="tag " :class="form.tradeType == '1' ? 'is-primary' : 'is-danger'">
          {{form.tradeType == '1' ? $t('exchange.long') : $t('exchange.short')}}
        </span>
        <span class="is-size-6 ml-2">{{form.contractMultiple}}X</span>
        <div class="is-grow has-text-centered">
          <p>{{form.amount || form.money}}</p>
          <small>{{$t('exchange.margin')}}</small>
        </div>
        <div class="has-text-right">
          <p>{{data.price}}</p>
          <small>{{$t('exchange.price')}}</small>
        </div>
      </div>
    </div>
    <!-- 止盈 -->
    <van-field :label="$t('order.stopSurplus')">
      <template #input>
        <div class="is-flex-center" style="width:100%">
          <van-switch v-model="switchSurplus" inactive-color="rgba(255,255,255,.2)" size="16" />
          <span v-show="switchSurplus" class="has-text-link" @click="isSurplusRate=!isSurplusRate, stopSurplus = null">
            <i class="icon icon-qiehuan" />
            {{$t('order.' + (isSurplusRate ? 'rate1' : 'rate2'))}}
          </span>
        </div>
      </template>
    </van-field>
    <van-field v-show="switchSurplus" v-model="stopSurplus" type="number" class="is-border py-1">
      <template #right-icon>
        <span v-show="isSurplusRate" class="mr-2 has-text-white">%</span>
      </template>
    </van-field>
    <!-- 按比例百分比 -->
    <div v-show="isSurplusRate" class="buttons has-addons is-flex-center">
      <div
        v-for="item in surplusRates"
        class="button is-small is-grow mb-0"
        :class="{'is-info is-selected': item.id == stopSurplus}"
        :key="item.id"
        @click="stopSurplus = item.id"
      >
        {{ item.name }}
      </div>
    </div>
    <div v-show="switchSurplus" class="px-4 is-size-7">
      <span v-if="expectedProfit">{{expectedProfit}}</span>
      <span v-else class="has-text-danger">{{$t('order.expectedProfitError'+form.tradeType, { price: data.price })}}</span>
    </div>
    <!-- 止损 -->
    <van-field :label="$t('order.stopLoss')" class="pt-1">
      <template #input>
        <div class="is-flex-center" style="width:100%">
          <van-switch v-model="switchLoss" inactive-color="rgba(255,255,255,.2)" size="16" />
          <span v-show="switchLoss" class="has-text-link" @click="isLossRate=!isLossRate, stopLoss = null">
            <i class="icon icon-qiehuan" />
            {{$t('order.' + (isLossRate ? 'rate1' : 'rate2'))}}
          </span>
        </div>
      </template>
    </van-field>
    <van-field v-show="switchLoss" v-model="stopLoss" type="number" class="is-border py-1">
      <template #right-icon>
        <span v-show="isLossRate" class="mr-2 has-text-white">%</span>
      </template>
    </van-field>
    <!-- 按比例百分比 -->
    <div v-show="isLossRate" class="buttons has-addons is-flex-center">
      <div
        v-for="item in lossRates"
        class="button is-small is-grow mb-0"
        :class="{'is-info is-selected': item.id == stopLoss}"
        :key="item.id"
        @click="stopLoss = item.id"
      >
        {{ item.name }}
      </div>
    </div>
    <div v-show="switchLoss" class="px-4 is-size-7">
      <span v-if="expectedLoss">{{expectedLoss}}</span>
      <span v-else class="has-text-danger">{{$t('order.expectedLossError'+form.tradeType, { price: data.price })}}</span>
    </div>
    <div style="padding: 16px">
      <van-button block type="info" @click="sub">
        {{$t('app.ok')}}
      </van-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    form: {
      type: Object,
      required: true
    },
    stopInfo: {
      type: Object,
      default: () => { return {} }
    }
  },
  data() {
    return {
      isSurplusRate: false,
      isLossRate: false,
      surplusRates: [
        { id: 10, name: '10%' },
        { id: 20, name: '20%' },
        { id: 50, name: '50%' },
        { id: 100, name: '100%' },
        { id: 150, name: '150%' },
        { id: 200, name: '200%' }
      ],
      lossRates: [
        { id: 10, name: '10%' },
        { id: 20, name: '20%' },
        { id: 50, name: '50%' },
        { id: 70, name: '70%' },
        { id: 90, name: '90%' }
      ],
      stopLoss: null,
      stopSurplus: null,
      switchSurplus: false,
      switchLoss: false
    }
  },
  computed: {
    total() {
      return (this.form.amount || this.form.money) * this.form.contractMultiple
    },
    expectedProfit() {
      var value = this.isSurplusRate 
        ? this.profitByValue(((this.form.tradeType=='1' ? this.stopSurplus : -this.stopSurplus) / 100) * (this.form.amount || this.form.money))
        : this.stopSurplus
      var profit = this.profit(value)
      var tip = this.isSurplusRate 
        ? this.$t('order.expectedSurplusPrice', { price: this.toNumber(value) }) + ' ' + this.$t('order.expectedProfit', { profit })
        : this.$t('order.expectedProfit', { profit })
      return profit > 0
        ? tip
        : null
    },
    expectedLoss() {
      var value = this.isLossRate 
        ? this.profitByValue(((this.form.tradeType=='1' ? -this.stopLoss : this.stopLoss) / 100) * (this.form.amount || this.form.money))
        : this.stopLoss
      var profit = this.profit(value)
      var tip = this.isLossRate 
        ? this.$t('order.expectedLossPrice', { price: this.toNumber(value) }) + ' ' + this.$t('order.expectedLoss', { profit: -profit })
        : this.$t('order.expectedLoss', { profit: -profit })
      return profit < 0
        ? tip
        : null
    }
  },
  watch: {
    stopInfo: {
      handler: function(val) {
        this.isSurplusRate = val.stopSurplusType == 2
        this.isLossRate = val.stopLossType == 2
        this.$nextTick(() => {
          if (val.stopSurplus != this.stopSurplus) {
            this.stopSurplus = val.stopSurplus
            this.switchSurplus = !!val.stopSurplus
          }
          if (val.stopLoss != this.stopLoss) {
            this.stopLoss = val.stopLoss
            this.switchLoss = !!val.stopLoss
          }
        })
      },
      immediate: true
    }
  },
  methods: {
    sub() {
      var form = {
        stopSurplusType: this.isSurplusRate ? 2 : 1,
        stopLossType: this.isLossRate ? 2 : 1,
        stopLoss: null,
        stopSurplus: null
      }
      if (this.switchSurplus) {
        form.stopSurplus = this.stopSurplus
      }
      if (this.switchLoss) {
        form.stopLoss = this.stopLoss
      }
      this.$emit('sub', form)
    },
    profit(stopSurplusValue) {
      if (!stopSurplusValue) return 0
      var profit = this.toNumber(this.total * stopSurplusValue / this.data.price - this.total, 4)
      return this.form.tradeType=='1'?profit:-profit
    },
    profitByValue(val) {
      return this.toNumber((val + this.total) * this.data.price / this.total)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
::v-deep .is-border >* {
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-width: 1px;
  line-height: 36px;
}
.setting {
  background-color: #1A2D50;
  font-size: 16px;
  p { margin: 7px 0; }
  small { color: rgba(255, 255, 255, 0.5); }
  .tag {
    border-radius:2px;
  }
  ::v-deep {
    .van-field__label{color:white} 
    .van-field::after{border-bottom: 0}
    .van-field {
      background-color: transparent;
    }
    .van-field__control {
      text-align: center;
    }
    input {padding: 0 15px; color:white}
  }
}
.buttons{
  padding: 0 16px;
  margin: 5px 0;
  .button:not(.is-selected) {
    background: transparent;
    border-color: rgba(255, 255, 255, 0.5);
    color: white;
  }
}
</style>
