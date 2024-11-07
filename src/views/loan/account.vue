<template>
  <div class=" flex1 flex-column">
    <van-tabs class="section" v-model="tab" type="card" animated show-header no-padding>
      <van-tab :title="$t('extra.loan')">
      </van-tab>
      <van-tab :title="$t('extra.repayment')">
      </van-tab>
      <van-tab :title="$t('extra.loanRecord')">
      </van-tab>
    </van-tabs>
    <div class="flex1 y-auto section">
      <Loan v-if="tab===0"></Loan>
      <Repayment v-else-if="tab===1"></Repayment>
      <LoanRecord v-else></LoanRecord>
    </div>
  </div>
</template>

<script>
import Loan from '@/views/loan/Loan.vue'
import Repayment from '@/views/loan/Repayment.vue'
import LoanRecord from '@/views/loan/LoanRecord.vue'
export default {
  name: 'account',
  components: {
    Loan,
    Repayment,
    LoanRecord,
  },
  data() {
    return {
      tab: 0,
    }
  },
}
</script>

<style scoped lang="scss"></style>