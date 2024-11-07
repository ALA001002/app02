<template>
  <layout full>
    <navBar back>{{coin}}</navBar>
    <div class="section my-0">
      <div class="text-16px">{{$t('wallet.balance')}} {{account.balance}}</div>
      <div class="text-16px">{{$t('subscription.dj')}} {{account.frozen || 0}}</div>
    </div>
    <walletDetail :tab="tab"></walletDetail>
  </layout>
</template>

<script>
import { get } from 'vuex-pathify'
import TextFormat from '@/components/TextFormat.vue'
import walletDetail from './walletDetail.vue'
export default {
  components: { TextFormat, walletDetail },
  data() {
    return {
      tab: 'Wallet',
      coin: this.$route.params.coin,
    }
  },
  computed: {
    wallet: get('user/wallet'),
    account() {
      return this.wallet.find(p => this.coin == p.currency) || {}
    },
  },
  methods: {},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
