<template>
  <div class="recharge-ecord">
    <van-tabs type="card" animated show-header no-padding>
      <van-tab :title="$t('wallet.walletLog')">
        <Wallet :coin="coin" style="height: 100%; overflow: auto; padding-top:15px;" />
      </van-tab>
      <van-tab :title="$t('wallet.assetLog')">
        <Asset :coin="coin" style="height: 100%; overflow: auto; padding-top:15px;" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { get } from 'vuex-pathify'
import Wallet from '@/components/details/Wallet.vue'
import Asset from '@/components/details/Asset.vue'
export default {
  components: { Wallet, Asset },
  data() {
    return {
      select: 'Wallet',
    }
  },
  computed: {
    wallet: get('user/wallet'),
    coin() {
      return this.$route.params.coin
    },
    account() {
      return this.wallet || {}
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
