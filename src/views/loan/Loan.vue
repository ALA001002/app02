<template>
  <div class="comp">
    <div class="big-title">{{ $t("extra.loan") }}</div>
    <!-- <div class="form-item flex mt-0" @click="$refs.selectCoin.popup()">
      <div class="flex1">
        <div class="label">{{$t('extra.loanType')}}</div>
        <div class="value" v-if="form.type">{{form.type}}</div>
        <div class="not-value" v-else>{{$t('extra.chooseType')}}</div>
      </div>
      <van-icon name="arrow"></van-icon>
    </div> -->
    <div class="form-item mt-0">
      <div class="label">{{$t('extra.loanNum')}}</div>
      <input class="value" v-model="form.loansAmount" type="number" :placeholder="`${$t('extra.loanNumHolder')} ${minAmount} ≤${$t('wallet.num')}≤ ${maxAmount} USDT`">
    </div>
    <div class=" form-item flex" @click="showActionSheet=true">
      <div class="flex1">
        <div class="label">{{$t('extra.loanLimit')}}</div>
        <div class="value" v-if="form.loansNumber">{{form.loansNumber}}</div>
        <div class="not-value" v-else>{{$t('extra.chooseLimit')}}</div>
      </div>
      <van-icon name="arrow"></van-icon>
    </div>
    <div class="flex-between mt-2">
      <span class="text-shallow text-12px">{{ $t("loan.totalLx") }}: {{ form.loansNumber * interest/100.0 * form.loansAmount }}USDT</span>
      <span class="text-shallow text-12px">{{ $t("loan.totalReturn") }}: {{ +(form.loansNumber * interest/100.0 * form.loansAmount)+(+form.loansAmount) }} USDT</span>
    </div>
    <div class="big-btn mt-4" @click="apply">{{ $t("extra.loan") }}</div>
    <van-action-sheet get-container="body" v-model="showActionSheet" :cancel-text="$t('extra.cancel')" close-on-click-action :actions="numberList" @select="onSelect" />
    <SelectCoinVue ref="selectCoin" @select="setType" :title="$t('extra.loanType')"></SelectCoinVue>
  </div>
</template>

<script>
import SelectCoinVue from '@/components/SelectCoin.vue'
import { Toast } from 'vant'
export default {
  name: 'loan',
  components: {
    SelectCoinVue,
  },
  data() {
    return {
      typeModel: false,
      showActionSheet: false,
      numberList: [],
      form: {
        type: '',
        loansAmount: '',
        loansNumber: '',
        thresholdId: '',
      },
      minAmount: 0,
      maxAmount: 0,
      minRepaymentRate: 0,
      interest: 0,
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.$http.get('/loans/getUserLoansInfo').then(data => {
        // console.log(data)
        this.numberList = data.numberList.map(name => ({ name }))
        this.minAmount = data.minAmount
        this.maxAmount = data.maxAmount
        this.interest = data.interest
        this.minRepaymentRate = data.minRepaymentRate
        this.form.thresholdId = data.thresholdId
        // this.loanInfo = data
        // this.data.thresholdId = data.thresholdId
      })
    },
    apply() {
      if (!this.form.loansAmount) return Toast(this.$t('extra.loanNum'))
      if (!this.form.loansNumber) return Toast(this.$t('extra.loanLimit'))
      this.$http.post('/loans/applyLoans', this.form).then(data => {
        if (data.code === 200) {
          Toast.success(this.$t('loan.success'))
        } else {
          Toast.fail(data.msg)
        }
      })
    },
    setType(coin) {
      this.form.type = coin
    },
    onSelect(item) {
      this.form.loansNumber = item.name
    },
  },
}
</script>
