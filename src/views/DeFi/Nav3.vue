<template>
  <div class="nav2">
    <div class="section">
      <div class="flex text-11px mb-24">
        <span class="green mr-4">{{$t('extra.rateOfReturn400')}}</span>
        <span class="green mr-4">{{$t('extra.shortTerm')}}</span>
        <span class="green">{{$t('extra.hassleFree')}}</span>
      </div>
      <div class="img-card card-bg p-3">
        <div class="flex-between text-11px ">
          <span class="text-15px mr-4">{{$t('extra.howWork')}}</span>
          <span class="text-primary text-12px" @click="$emit('showPopup')">{{$t('extra.understandMore')}} &gt;</span>
        </div>
        <img class="w-full mt-2 mb-1" src="@/assets/images/new/howWork.png">
      </div>
      <div class="flex text-11px mt-4 text-shallow">
        <img class="mr-1" style="width:10px" src="@/assets/images/new/alarm.svg">{{$t('extra.update5min')}}
      </div>
      <div class="filter-item flex-between mt-3 text-13px text-mid">
        <div class="flex" :class="{'text-primary':!coin}" @click="coin='';expandCoin=''">
          <img class="box10 mr-1" v-if="!coin" src="@/assets/images/new/all-on.svg">
          <img class="box10 mr-1" v-else src="@/assets/images/new/all.svg">
          {{$t('extra.all')}}
        </div>
        <div class="item" :class="{'text-primary':item===coin}" v-for="item in coinList" :key="item" @click="coin=item;expandCoin=''">{{item}} <sup class="text-7px text-primary">{{$t('extra.new')}}</sup></div>
        <div v-if="expandCoin" class="expand flex" :class="{'text-primary':expandCoin===coin}">
          <div @click="expendModel=true">{{expandCoin}}</div>
          <van-icon name="arrow-down" class="ml-1" size="14px"></van-icon>
        </div>
        <div v-else @click="expendModel=true" class="more flex">{{$t('extra.expand')}} <van-icon name="arrow-down" class="ml-1" size="14px"></van-icon>
        </div>
      </div>
      <div class="flex text-shallow text-11px mt-4 mb-24">{{$t('extra.showAvailable')}}
        <van-switch class="ml-2" active-color="#F6A702" inactive-color="#666" v-model="showAvailable" size="16px" />
      </div>

      <div class="list  ">
        <div class="item  mb-24  px-0 pb-0 oh" style="background:#18171C" v-for="i in list" :key="i.id">
          <div class="flex-between p-3 my-2" style="height:54px" @click="i.expand=!i.expand">
            <img class="box20" src="@/assets/images/new/BTC.svg">
            <img class="box20" style="margin-left:-6px" src="@/assets/images/new/USDT.svg">
            <div class="flex1 ml-2 text-16px">BTC-USDT</div>
            <div class="tr" v-if="!i.expand">
              <div class="text-17px text-primary">298.99%</div>
              <div class="text-11px text-shallow mt-1">{{$t('extra.expectedEarnings')}}</div>
            </div>
            <van-icon class="expand-icon ml-2" :class="{rotate:i.expand}" name="arrow-down" color="#ADACB0" size="16px"></van-icon>
          </div>
          <div class=" expand-part circle" :style="{maxHeight:i.expand?'1080px':'0'}">
            <div class="flex-between mb-3  px-3">
              <div class="text-12px  text-shallow">
                {{$t('extra.expectedPrice')}}
              </div>
              <div class="text-13px">12233</div>
            </div>
            <div class="flex-end mx-3 p-2 mb-4 text-12px  text-shallow" style="background:#222126">
              <img class="box14 mr-1" src="@/assets/images/new/defi_up.svg">
              {{$t('extra.earn')}} USDT /
              <img class="box14 mx-1" src="@/assets/images/new/defi_down.svg">
              {{$t('extra.earn')}} BIT
            </div>
            <div class="list " style="background:#222126">
              <div class="flex-between items-start bb-dash pl-3 pr-4 py-4" v-for="i in 2" :key="i">
                <div class="left">
                  <div class="text-15px line20">1 {{$t('extra.dayLong')}}</div>
                  <div class="text-12px text-shallow mt-1">{{$t('extra.timeLong')}}</div>
                </div>
                <div class="left">
                  <div class="text-15px line20">2022-03-08</div>
                  <div class="text-12px text-shallow mt-1">{{$t('exchange.capitalRatePeriod')}}</div>
                </div>
                <div class="left flex-column tr">
                  <div class="text-20px text-primary line20">239.39%</div>
                  <div class="text-12px text-shallow mt-1">{{$t('extra.expectedEarnings')}}</div>
                  <div class="flex-end mt-2">
                    <div class="mid-btn  text-14px text-black" style="width:72px" @click="toPlace">
                      {{$t('extra.choose')}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-popup v-model="expendModel" round position="bottom" get-container="body">
      <van-picker show-toolbar :cancel-button-text="$t('extra.cancel')" :confirm-button-text="$t('extra.confirm')" :columns="expandList" :default-index="expandIndex" @confirm="onConfirm" @cancel="expendModel = false" />
    </van-popup>
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
          <van-slider v-model="percetage" button-size="16px" active-color="#F5A601" inactive-color="#4F4F51" :step="20" @input="number=total/100*$event" />
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
  name: 'nav2',
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
    }
  },
  methods: {
    onConfirm(v) {
      this.expandCoin = v
      this.coin = v
      this.expendModel = false
    },
    toPlace() {
      this.showPlace = true
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