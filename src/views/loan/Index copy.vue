<template>
  <Layout>
    <NavBar back></NavBar>
    <div class="image-banner">
      <div class="desc">
        {{ $t("loan.loan-desc") }}
      </div>
    </div>
    <van-tabs ref="tab" v-model="tabIndex" :title-active-color="tabActiveColor" :title-inactive-color="tabInActiveColor" :lazy-render="true" :color="tabActiveColor" :line-width="'45%'" :line-height="2" class="is-grow" background="transparent">
      <van-tab name="1" :title="$t('loan.get')">
        <div class="select-group">
          <van-cell-group :title='$t("loan.get")'>
            <van-field v-model="data.loansAmount" :placeholder="$t('loan.inputAmount')"></van-field>
            <van-cell class="loan-tip-info">{{ loanInfo.minAmount }} USDT≤{{ $t('loan.num') }}≤ {{ loanInfo.maxAmount }}
              USDT
            </van-cell>
          </van-cell-group>
        </div>
        <div class="select-group">
          <van-cell-group :title='$t("loan.time")'>
            <van-cell is-link @click="showTimeAction" arrow-direction="down">
              {{ data.loansNumber ? data.loansNumber : $t('loan.select') }}
            </van-cell>
          </van-cell-group>
        </div>
        <van-panel style="margin-top:10px" :title='$t("loan.returnInfo")'>
          <div>
            <div class="list-item">
              <span>{{ $t("loan.totalLx") }}</span>
              <span>{{ data.loansNumber * loanInfo.interest/100.0 * data.loansAmount }} USDT</span>
            </div>
            <div class="list-item">
              <span>{{ $t("loan.totalReturn") }}</span>
              <span>
                {{ +(data.loansNumber * loanInfo.interest/100.0 * data.loansAmount)+(+data.loansAmount) }} USDT
              </span>
            </div>
            <div class="list-item">
              <span>{{ $t("loan.minReturn") }}</span>
              <span>
                {{ +((data.loansNumber * loanInfo.interest/100.0 * data.loansAmount)+(+data.loansAmount)) * loanInfo.minRepaymentRate/100.0 }} USDT
              </span>
            </div>
          </div>
        </van-panel>
        <div style="text-align: center;background: white;padding-top: 10px">
          <van-button class="loan-btn" @click="startLoan">{{ $t("loan.get") }}</van-button>
        </div>
      </van-tab>
      <van-tab name="2" :title="$t('loan.current')">
        <van-panel v-for="item in currentLoanData" v-bind:key="item.id">
          <div class="item-cell">
            <div class="item-cell-data">
              <div class="item-cell-data-title">
                {{ $t("loan.in-progress-loan") }}
              </div>
              <div class="item-cell-data-content">
                {{ item.amount || 0 }} USDT
              </div>
            </div>
            <div class="item-cell-data">
              <div class="item-cell-data-title">
                {{ $t("loan.total-loan") }}
              </div>
              <div class="item-cell-data-content">
                {{ item.totalAmount || 0 }} USDT
              </div>
            </div>
          </div>
          <div class="item-cell">
            <div class="item-cell-data">
              <div class="item-cell-data-title">
                {{ $t("loan.in-progress-loan-time") }}
              </div>
              <div class="item-cell-data-content">
                {{ (item.paybackTime || '-') }}
              </div>
            </div>
            <div class="item-cell-data item">
              <div class="item-cell-data-title">
                {{ $t("loan.total-loan-status") }}
              </div>
              <div class="item-cell-data-content" style="color:green;">
                {{ $t("loan.loan-status")[item.status || 1] }}
              </div>
            </div>
          </div>
          <div class="item-cell" style="text-align:center" v-if="item.status===3">
            <div class="item-cell-data">
              <div class="item-cell-data-title">
                {{ $t("loan.paidBack") }}:{{ item.repaidAmount }}USDT
              </div>
            </div>
          </div>
          <div class="item-cell" style="text-align:center" v-if="item.status===3">
            <div class="item-cell-data">
              <div class="item-cell-data-title">
                {{ $t("loan.minReturn") }}:{{ (item.totalAmount || 0) * loanInfo.minRepaymentRate/100.0}}USDT
              </div>
            </div>
          </div>
          <div class="item-cell" style="text-align:center" v-if="item.status===3">
            <div class="item-cell-data">
              <div class="item-cell-data-title">
                {{ $t("loan.loan_tip") }}
              </div>
            </div>
          </div>

          <div style="text-align: center;background: white" v-if="item.status===3">
            <van-button class="loan-return-btn" style="background: #0000ff" v-if="item.isClick == 1" @click="()=>returnAction(item)">{{ $t("loan.returnBtn") }}</van-button>
            <van-button class="loan-return-btn" style="background: #aaaaaa" v-else>{{ $t("loan.returnBtn") }}</van-button>
          </div>
        </van-panel>
      </van-tab>
    </van-tabs>
    <van-popup v-model="showTimeSelect" closeable position="bottom">
      <van-list finished-text="Finished">
        <van-cell @click="()=>selectItem(item)" style="text-align: center" v-for="item in loanInfo.numberList" :key="item" :title="item" center />
      </van-list>
    </van-popup>
    <van-popup v-model="showReturnCode">
      <div>
        <div>
          <vue-qr :text="walletReturnAddress" :size="300" class="rect"></vue-qr>
        </div>
        <div v-copy class="address" :size="300">{{walletReturnAddress}}<i class="icon icon-fuzhi" /></div>
        <div style="text-align:center">{{ $t("loan.total-loan") }}: {{ curr.totalAmount || 0 }} USDT</div>
        <div style="text-align:center">{{ $t("loan.minReturn") }}: {{ (curr.totalAmount || 0) * loanInfo.minRepaymentRate/100.0 || 0 }} USDT</div>
        <div style="text-align:center"> {{ $t("loan.loan_tip") }}</div>
      </div>
    </van-popup>
  </Layout>
