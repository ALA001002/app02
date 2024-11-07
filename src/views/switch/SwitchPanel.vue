<template>
  <layout>
    <navBar back></navBar>
    <div class="section has-background-white mb-2">
      <div class="page-title">{{$t('app.switch')}}</div>
      <div class="flex-between card-bg radius-small mt-2 px-3 py-4">
        <div class="flex" @click="showFormList=true">
          <coinImg class="box20" :coin="form.from"></coinImg>
          <span class="ml-2 mr-4 text-16px">{{form.from}}</span>
          <van-icon name="arrow-down"></van-icon>
        </div>
        <van-icon class-prefix="icon" class="mx-3" name="qiehuan" @click="sw" />
        <div class=" flex" @click="showToList=true">
          <coinImg class="box20" :coin="form.to"></coinImg>
          <span class="ml-2 mr-4 text-16px">{{form.to}}</span>
          <van-icon name="arrow-down"></van-icon>
        </div>
      </div>
      <!-- 汇率 -->
      <div class="mt-2 text-12px text-shallow">
        {{$t('wallet.rate')}}: <span class="text-primary">{{rateName}}</span>
      </div>
      <div class="card-bg flex-between text-16px py-4 mt-4">
        <input v-model="form.amount" class="flex1" style="height:34px" type="number" :placeholder="$t('wallet.enterNum')">
        <div class="flex no-wrap">
          <span class="text-shallow"> {{form.from}}</span> <span class="text-primary ml-3" @click="form.amount=fromWallet.balance">{{$t('wallet.all')}}</span>
        </div>
      </div>

      <div class="flex-between text-13px text-shallow">
        <p>{{$t('exchange.balance')}}: {{fromWallet.balance}} {{fromWallet.currency}}</p>
        <p>{{$t('wallet.anticipate')}}: {{toNum}} {{toWallet.currency}}</p>
      </div>
      <div class="mt-4 big-btn radius" :disabled="form.amount < data[form.from+'Min']" @click="sub">{{$t('wallet.submit')}}</div>
      <!-- <div class="html-content mt-2" v-html="remark" /> -->
    </div>
    <van-action-sheet v-model="showFormList" :actions="formList" :cancel-text="$t('app.cancel')" close-on-click-action @select="formSelect" />
    <van-action-sheet v-model="showToList" :actions="toList" :cancel-text="$t('app.cancel')" close-on-click-action @select="toSelect" />
    <DialogSuccess ref="DialogSuccess" :text="$t('extra.submitSuccess')"></DialogSuccess>
  </layout>
</template>

<script>
import { get } from 'vuex-pathify'
import { Dialog } from 'vant'
export default {
  data() {
    return {
      data: {},
      remark: null,
      showFormList: false,
      showToList: false,
      form: {
        from: 'ETH',
        to: 'USDT',
        amount: null,
      },
    }
  },
  created() {
    this.load()
    this.form.from = this.$route.query.from || 'ETH'
    this.form.to = this.$route.query.to || 'USDT'
  },
  computed: {
    userWallet: get('user/wallet'),
    wallet() {
      return this.userWallet.filter(p => p.supExchange === 1)
    },
    hq: get('hq/hq'),
    fromWallet() {
      return this.wallet.find(p => this.form.from == p.currency) || {}
    },
    toWallet() {
      return this.wallet.find(p => this.form.to == p.currency) || {}
    },
    rate() {
      if (this.form.from != 'USDT') {
        var hqFrom = this.hq.find(p => p.from == this.form.from) || {}
        if (this.data[this.form.from.toLowerCase()]) {
          hqFrom = this.data[this.form.from.toLowerCase()]
        }
        return this.toNumber(hqFrom.price)
      } else {
        var hqTo = this.hq.find(p => p.from == this.form.to) || {}
        if (this.data[this.form.to.toLowerCase()]) {
          hqTo = this.data[this.form.to.toLowerCase()]
        }
        return this.toNumber(1 / hqTo.price)
      }
    },
    rateName() {
      return `1 ${this.form.from} ≈ ${this.rate} ${this.form.to}`
    },
    toNum() {
      var feeRate = this.data.feeRate
      var name =
        this.form.from !== 'USDT'
          ? this.form.from.toLowerCase()
          : this.form.to.toLowerCase()
      if (this.data[name]) feeRate = this.data[name].feeRate
      return this.toNumber((1 - feeRate) * this.rate * this.form.amount)
    },
    formList() {
      return this.wallet
        .filter(p => p.currency != 'DIEM')
        .map(p => {
          return {
            name: p.currency,
          }
        })
    },
    toList() {
      var list
      if (this.form.from == 'USDT') {
        list = this.wallet
          .filter(p => p.currency != 'DIEM')
          .filter(p => p.currency != 'USDT')
      } else {
        list = this.wallet
          .filter(p => p.currency != 'DIEM')
          .filter(p => p.currency == 'USDT')
      }
      return list.map(p => {
        return {
          name: p.currency,
        }
      })
    },
  },
  methods: {
    load() {
      this.$http.get('common/getExchangeInfo').then(data => (this.data = data))
      this.$http
        .get('common/getSysArticle?key=sd')
        .then(data => (this.remark = data.content))
    },
    sub() {
      Dialog.confirm({ title: this.$t('wallet.confirmSwitch') }).then(() => {
        this.$http.post('asset/quickExchange', this.form).then(() => {
          // Toast.success()
          this.form.amount = null
          this.$refs.DialogSuccess.show()
          this.load()
        })
      })
    },
    sw() {
      var tmp = this.form.from
      this.form.from = this.form.to
      this.form.to = tmp
    },
    formSelect(action) {
      this.form.from = action.name
      this.$nextTick(() => {
        this.form.to = this.toList[0].name
      })
    },
    toSelect(action) {
      this.form.to = action.name
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.input {
  border: 1px solid #f4f5f6;
  border-radius: 2px;
}
.card-bg {
  background: #18171c !important;
}
.disable {
  background-color: #f4f5f6;
  ::v-deep {
    .van-cell__title {
      color: #aaaaaa;
    }
    .van-field__control {
      text-align: right;
    }
  }
}
.sw-btn {
  ::v-deep {
    .van-button__content {
      justify-content: space-between;
      &::after {
        font-family: 'icon' !important;
        align-items: center;
        display: inline-flex;
        justify-content: center;
        content: '\e622';
        font-size: 8px;
        color: #aaaaaa;
      }
    }
  }
}
</style>
