<template>
  <div class="nav1">
    <div class="section">
      <div class="flex text-shallow text-11px mt-3">{{$t('extra.showAvailable')}}
        <van-switch class="ml-2" active-color="#F6A702" inactive-color="#666" v-model="showAvailable" size="16px" />
      </div>
      <div class="flex mt-5">
        <div class="coin-type active">ZBC</div>
      </div>
      <div class="list ">
        <div class="item card-bg mt-4 p-3" v-for="i in 5" :key="i">
          <div class="text-18px">BIT Pool</div>
          <div class="flex-center my-3">
            <CoinImg class="box36 mr-3" coin="btc"></CoinImg>
            <span class="text-24px text-shallow no-wrap">9,000,000 ZBC</span>
          </div>
          <div class="flex-between mt-2">
            <span class="text-13px text-mid ">{{$t('extra.rateOfReturn')}}</span>
            <span class="text-14px">13%</span>
          </div>
          <div class="flex-between mt-2">
            <span class="text-13px text-mid ">{{$t('extra.joinNum')}}</span>
            <span class="text-14px">123</span>
          </div>
          <div class="flex-between mt-2">
            <span class="text-13px text-mid ">{{$t('extra.amountOfPledge')}}</span>
            <span class="text-14px">98777273.25 BIT</span>
          </div>
          <div class="px-1 mb-1 mt-4 pt-1">
            <div class="mid-btn w-full text-black" @click="$refs.Certification.show()">{{$t('extra.buyNow')}}</div>
          </div>
        </div>
      </div>
    </div>
    <Certification ref="Certification" @confirm="confirm"></Certification>
  </div>
</template>

<script>
import Certification from '@/components/Certification/index.vue'
export default {
  name: 'nav4',
  components: {
    Certification,
  },
  props: {},
  data() {
    return {
      showAvailable: false,
    }
  },
  methods: {
    confirm() {},
  },
}
</script>

<style scoped lang="scss">
.coin-type {
  background: #18171c;
  height: 24px;
  line-height: 24px;
  font-size: 12px;
  padding: 0 15px;
  border-radius: 2px;
  color: #9b9aa1;
  &.active {
    color: var(--primary);
  }
}
</style>
