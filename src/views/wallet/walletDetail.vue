<template>
  <div class="flex1 flex-column">
    <div class="section pb-0">
      <van-tabs v-model="tab" class="height100" type="card" animated show-header no-padding>
        <van-tab name="Wallet" :title="$t('wallet.walletLog')"></van-tab>
        <van-tab name="Asset" :title="$t('wallet.assetLog')"></van-tab>
      </van-tabs>
    </div>
    <template v-if="tab==='Wallet'">
      <div class="section pb-0 flex text-shallow text-13px mt-2">
        <div class=" w-30">{{$t('extra.rechargeType')}}</div>
        <div class=" w-20">{{$t('wallet.num')}}</div>
        <div class=" w-13 tc">{{$t('wallet.status')}}</div>
        <div class=" flex1 tr">{{$t('extra.rechargeTime')}}</div>
      </div>
      <ScrollMore class="section flex1 py-0" api="asset/withdrawHistory" :params="{coin}" key="Wallet">
        <template scope="{list}">
          <div class="flex text-deep line14 mt-4" v-for="item in list" :key="item.id">
            <div class="w-30 flex">
              <CoinImg :upDown="item.type" class="box20 mr-2" :coin="item.coin"></CoinImg>
              <span class="text-13px">{{item.coin}}
              </span>
            </div>
            <div class=" w-20  text-13px ">{{item.money}}</div>
            <div class=" w-15  text-12px tc">
              <div class="text-success" v-if="item.status===1">{{$t('extra.success')}}</div>
              <div class="text-danger" v-else-if="item.status===2">{{$t('extra.fail')}}</div>
              <div class="text-primary" v-else>{{$t('extra.pendding')}}</div>
            </div>
            <div class=" flex1 text-11px tr">{{item.createTime}}</div>
          </div>
        </template>
      </ScrollMore>
    </template>
    <template v-else>
      <div class="section pb-0 flex text-shallow text-13px  my-2">
        <div class=" w-25">{{$t('wallet.coin')}}</div>
        <div class=" w-35 tr pr-4">{{$t('wallet.assetLog')}}</div>
        <div class=" flex1 tr">{{$t('wallet.time')}}</div>
      </div>
      <ScrollMore class="section flex1 py-0" :api="'asset/getAssetHistory'" :params="{coin}" key="Asset">
        <template scope="{list}">
          <div class="header flex text-deep line14  mt-2" v-for="item in list" :key="item.id">
            <div class="w-25 flex">
<!--              <CoinImg class="box20 mr-2" :coin="item.coin"></CoinImg>-->
              <span class="text-15px">{{item.coin}}</span>
            </div>
            <div class=" w-35 text-15px tr pr-4">
              <TextFormat :float="item.dim?-1:1" :text="(item.dim?'-':'+')+item.amount" />
              <div class="text-shallow text-10px mt-0 mr-2">{{getTitle(item)}}</div>
            </div>
            <div class="tr flex1 text-12px">{{item.operateTime}}</div>
          </div>
        </template>
      </ScrollMore>
    </template>
  </div>
</template>

<script>
import Wallet from '@/components/details/Wallet.vue'
import Asset from '@/components/details/Asset.vue'
import TextFormat from '@/components/TextFormat.vue'
export default {
  components: { Wallet, Asset, TextFormat },
  data() {
    return {
      tab: 'Wallet',
      coin: this.$route.params.coin || '',
    }
  },
  methods: {
    getTitle(data) {
      switch (data.type) {
        case 1:
          return this.$t('wallet.assetStatus1')
        case 2:
          return this.$t('wallet.assetStatus2')
        case 3:
          return this.$t('wallet.assetStatus3')
        case 4:
          return this.$t('wallet.assetStatus4')
        case 5:
          return this.$t('wallet.assetStatus5')
        case 6:
          return this.$t('wallet.assetStatus6')
        case 7:
          return this.$t('wallet.assetStatus7')
        case 8:
          return this.$t('wallet.assetStatus8')
        case 10:
          return this.$t('wallet.assetStatus10')
        case 11:
          return this.$t('wallet.assetStatus11')
        case 12:
          return this.$t('wallet.assetStatus12')
        case 13:
          return this.$t('wallet.assetStatus13')
        case 14:
          return this.$t('wallet.assetStatus14')
        case 15:
          return this.$t('wallet.assetStatus15')
        case 16:
          return this.$t('wallet.assetStatus16')
        case 17:
          return this.$t('wallet.assetStatus17')
        case 18:
          return this.$t('wallet.assetStatus18')
        case 19:
          return this.$t('wallet.assetStatus19')
        case 20:
          return this.$t('wallet.assetStatus20')
        case 21:
          return this.$t('wallet.assetStatus21')
        case 22:
          return this.$t('wallet.assetStatus22')
        case 23:
          return this.$t('wallet.assetStatus23')
        case 24:
          return this.$t('wallet.assetStatus24')
        case 25:
          return this.$t('wallet.assetStatus25')
        default:
          return this.$t('wallet.assetStatus0')
      }
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
