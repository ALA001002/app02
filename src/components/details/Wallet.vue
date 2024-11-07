<template>
  <ScrollMore api="asset/withdrawHistory" :params="params">
    <div class="flex text-shallow text-13px mb-3" slot="header">
      <div class=" w-30">{{$t('extra.rechargeType')}}</div>
      <div class=" w-20">{{$t('wallet.num')}}</div>
      <div class=" w-13 tc">{{$t('wallet.status')}}</div>
      <div class=" flex1 tr">{{$t('extra.rechargeTime')}}</div>
    </div>
    <template slot-scope="{list}">
      <div class="flex text-deep line1 mb-24" v-for="item in list" :key="item.id">
        <div class="w-30 flex">
          <CoinImg :upDown="item.type" class="box20 mr-2" :coin="item.coin"></CoinImg>
          <span class="text-16px">{{item.coin}}
            <!-- <small class="text-12px text-shallow">/USDT</small> -->
          </span>
        </div>
        <div class=" w-20  text-20px ">{{item.money}}</div>
        <div class=" w-13  text-12px tc">
          <div class="text-success" v-if="item.status===1">{{$t('extra.success')}}</div>
          <div class="text-danger" v-else-if="item.status===2">{{$t('extra.fail')}}</div>
          <div class="text-primary" v-else>{{$t('extra.pendding')}}</div>
        </div>
        <div class=" flex1 text-12px tr">{{item.createTime}}</div>
      </div>
    </template>
  </ScrollMore>
</template>

<script>
export default {
  props: {
    coin: String,
  },
  data() {
    return {
      params: {
        coin: this.coin || '',
      },
    }
  },
}
</script>
<style lang="scss" scoped>
</style>
