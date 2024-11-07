<template>
  <img v-if="upDown" :src="upDown>3? DOWN :  UP">
  <img v-else :src="imgs[coinName] || imgs.OTHER">
</template>

<script>
import BTC from '@/assets/images/new/BTC.svg'
import USDT from '@/assets/images/new/USDT.svg'
import ETH from '@/assets/images/new/ETH.svg'
import OTHER from '@/assets/images/new/OTHER_COIN.svg'
import UP from '@/assets/images/new/up.svg'
import DOWN from '@/assets/images/new/down.svg'
export default {
  name: 'coin-img',
  props: {
    coin: {
      type: String,
      default: 'USDT',
    },
    upDown: {
      type: [Boolean, Number],
      default: false,
    }, // 1,2 冲 3，4 提
  },
  computed: {
    coinName() {
      if (!this.coin) {
        return 'OTHER'
      }
      if (this.coin.includes('/')) {
        return this.coin.split('/')[0].toUpperCase()
      }
      if (this.coin.includes('_')) {
        return this.coin.split('_')[0].toUpperCase()
      }
      return this.coin.toUpperCase()
    },
  },
  data() {
    return { UP, DOWN, imgs: { BTC, USDT, ETH, OTHER } }
  },
}
</script>

<style scoped lang="scss">
</style>
