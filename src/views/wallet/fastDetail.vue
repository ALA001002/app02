<template>
  <div class="flex1 flex-column">
    <div class="section pb-0">
      <van-tabs v-model="tab" class="height100" type="card" animated show-header no-padding>
        <van-tab name="recharge" :title="$t('extra.rechargeRecord')"></van-tab>
        <van-tab name="withdraw" :title="$t('extra.withdrawRecord')"></van-tab>
      </van-tabs>
    </div>
    <template v-if="tab==='recharge'">
      <div class="section pb-0 flex text-shallow text-13px mt-2">
        <div class=" w-20">{{$t('extra.rechargeType')}}</div>
        <div class=" w-20">{{$t('wallet.num')}}</div>
        <div class=" w-20 tc">{{$t('wallet.status')}}</div>
        <div class=" flex1 tr">{{$t('extra.rechargeSuccessTime')}}</div>
      </div>
      <ScrollMore class="section flex1 py-0" api="pay/orderList" key="recharge">
        <template scope="{list}">
          <div class="flex text-deep line14 mt-4" v-for="item in list" :key="item.id">
            <div class="w-20 flex">
              <CoinImg class="box20 mr-2" :coin="item.coin"></CoinImg>
            </div>
            <div class=" w-20  text-20px ">{{item.amount}}</div>
            <div class=" w-20  text-12px tc">
              {{$t('extra.fastWayStatus')[item.status]}}
            </div>
            <div class=" flex1 text-12px tr">{{item.paySuccTime}}</div>
          </div>
        </template>
      </ScrollMore>
    </template>
    <template v-else-if="tab==='withdraw'">
      <div class="section pb-0 flex text-shallow text-13px mt-2">
        <div class=" w-20">{{$t('wallet.coin')}}</div>
        <div class=" w-20">{{$t('wallet.num')}}</div>
        <div class=" w-20 tc">{{$t('wallet.status')}}</div>
        <div class=" flex1 tr">{{$t('extra.rechargeSuccessTime')}}</div>
      </div>
      <ScrollMore class="section flex1 py-0" api="pay/transHistory" key="withdraw">
        <template scope="{list}">
          <div class="flex text-deep line14 mt-4" v-for="item in list" :key="item.id">
            <div class="w-20 flex">
              <CoinImg class="box20 mr-2" :coin="item.coin"></CoinImg>
            </div>
            <div class=" w-20  text-20px ">{{item.amount}}</div>
            <div class=" w-20  text-12px tc">
              {{$t('extra.fastWayStatus2')[item.status]}}
            </div>
            <div class=" flex1 text-12px tr">{{item.transSuccTime}}</div>
          </div>
        </template>
      </ScrollMore>
    </template>
  </div>
</template>

<script>
import TextFormat from '@/components/TextFormat.vue'
export default {
  components: { TextFormat },
  data() {
    return {
      tab: 'recharge',
      coin: this.$route.params.coin || '',
    }
  },
  methods: {},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
