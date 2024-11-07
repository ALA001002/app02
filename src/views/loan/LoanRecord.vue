<template>
  <div class=" mt-1">
    <div class="big-title">{{$t('extra.loanRecord')}}</div>
    <div class="header flex text-shallow text-13px mb-3">
      <div class=" w-35">{{$t('wallet.coin')}}</div>
      <div class=" w-25">{{$t('wallet.num')}}</div>
      <div class=" flex1">{{$t('wallet.time')}}</div>
    </div>
    <div class="header flex text-deep line1 mb-5" v-for="item in currentLoanData" :key="item.id">
      <div class="w-35 flex">
        <img class="box20 mr-2" src="@/assets/images/new/USDT.svg">
        <span class="text-16px">USDT</span>
        <!-- <span class="text-16px">BTC<small class="text-12px text-shallow">/USDT</small></span> -->
      </div>
      <div class=" w-25  text-20px ">{{item.amount}}</div>
      <div class=" flex1 text-12px">{{item.createTime}}</div>
    </div>
    <no-data v-if="!loading && !currentLoanData.length"></no-data>
  </div>
</template>

<script>
export default {
  name: 'comp',
  data() {
    return {
      loading: false,
      currentLoanData: [],
    }
  },
  created() {
    this.currentLoans()
  },
  methods: {
    setType() {},
    currentLoans() {
      this.loading = true
      this.$http
        .get('/loans/getCurrentLoans', {})
        .then(data => {
          this.currentLoanData = data
        })
        .finally(() => (this.loading = false))
    },
  },
}
</script>

<style scoped lang="scss">
</style>