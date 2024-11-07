<template>
  <div class="nav2">
    <van-popup v-model="showPlace" closeable round position="bottom" style="background:#1C1C1C" get-container="body">
      <div class="popup-title p-3  text-20px bb-shallow">{{$t('extra.byOrder')}}</div>
      <div class="section overflow-auto" style="height:90vh">
        <div class="flex-between mb-3 mt-1">
          <span class="text-14px text-mid">{{$t('extra.rateOfReturn')}}</span>
          <span class="text-20px text-success">211.92%</span>
        </div>
        <div class="flex-between mb-3 text-14px">
          <span class=" text-mid">{{$t('extra.expectedPrice')}}</span>
          <span class=" text-deep">1.2839</span>
        </div>
        <div class="flex-between mb-1 text-14px">
          <span class=" text-mid">{{$t('extra.timeLong')}}</span>
          <span class=" text-deep">1 {{$t('extra.dayLong')}}</span>
        </div>
        <div class="steps mt-4" :class="{expand:expendPopup}">
          <div class="step flex-between mb-3 text-14px">
            <span class="flex1 text-mid">{{$t('extra.orderCreateTime')}}</span>
            <span class="text-12px text-deep">2022-03-20 ：09:00 （UTC）</span>
          </div>
          <div class="step flex-between mb-3 text-14px">
            <span class="flex1 text-mid">{{$t('extra.settlementTime')}}</span>
            <span class="text-12px text-deep">2022-03-20 ：09:00 （UTC）</span>
          </div>
          <div class="step flex-between mb-3 text-14px">
            <span class="flex1 text-mid">{{$t('extra.releaseTime')}}</span>
            <span class="text-12px text-deep">2022-03-20 ：09:00 （UTC）</span>
          </div>
          <div class="flex-between mb-3 text-14px mt-4">
            <span class=" text-mid">{{$t('extra.remainingAvailable')}}</span>
            <span class="text-12px text-deep">27368672.79 USDT / 28399.99 BIT</span>
          </div>
        </div>
        <div class="flex-end text-14px my-3" v-if="!expendPopup" @click="expendPopup=true">{{$t('extra.expand')}} <van-icon class="ml-1" name="arrow-down"></van-icon>
        </div>
        <div class="flex-end text-14px my-3" v-else @click="expendPopup=false">{{$t('extra.putAway')}} <van-icon class="ml-1" name="arrow-up"></van-icon>
        </div>
        <div class="bb-shallow"></div>
        <div class="text-14px text-mid my-4">{{$t('wallet.balance')}} &nbsp;<span class="text-deep">0.00000000 BIT</span></div>
        <div class="radius-small p-2 flex-between" style="background:#28282A">
          <input type="text" class="text-16px" v-model="number" :placeholder="$t('extra.minimum') + '20'">
          <div class="flex">
            <coinImg coin="btc" class="box14"></coinImg> <span class="text-13px ml-1">BIT</span>
          </div>
        </div>
        <div class="px-1 my-5">
          <van-slider v-model="percetage" button-size="16px" active-color="#F5A601" inactive-color="#4F4F51" :step="20" @input="number=total/100*$event">
            <template #button> <img class="box20" src="@/assets/images/new/button.svg"></template>
          </van-slider>
        </div>
        <div class="text-16px text-deep flex-between mt-5">
          {{$t('extra.expectedEarnings2')}}
          <van-icon name="arrow-up" v-if="expendIncome" @click="expendIncome=false"></van-icon>
          <van-icon name="arrow-down" v-else @click="expendIncome=true"></van-icon>
        </div>
        <div v-if="expendIncome" class="radius-small mt-3 text-mid" style="background:#28282A">
          <div class=" p-4 bb-dash">
            <div class="text-12px">
              {{$t('extra.ifPrice')}} ≥ 1.28399
            </div>
            <div class="text-14px flex-between mt-3">
              {{$t('extra.actualIncome')}}
              <span class="text-deep">- - BIT</span>
            </div>
            <div class="text-14px flex-between mt-3">
              {{$t('extra.return')}}
              <span class="text-deep">- - BIT</span>
            </div>
          </div>
          <div class=" p-4">
            <div class="text-12px">
              {{$t('extra.ifPrice')}} ≥ 1.28399
            </div>
            <div class="text-14px flex-between mt-3">
              {{$t('extra.actualIncome')}}
              <span class="text-deep">- - BIT</span>
            </div>
            <div class="text-14px flex-between mt-3">
              {{$t('extra.return')}}
              <span class="text-deep">- - BIT</span>
            </div>
          </div>
        </div>
        <div v-else class="radius-small py-2 mt-3" style="background:#28282A">
          <div class="text-14px p-2 flex bb-dash"> <img class="box14 mr-2" src="@/assets/images/new/down.svg"> {{$t('extra.actualIncome')}} - - USDT</div>
          <div class="text-14px p-2 flex"><img class="box14 mr-2" src="@/assets/images/new/up.svg">{{$t('extra.actualIncome')}} - - USDT</div>
        </div>
        <div class="big-btn radius mt-4" :disabled="!number">{{$t('wallet.submit')}}</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  props: {
    msg: String,
  },
  data() {
    return {
      showAvailable: false,
      showPlace: false,
      expendModel: false,
      expendPopup: false,
      expendIncome: false,
      active: 0,
      percetage: 0,
      total: 123123,
      number: '',
      coin: '',
      expandCoin: '',
      coinList: ['BIT', 'ETH', 'BTC'],
      expandList: ['BIT2', 'ETH2', 'BTC2'],
      expandIndex: 0,
      list: [{ expand: false }, { expand: false }, { expand: false }],
      item: {},
    }
  },
  methods: {
    onConfirm(v) {
      this.expandCoin = v
      this.coin = v
      this.expendModel = false
    },
    show(item) {
      this.$http
        .get('product/productInfoDetail', { id: item.id })
        .then(data => {
          console.log({ ...data })
          this.item = data
          this.showPlace = true
        })
    },
  },
}
</script>

<style scoped lang="scss">
.steps {
  height: 0;
  overflow: hidden;
  transition: height 0.3s;
  &.expand {
    height: 128px;
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