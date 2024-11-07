<template>
  <div>
    <div class="is-flex-center tab-top">
      <van-tabs
        ref="tab"
        v-model="form.tradeType"
        :title-active-color="color"
        title-inactive-color="rgba(255, 255, 255, 0.5)"
        :lazy-render="true"
        :color="color"
        :line-width="'45%'"
        :line-height="2"
        class="is-grow"
        background="transparent"
      >
        <van-tab name="1" :title="$t('exchange.long')"/>
        <van-tab name="2" :title="$t('exchange.short')"/>
      </van-tabs>
      <div style="padding: 10px 0; width: 1px; background: #0B1424;"></div>
      <van-button class="has-text-weight-light is-none" icon="arrow-down" @click="downClick"></van-button>
    </div>
    <div class="section pt-0 has-text-weight-light">
      <div class="is-flex-center mt-3">
        <van-tabs v-model="form.trustType" :border="false" :color="color" title-active-color="#fff" class="tab-small" type="card" background="transparent">
          <van-tab name="0" :title="$t('exchange.marketPrice')"/>
          <van-tab name="1" :title="$t('exchange.trigger')"/>
        </van-tabs>
        <div class="is-flex-center has-text-white" @click="showAccount=true">
          <span class="mr-1">{{ account.name }}</span><van-icon name="arrow" />
        </div>
      </div>
      <div class="is-flex-center mt-3 is-border has-text-centered">
        <div class="title">{{$t('exchange.leverage')}}</div>
        <div
          v-for="item in data.multipleList"
          class="is-grow"
          :key="item"
          :style="form.contractMultiple == item?activeStyle:null"
          @click="form.contractMultiple = item"
        >
          {{ item }}X
        </div>
      </div>
      <div v-show="form.trustType == '1'" class="is-flex-center mt-3 is-border has-text-centered">
        <div class="title">{{$t('exchange.triggerPrice')}}</div>
        <input v-model="form.triggerPrice" class="is-grow input" type="number"/>
      </div>
      <div class="is-flex-center mt-3 is-border has-text-centered">
        <div class="title">{{$t('exchange.margin')}}</div>
        <input v-model="form.amount" class="is-grow input" type="number" @change="mul=null"/>
        <div
          v-for="item in muls"
          style="width: 42px"
          :key="item.id"
          :style="mul == item.id?activeStyle:null"
          @click="mul = item.id"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="is-flex-center mb-1 mt-2">
        <span>{{ $t('exchange.balance') }} {{ account.balance }} {{ account.currency }}</span>
        <span>
          <span v-help="$t('exchange.predictRemark')" class="mr-1">{{$t('exchange.predictPrice')}}</span>
          {{ predictPrice }}
        </span>
      </div>
      <!-- 高级设置 -->
      <div>
        <span class="has-text-link mr-2" @click="showSetting">{{$t('exchange.setting')}}</span>
        <span v-if="this.form.stopSurplus" class="mr-2">{{$t('order.stopSurplus')}} {{this.form.stopSurplusType == 1 ? this.form.stopSurplus : (this.form.stopSurplus + '%')}}</span>
        <span v-if="this.form.stopLoss">{{$t('order.stopLoss')}} {{this.form.stopLossType == 1 ? this.form.stopLoss : (this.form.stopLoss + '%')}}</span>
      </div>
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
    <!-- 设置 -->
    <van-popup v-model="showSet" position="bottom" safe-area-inset-bottom>
      <ContractSet ref="contractSet" :data="data" :stopInfo="stopInfo" :form="form" @sub="setSub"/>
    </van-popup>
  </div>
</template>

<script>
import { get } from 'vuex-pathify'
import { Toast } from 'vant'
import ContractSet from './ContractSet'
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  components: { ContractSet },
  data() {
    return {
      showSet: false,
      showAccount: false,
      accountIndex: 0,
      stopInfo: {},
      mul: null,
      muls: [
        { id: 0.1, name: '10%' },
        { id: 0.2, name: '20%' },
        { id: 0.5, name: '50%' },
        { id: 1, name: '100%' }
      ],
      form: {
        currency: null, // 账户币
        contractType: '0', // 0逐仓 1全仓
        amount: null, // 下单数量
        contractMultiple: 10, // 杠杆倍数
        tradeType: '1', // 1开多 2做空
        trustType: '0', // 0市价 1计划
        triggerPrice: null, // 委托触发价
        trustPrice: null // 委托成交价
      }
    }
  },
  computed: {
    wallet: get('user/wallet'),
    accounts() {
      return this.wallet.filter(p=>p.supNormalContract==1).map(p => {
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
    }
  },
  watch: {
    'data.multipleList': function(val) {
      if (val.length > 0 && !val.includes(this.form.contractMultiple)) {
        this.form.contractMultiple = val[0]
      }
    },
    mul(val) {
      if (val) {
        this.form.amount = this.toNumber(this.account.balance * val, 4)
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
    },
    'form.trustType': function() {
      if (!this.form.triggerPrice) {
        this.form.triggerPrice = this.data.price
      }
    }
  },
  methods: {
    load() {
      this.form.amount = null
      this.form.mul = null
      this.form.stopSurplus = null
      this.form.stopLoss = null
      this.form.stopSurplusType = null
      this.form.stopLossType = null
      this.stopInfo = {}
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
</style>
