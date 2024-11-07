<template>
  <div class="section mb-3">
    <div class="flex-between">
      <coinImg class="box14" :coin="item.currency"></coinImg>
      <div class="flex1 text-12px text-mid ml-1">{{item.currency}}</div>
      <div class="small-tag">{{$t('extra.totalPledge')}}</div>
    </div>
    <div class="flex-between mt-2">
      <!-- <div class=" text-16px ml-1">{{$t('extra.flexiblePledge')}}</div> -->
      <div class=" text-16px ml-1">{{item.typeName}}</div>
      <div class="text-16px">{{item.totalRevenue}}%</div>
    </div>
    <!-- <div class="flex-between">
      <div class=" text-10px ml-1 text-primary">{{$t('extra.lowRisk')}} {{$t('extra.flexiblePeriod')}} </div>
      <div class="text-11px text-mid">{{$t('extra.rateOfReturn')}}</div>
    </div> -->
    <div class="flex-between mt-3">
      <div class=" text-11px ml-1 text-mid">{{$t('extra.totalPledge')}}</div>
      <div class="text-11px text-mid">{{item.totalNumber}} {{item.currency}}</div>
    </div>
    <div class="flex-between mt-2">
      <div class=" text-11px ml-1 text-mid">{{$t('extra.pledgePeriod')}}</div>
      <div class="text-11px text-mid green">{{item.profitTime}}{{$t('extra.day')}}</div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {}
  },
  created() {},
  methods: {},
}
</script>

<style scoped lang="scss">
</style>
