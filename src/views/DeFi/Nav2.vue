<template>
  <div class="section flex-y-full">
    <div class="flex text-shallow text-11px mt-0 mb-4">{{$t('extra.showAvailable')}}
      <van-switch class="ml-2" active-color="#F6A702" inactive-color="#666" v-model="showAvailable" size="16px" />
    </div>
    <div class="list px-3 full-part">
      <div class="item mt-5" v-for="item in list" :key="item.id">
        <template v-if="(showAvailable && item.remainingNumber>=0) || !showAvailable">
          <div class="flex-between">
            <coinImg class="box24 mr-1" :coin="item.currency"></coinImg>
            <!-- <coinImg class="box24 mr-1" :coin="item.currency"></coinImg> -->
            <span class="text-18px flex1 no-wrap">{{item.productName}}</span>
          </div>
          <div class="flex-between mt-4">
            <span class="text-13px text-mid ">{{$t('extra.annualBenchmarkYield')}}</span>
            <span class="text-14px">{{item.totalRevenue}}%</span>
          </div>
          <div class="flex-between mt-2">
            <span class="text-13px text-mid ">{{$t('extra.theTerm')}}</span>
            <span class="text-14px">{{item.profitTime}}{{$t('extra.day')}}</span>
          </div>
          <div class="flex-between mt-2">
            <span class="text-13px text-mid ">{{$t('wallet.coin')}}</span>
            <span class="text-14px">{{item.currency}}</span>
          </div>
          <div class="flex-between mt-2">
            <span class="text-13px text-mid ">{{$t('extra.minPledgeAmount')}}</span>
            <span class="text-14px">{{item.purchaseAmountMin}}</span>
          </div>
          <div class="px-1 mb-48">
            <div class="mid-btn w-full mt-4" v-if="item.remainingNumber<=0" disabled>{{$t('extra.soldOut')}}</div>
            <div class="mid-btn w-full mt-4" v-else @click="buy(item)">{{$t('extra.pledgeNow')}}</div>
          </div>
        </template>
      </div>
    </div>
    <OrderPopup ref="OrderPopup" type="2"></OrderPopup>
  </div>
</template>

<script>
import OrderPopup from './OrderPopup.vue'
export default {
  name: 'nav2',
  components: {
    OrderPopup,
  },
  props: {},
  data() {
    return {
      i: '',
      list: [],
      showAvailable: false,
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.$http.get('product/productInfoList?typeId=2').then(data => {
        // console.log({ ...data[0] })
        this.list = data
      })
    },
    buy(item) {
      this.$refs.OrderPopup.show(item)
    },
  },
}
</script>

<style scoped lang="scss">
.list {
  overflow-y: auto;
}
</style>
