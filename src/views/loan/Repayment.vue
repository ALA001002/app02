<template>
  <div class="comp">
    <div class="big-title">{{ $t("extra.repayment") }}</div>
    <div class="mb-6" v-for="item in currentLoanData" :key="item.id">
      <div class="flex-between mb-24 line1">
        <img class="box32" src="@/assets/images/new/borrow_ing.svg">
        <div class="flex1 ml-2 text-17px"> {{$t('extra.inLending')}}</div>
        <div class="tr">
          <div class="text-16px"> {{item.amount}} USDT</div>
          <!-- <div class="text-11px text-mid mt-1"> ≈0.00USD</div> -->
        </div>
      </div>
      <div class="flex-between mb-24 line1">
        <img class="box32" src="@/assets/images/new/borrow_dollar.svg">
        <div class="flex1 ml-2 text-17px"> {{$t('extra.totalRepayment')}}</div>
        <div class="tr">
          <div class="text-16px">{{item.totalAmount}} USDT</div>
          <!-- <div class="text-11px text-mid mt-1"> ≈0.00USD</div> -->
        </div>
      </div>
      <div class="flex-between mb-24 line1">
        <img class="box32" src="@/assets/images/new/borrow_least.svg">
        <div class="flex1 ml-2 text-17px"> {{$t('extra.repaymentDate')}}</div>
        <div class="tr">
          <div class="text-16px  text-mid">{{item.paybackTime}}</div>
        </div>
      </div>
      <div class="flex-between mb-24 line1">
        <img class="box32" src="@/assets/images/new/borrow_hot.svg">
        <div class="flex1 ml-2 text-17px"> {{$t('extra.status')}}</div>
        <div class="tr">
          <div class="text-16px  green">{{$t("loan.loan-status")[item.status || 1] }}</div>
        </div>
      </div>
      <div class="big-btn radius" :disabled="item.isClick!==1" v-if="item.status===3 " @click="submit(item)">{{ $t("extra.repaymentText") }}</div>
    </div>
    <no-data v-if="!loading && !currentLoanData.length"></no-data>
    <van-popup v-model="popupDialog" get-container="body" closeable>
      <div class="popup-wrapper pb-5 radius-big" style="width:340px">
        <vue-qr ref="qr" v-if="address" :text="address" :size="220" class="qrimg"></vue-qr>
        <div class="address flex-center ">
          <div class="text-15px wb flex1 tc">
            {{address}}
          </div>
          <div class="flex ml-3 text-13px " v-copy="address">
            <i class="icon icon-fuzhi text-20px mr-1" />{{$t('extra.clickToCopy')}}
          </div>
        </div>
        <div class="flex px-5 pt-3">
          <div class="flex1">
            <div class="text-13px text-shallow">{{ $t("loan.total-loan") }}</div>
            <div class="text-20px flex mt-1"><span class="text-bold">{{ item.totalAmount || 0 }}</span> <small class="text-13px text-shallow ml-2">USDT</small></div>
          </div>
          <div class="flex1">
            <div class="text-13px text-shallow">{{ $t("loan.minReturn") }}</div>
            <div class="text-20px flex mt-1"> <span class="text-bold">{{ (item.totalAmount || 0) * loanInfo.minRepaymentRate/100.0 || 0 }}</span> <small class="text-13px text-shallow ml-2">USDT</small></div>
          </div>
        </div>
        <div class="tc text-14px text-shallow mt-5"> {{ $t("loan.loan_tip") }}</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import vueQr from 'vue-qr'
export default {
  components: {
    vueQr,
  },
  data() {
    return {
      loading: false,
      popupDialog: false,
      address: '',
      currentLoanData: [],
      item: {},
      loanInfo: {},
    }
  },
  created() {
    this.currentLoans()
    this.$http.get('/loans/getUserLoansInfo').then(data => {
      this.loanInfo = data
    })
  },
  methods: {
    setType() {},
    submit(item) {
      this.item = item
      this.$http
        .get('/asset/getWalletAddress?currency=USDT_TRC20')
        .then(data => {
          this.address = data
          this.popupDialog = true
        })
    },
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
.popup-wrapper {
  background: #fff;
  overflow: hidden;
  color: #333;
  .qrimg {
    display: block !important;
    margin: 50px auto 0;
  }
  .address {
    border-bottom: 1px solid #eee;
    margin: 0 30px;
    padding-bottom: 20px;
    line-height: 1.4;
  }
}
</style>