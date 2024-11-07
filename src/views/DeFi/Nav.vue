<template>
  <div class="flex1-auto flex-column">
    <van-tabs v-model="params.typeId" animated mini>
      <van-tab :name="item.typeId" :title="item.typeName" v-for="item in tabs" :key="item.typeId">
      </van-tab>
    </van-tabs>
    <van-tabs class="section mt-1" v-model="params.status" type="card" animated show-header no-padding>
      <van-tab :name="1" :title="$t('extra.validOrder')">
      </van-tab>
      <van-tab :name="3" :title="$t('extra.allOrder')">
      </van-tab>
    </van-tabs>
    <div class="section pb-0 flex text-shallow text-13px mt-0">
      <div class=" w-30">{{$t('extra.productType')}}</div>
      <div class=" w-20">{{$t('extra.amount')}}</div>
      <div class=" w-25">{{$t('extra.startTime')}}</div>
      <div class=" w-25 tc">{{$t('extra.endTime')}}</div>
      <div class=" w-15 tr">{{$t('extra.status')}}</div>
    </div>
    <ScrollMore class="section flex1 py-0" method="post" api="product/productOrderList" :params="params">
      <template scope="{list}">
        <template v-if="list">
          <div class="flex text-deep line14 mt-4" v-for="item in list" :key="item.id">
            <div class="w-30 flex">
              <CoinImg class="box20 mr-2" :coin="item.currency"></CoinImg>
              <span class="text-15px">{{item.currency}}
              </span>
            </div>
            <div class=" w-20  text-18px ">{{item.purchaseAmount }}</div>
            <div class=" w-25  text-12px ">{{item.beginReleaseTime| date}}</div>
            <div class=" w-25  text-12px ">{{item.endReleaseTime| date}}</div>
            <div class=" w-15  text-12px tr">
              <div class="text-danger" v-if="item.status===1">{{$t('extra.penddingStatus')}}</div>
              <div class="text-success" v-else-if="item.status===2">{{$t('extra.finishStatus')}}</div>
            </div>
            <div class=" flex1 text-12px tr">{{item.createTime}}</div>
          </div>
        </template>
      </template>
    </ScrollMore>
    <!-- #region 之前显示余额的代码 -->
    <!-- <router-link class="flex-between mb-5 line1" to="/DeFi/detail/0">
      <img class="box32" src="@/assets/images/new/defi_wallet.svg">
      <div class="flex1 ml-2 ">
        <div class="text-17px mb-1">{{$t('extra.flexiblePledge')}}</div>
        <value-format class="text-12px" plusOrMinus :value="12" prefix="$" suffix="PNL"></value-format>
      </div>
      <div class="tr">
        <div class="text-16px"> 0 USDT</div>
        <div class="text-11px text-shallow mt-1"> ≈0.00USD</div>
      </div>
    </router-link>
    <router-link class="flex-between mb-5 line1" to="/DeFi/detail/1">
      <img class="box32" src="@/assets/images/new/defi_coin.svg">
      <div class="flex1 ml-2 ">
        <div class="text-17px">{{$t('extra.doubleCoinMining')}}</div>
      </div>
      <div class="tr">
        <div class="text-16px"> 0 USDT</div>
        <div class="text-11px text-shallow mt-1"> ≈0.00USD</div>
      </div>
    </router-link>
    <router-link class="flex-between mb-5 line1" to="/DeFi/detail/2">
      <img class="box32" src="@/assets/images/new/defi_deg.svg">
      <div class="flex1 ml-2 ">
        <div class="text-17px mb-1">{{$t('extra.DefiMining')}}</div>
        <value-format class="text-12px" plusOrMinus :value="-12" prefix="$" suffix="PNL"></value-format>
      </div>
      <div class="tr">
        <div class="text-16px"> 0 USDT</div>
        <div class="text-11px text-shallow mt-1"> ≈0.00USD</div>
      </div>
    </router-link>
    <router-link class="flex-between line1 pb-3" to="/DeFi/detail/3">
      <img class="box32" src="@/assets/images/new/defi_pool.svg">
      <div class="flex1 ml-2 ">
        <div class="text-17px mb-1">{{$t('extra.subscription')}}</div>
        <value-format class="text-12px" plusOrMinus :value="0" prefix="$" suffix="PNL"></value-format>
      </div>
      <div class="tr">
        <div class="text-16px"> 0 USDT</div>
        <div class="text-11px text-shallow mt-1"> ≈0.00USD</div>
      </div>
    </router-link> -->
    <!-- #endregion  -->
  </div>
</template>

<script>
export default {
  name: 'comp',
  components: {},
  filters: {
    date: function (value) {
      return value ? value.split(' ')[0] : ''
    },
  },
  data() {
    return {
      tabs: [],
      params: {
        typeId: null,
        status: 1,
      },
    }
  },
  created() {
    this.getTypes()
  },
  watch: {},
  methods: {
    getTypes() {
      this.$http.get('product/productTypeList').then(data => {
        // console.log(data[0])
        this.tabs = data
      })
    },
  },
}
</script>

<style scoped lang="scss">
</style>