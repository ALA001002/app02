<template>
  <van-popup v-model="showPlace" closeable round position="bottom" style="background:#1C1C1C" get-container="body">
    <div class="popup-title p-3  text-20px bb-shallow">{{$t('extra.byOrder')}}</div>
    <div class="section overflow-auto" style="height:90vh">
      <template v-if="type==='1'">
        <div class="flex-between mb-3 mt-1">
          <span class="text-14px text-mid">{{$t('extra.expectedRateOfReturn')}}</span>
          <span class="text-20px text-success">{{item.totalRevenue}}%</span>
        </div>
        <div class="flex-between mb-3 text-14px">
          <span class=" text-mid">{{$t('extra.calculationStatrtTime')}}</span>
          <span class=" text-deep">{{item.startTime}}</span>
        </div>
        <div class="flex-between mb-3 text-14px">
          <span class=" text-mid">{{$t('extra.issueTime')}}</span>
          <span class=" text-deep">{{item.issueTime}}</span>
        </div>
        <div class="flex-between mb-3 text-14px">
          <span class=" text-mid">{{$t('extra.maxPledgeAmount')}}</span>
          <span class=" text-deep">{{item.purchaseAmountMax}} {{item.currency}}</span>
        </div>
        <div class="flex-between mb-3 text-14px">
          <span class=" text-mid">{{$t('extra.totalPledgeAmount')}}</span>
          <span class=" text-deep">{{item.totalNumber}} {{item.currency}}</span>
        </div>
      </template>
      <template v-else-if="type==='2'">
        <div class="flex-between mb-3 mt-1">
          <span class="text-14px text-mid">{{$t('extra.pledgeTime')}}</span>
          <span class="text-18px text-success">{{item.profitTime}} {{$t('extra.day')}}</span>
        </div>
        <div class="flex-between mb-3 text-14px">
          <span class=" text-mid">{{$t('extra.effectiveDate')}}</span>
          <span class=" text-deep">{{item.startTime}}</span>
        </div>
        <div class="flex-between mb-3 text-14px">
          <span class=" text-mid">{{$t('extra.expiryDate')}}</span>
          <span class=" text-deep">{{item.issueTime}}</span>
        </div>
        <div class="steps" :class="{expand:expendPopup}">
          <div class="bb-shallow"></div>
          <div class="flex-between my-3 text-14px">
            <span class=" text-mid">{{$t('wallet.coin')}}</span>
            <span class=" text-deep">{{item.currency}}</span>
          </div>
          <div class="flex-between mb-3 text-14px">
            <span class=" text-mid">{{$t('extra.maxPledgeAmount')}}</span>
            <span class=" text-deep">{{item.purchaseAmountMax}} {{item.currency}}</span>
          </div>
          <div class="flex-between mb-3 text-14px">
            <span class=" text-mid">{{$t('extra.remainingAvailable')}}</span>
            <span class=" text-deep">{{item.remainingNumber}} {{item.currency}}</span>
          </div>
          <div class="flex-between mb-3 text-14px">
            <span class=" text-mid">{{$t('extra.settlementTime')}}</span>
            <span class=" text-deep">{{item.issueTime}}</span>
          </div>
        </div>
        <div class="flex-end text-14px my-3" v-if="!expendPopup" @click="expendPopup=true">{{$t('extra.expand')}} <van-icon class="ml-1" name="arrow-down"></van-icon>
        </div>
        <div class="flex-end text-14px my-3" v-else @click="expendPopup=false">{{$t('extra.putAway')}} <van-icon class="ml-1" name="arrow-up"></van-icon>
        </div>
      </template>
      <div class="bb-shallow"></div>
      <div class="text-14px text-mid mt-4 mb-2">{{$t('wallet.balance')}} &nbsp;<span class="text-deep">{{balance}} {{item.currency}}</span></div>
      <div class="radius-small p-2 flex-between" style="background:#28282A">
        <input type="text" class="text-16px" v-model="number" :placeholder="$t('wallet.enterNum')">
        <div class="flex">
          <coinImg :coin="item.currency" class="box14"></coinImg> <span class="text-13px ml-1">{{item.currency}}</span>
          <div class="split mx-2"></div>
          <div class="text-primary nowrap text-14px" @click="number=item.purchaseAmountMax">{{$t('exchange.high')}}</div>
        </div>
      </div>
      <div class="text-12px text-mid mt-1 mb-2">{{$t('extra.minPledgeAmount')}}: {{item.purchaseAmountMin}} {{item.currency}}</div>
      <!-- <div class="px-1 my-5">
          <van-slider v-model="percetage" button-size="16px" active-color="#F5A601" inactive-color="#4F4F51" :step="20" @input="number=total/100*$event">
            <template #button> <img class="box20" src="@/assets/images/new/button.svg"></template>
          </van-slider>
        </div> -->
      <div class="big-btn radius mt-5" :disabled="!number" @click="submit">{{$t('extra.pledgeNow')}}</div>
    </div>
  </van-popup>
</template>

<script>
import { get } from 'vuex-pathify'
import { Toast } from 'vant'
export default {
  props: {
    type: {
      type: String,
      default: '1',
    },
  },
  data() {
    return {
      showPlace: false,
      expendPopup: false,
      percetage: 0,
      number: '',
      item: {},
    }
  },
  computed: {
    wallet: get('user/wallet'),
    balance() {
      if (this.wallet && this.wallet.length && this.item.currency) {
        const currencyData = this.wallet.find(
          item => item.currency === this.item.currency
        )
        return currencyData?.balance || 0
      }
      return 0
    },
  },
  methods: {
    show(item) {
      this.$http
        .get('product/productInfoDetail', { id: item.id })
        .then(data => {
          console.log({ ...data })
          this.item = data
          this.showPlace = true
        })
    },
    submit() {
      this.$http
        .post('product/buyProducts', {
          productId: this.item.id,
          buyProducts: this.number,
        })
        .then(() => {
          this.number = ''
          Toast.success()
          this.showPlace = false
        })
    },
  },
}
</script>

<style scoped lang="scss">
.split {
  height: 14px;
  width: 1px;
  background: #424142;
}
.steps {
  height: 0;
  overflow: hidden;
  transition: height 0.3s;
  &.expand {
    height: 140px;
  }
  .step {
    position: relative;
    &::before {
      content: '';
      display: block;
      width: 10px;
      height: 10px;
      background: #f2a603;
      border-radius: 50%;
      margin-right: 10px;
      z-index: 1;
    }
    &::after {
      content: '';
      display: block;
      position: absolute;
      width: 2px;
      height: 30px;
      background: #848487;
      top: 50%;
      left: 4px;
    }
    &:nth-child(3)::after {
      display: none;
    }
  }
}
.circle {
  position: relative;
  overflow-x: hidden;
  overflow-y: inherit;
  &::before {
    left: 0;
    transform: translateX(-50%) translateY(-50%);
  }
  &::after {
    right: 0;
    transform: translateX(50%) translateY(-50%);
  }
  &::before,
  &::after {
    content: '';
    position: absolute;
    display: block;
    width: 20px;
    height: 20px;
    background: #100f15;
    border-radius: 50%;
    top: 86px;
  }
}
</style>
