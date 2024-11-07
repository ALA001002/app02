<template>
  <Layout>
    <!-- 头部 -->
    <div
      class="section pb-1 has-text-centered has-text-weight-bold is-size-6"
      slot="header"
    >
      {{ $t("app.contract") }}
    </div>
    <van-tabs :border="false" color="#377DFF" title-active-color="#242424">
      <van-tab name="0" :title="$t('exchange.coin')" to="/contract/order"/>
      <van-tab name="0" :title="$t('order.orderTrust')" to="/contract/order?type=1"/>
      <van-tab name="1" :title="$t('order.orderMarket')" to="/contract/order"/>
    </van-tabs>
    <div class="section has-background-white mt-3">
      <TradingList :list="list" @select="tradingSelect"/>
    </div>
    <!-- 底部信息 -->
    <div class="py-5 px-3 has-text-centered has-text-weight-light">
      <router-link tag="small" :to="`/view?type=key&id=hyjyfxts&title=${this.$t('app.riskInfo')}`" class="has-text-link">
        {{ $t("app.riskInfo") }} >
      </router-link>
    </div>
  </Layout>
</template>

<script>
import Layout from '@/components/layout/Index.vue'
import TradingList from '@/components/trading/TradingList.vue'
import { get } from 'vuex-pathify'

export default {
  name: 'Home',
  components: { Layout, TradingList },
  data() {
    return {
    }
  },
  computed: {
    list: get('hq/hq')
  },
  methods: {
    tradingSelect(data) {
      this.$router.push('/contract/'+data.symbolCode)
    }
  }
}
</script>
