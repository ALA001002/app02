<template>
  <Layout>
    <van-tabs v-model="active" sticky custom animated>
      <van-tab :title="$t('extra.coin')">
        <div class="section">
          <TradingList :list="list" @select="tradingSelect" />
        </div>
      </van-tab>
      <!-- <van-tab :title="$t('extra.plan')">
        <van-tabs sticky animated small>
          <van-tab :title="$t('extra.current')">
            <NoData></NoData>
          </van-tab>
          <van-tab :title="$t('extra.history')">
            <NoData></NoData>
          </van-tab>
        </van-tabs>
      </van-tab>
      <van-tab :title="$t('extra.have')">
        <van-tabs sticky animated small>
          <van-tab :title="$t('extra.current')">
            <NoData></NoData>
          </van-tab>
          <van-tab :title="$t('extra.history')">
            <NoData></NoData>
          </van-tab>
        </van-tabs>
      </van-tab> -->
    </van-tabs>
  </Layout>
</template>

<script>
import Layout from '@/components/layout/Index.vue'
import TradingList from '@/components/trading/TradingList.vue'
import { get } from 'vuex-pathify'

export default {
  name: 'Home',
  components: { TradingList, Layout },
  data() {
    return {
      active: 0,
    }
  },
  computed: {
    hq: get('hq/hq'),
    list: function () {
      return this.hq
      //.filter(p => !!p.supTimeContract)
    },
  },
  methods: {
    tradingSelect(data) {
      this.$router.push('/options/' + data.symbolCode)
    },
  },
}
</script>
