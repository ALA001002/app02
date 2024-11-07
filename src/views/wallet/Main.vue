<template>
  <BackPanel :title="$t('wallet.deposit')">
    <van-cell
        v-for="item in pages"
        :key="item.address"
        :title="$t(item.title)"
        :to=item.address
        is-link
    />
  </BackPanel>
</template>

<script>
import BackPanel from '@/components/layout/BackPanel.vue'
export default {
  data(){
    return {
      pages:[
        {title:'wallet.wallet_address',address:'/wallet/deposit'},
        // {title:'wallet.manualRecharge',address:'/wallet/manualRecharge'},
        // {title:'wallet.expressway',address:'/expressway'},
        {title:'wallet.wire_transfer',address:'/iframe/1'},
        // {title:'wallet.support_platform',address:'/walletPage/exchangeAddress'}
      ]
    }
  },
  components: { BackPanel }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
