<template>
  <div class="section  flex-y-full">
    <!-- <div class="img-card card-bg p-3">
        <div class="flex-between text-11px ">
          <span class="text-15px mr-4">{{$t('extra.howWork')}}</span>
          <span class="text-primary text-12px" @click="$emit('showPopup')">{{$t('extra.understandMore')}} &gt;</span>
        </div>
        <img class="w-full mt-2 mb-1" src="@/assets/images/new/howWork.png">
      </div> -->
    <!-- <div class="flex text-13px mt-4">{{$t('extra.hotCoin')}}
      <img class="ml-1" style="width:16px" src="@/assets/images/new/icon_hot.svg">
    </div> -->
    <div class="flex text-shallow text-11px mt-0 mb-4">{{$t('extra.showAvailable')}}
      <van-switch class="ml-2" active-color="#F6A702" inactive-color="#666" v-model="showAvailable" size="16px" />
    </div>
    <div class="list p-3 mt-2  full-part">
      <div class="item mb-6" v-for="item in list" :key="item.id">
        <template v-if="(showAvailable && (item.time && item.remainingNumber>0)) || !showAvailable">
          <div class="flex-between">
            <coinImg class="box20" :coin="item.currency"></coinImg>
            <div class="flex1 ml-2 text-18px">{{item.productName}}</div>
            <div class="tr">
              <div class="text-11px text-shallow">{{item.time?$t('extra.untilEnd'):$t('extra.over')}}</div>
              <div class="text-11px text-shallow mt-1 time-format" style="color:#DB4641" v-html="item.time"></div>
              <!-- <div class="text-11px text-shallow mt-1">9 <span class="text-danger">{{$t('extra.day')}}</span> 21 <span class="text-danger">{{$t('extra.hour')}}</span> 25 <span class="text-danger">{{$t('extra.min')}}</span> 50 <span class="text-danger">{{$t('extra.second')}}</span></div> -->
            </div>
          </div>
          <div class="flex-between mt-3 mb-2">
            <div class="left">
              <div class="text-primary text-28px line1">{{item.totalRevenue}}%</div>
              <div class="text-11px text-mid mt-2">{{$t('extra.rateOfReturn')}}</div>
            </div>
            <div class="mid-btn" disabled v-if="item.remainingNumber<=0"> {{$t('extra.soldOut')}} </div>
            <div class="mid-btn" v-else :disabled="!item.time" @click="buy(item)"> {{$t('extra.pledgeNow')}} </div>
          </div>
          <div class="process-wrapper">
            <div class="process" :style="{width: ((item.totalNumber - item.remainingNumber)/item.totalNumber *100) +'%'}"></div>
          </div>
          <div class="text-11px mt-1 text-mid">{{item.totalNumber - item.remainingNumber}} / <span class="text-shallow">{{item.totalNumber}} {{item.currency}}</span></div>
        </template>
      </div>
    </div>
    <OrderPopup ref="OrderPopup"></OrderPopup>
  </div>
</template>

<script>
import { timeToEndDate } from '@/utils/time'
import OrderPopup from './OrderPopup.vue'

export default {
  name: 'nav1',
  components: {
    OrderPopup,
  },
  props: {
    msg: String,
  },
  data() {
    return {
      list: [],
      showAvailable: false,
    }
  },
  created() {
    this.getData()
    const timer = setInterval(() => {
      this.getTime()
    }, 1000)
    this.$once('hook:beforeDestroy', () => {
      clearInterval(timer)
    })
  },
  methods: {
    buy(item) {
      this.$refs.OrderPopup.show(item)
    },
    getData() {
      this.$http.get('product/productInfoList?typeId=1').then(data => {
        // console.log({ ...data[0] })
        this.list = data.map(item => ({ ...item, time: '' }))
        this.getTime()
      })
    },
    getTime() {
      // console.log('计算时间')
      if (!this.list.length) {
        return false
      }
      this.list = this.list.map(item => {
        return {
          ...item,
          time: timeToEndDate(
            '',
            item.countdownTime,
            'YYYY-MM-DD HH:mm:ss',
            `D${this.getColor('extra.day')}H${this.getColor(
              'extra.hour'
            )}m${this.getColor('extra.min')}s${this.getColor('extra.second')}`
          ),
        }
      })
    },
    getColor(i18n = 'day') {
      return `<i>${this.$t(i18n)}</i>`
    },
  },
}
</script>

<style scoped lang="scss">
.time-format {
  ::v-deep i {
    color: #848388;
    font-style: normal;
  }
}
</style>