</template>
<script>
import BackPanel from '@/components/layout/BackPanel.vue'
import { Toast } from 'vant'
import vueQr from 'vue-qr'

export default {
  components: { BackPanel, vueQr },
  data() {
    return {
      collaseIndex: 1,
      showReturnCode: false,
      // timeSelectList: [30, 60, 90],
      showTimeSelect: false,
      tabIndex: 2,
      tabActiveColor: '#367DFC',
      tabInActiveColor: '#666666',
      form: {
        totalLx: 0,
        totalReturn: 0,
      },
      walletReturnAddress: null,
      currentLoanData: [],
      data: {
        loansAmount: null,
        loansNumber: null,
        thresholdId: null,
      },
      loanInfo: {
        numberList: [],
        minAmount: 0,
        maxAmount: 0,
        interest: 1,
        minRepaymentRate: 0,
      },
      curr: {
        id: null,
        amount: null,
        totalAmount: null,
        paybackTime: null,
        status: null,
        statusStr: '',
      },
      nowDateTime: null,
    }
  },
  watch: {
    tabIndex(val) {
      if (val == 2) {
        this.currentLoans()
      }
    },
  },
  created() {
    this.$http.get('/loans/getUserLoansInfo').then(data => {
      this.loanInfo = data
      this.data.thresholdId = data.thresholdId
    })
    this.currentLoans()
    this.nowDateTime = new Date()
    console.log(this.nowDateTime)
  },
  methods: {
    selectItem(data) {
      this.data.loansNumber = data
      this.showTimeSelect = false
    },
    startLoan() {
      const { thresholdId, loansAmount, loansNumber } = this.data
      this.$http
        .post('/loans/applyLoans', {
          thresholdId,
          loansAmount,
          loansNumber,
        })
        .then(data => {
          if (data.code === 200) {
            Toast.success(this.$t('loan.success'))
          } else {
            Toast.fail(data.msg)
          }
        })
    },
    currentLoans() {
      this.$http.get('/loans/getCurrentLoans', {}).then(data => {
        this.currentLoanData = data
      })
    },
    getWalletAddressAction(curr) {
      const self = this
      this.$http
        .get('/asset/getWalletAddress?currency=USDT_TRC20', {})
        .then(data => {
          let result = data
          this.walletReturnAddress = result
          self.curr = curr
          self.showReturnCode = true
        })
    },
    async returnAction(curr) {
      await this.getWalletAddressAction(curr)
    },
    showTimeAction() {
      this.showTimeSelect = true
    },
  },
}
</script>
<style lang="scss" scoped>
.address {
  border-radius: 4px;
  padding: 10px 15px;
  margin-top: 10px;
  word-wrap: break-word;
  width: 250px;
  text-align: center;
}
.image-banner {
  background: url('../../assets/images/loan/banner@2x.jpg') no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 240px;
  padding-top: 1px;

  .desc {
    font-size: 23px;
    font-weight: bold;
    width: 233px;
    margin: 62px auto 0 auto;
    color: white;
    line-height: 35px;
    text-align: center;
  }
}

.loan-btn,
.loan-return-btn {
  width: 92%;
  background: #367dfc;
  border-radius: 8px;
  margin: 0 auto;

  &.van-button--default {
    background-color: #367dfc;
    color: white;
  }
}

.van-panel__content {
  padding: 0.53333rem 0.85333rem;
  color: #999;
}

.list-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  span:first-child {
    flex: 1;
  }
}

.van-cell-group__title {
  color: #333 !important;
}

.select-group {
  background: white;
  margin-top: 10px;

  .van-cell__value {
    color: #888;
  }
}

.item-cell {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  //margin-top: 15px;
  margin-bottom: 15px;

  .item-cell-data {
    padding: 10px;
    flex: 1;
    background: #f8fafe;
    border-radius: 4px;

    .item-cell-data-title {
      color: #999;
      font-size: 13px;
    }

    .item-cell-data-content {
      font-size: 16px;
      color: #000;
    }

    &.item:last-child {
      margin-left: 15px;
    }
  }
}

//.loan-return-btn {
//  background: #AAAAAA !important;
//}

.van-cell::after {
  border: none !important;
}

.van-tab {
  background: white !important;
}

.loan-tip-info {
  padding-top: 0;
  padding-bottom: 0;
  font-size: 8px;
}
</style>
