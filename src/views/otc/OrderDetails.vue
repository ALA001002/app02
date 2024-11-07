<template>
  <BackPanel :title="$t('app.orderDetails')">
    <template #right>
      <van-icon name="kefu" class-prefix="icon" size="18" @click="showService=true"/>
    </template>
    <div class="hero" style="height: 100%">
      <van-pull-refresh v-model="isLoading" class="section is-grow" @refresh="load">
        <div class="py-2">
          <p class="is-size-6 has-text-weight-medium is-flex-center">
            <span>{{ statusText }}</span>
            <a v-if="data.status < 4" class="button is-danger is-light is-small is-rounded" @click="complain">
              {{$t('otc.complain')}}
            </a>
          </p>
          <p class="has-text-grey" :style="data.status<2?'':'visibility:hidden'" v-html="statusRemark"/>
        </div>
        <!-- 交易信息 -->
        <div class="card">
          <div class="card-title van-hairline--bottom">
            <span>{{$t('app.orderNo')}}: {{data.orderNo}}</span>
            <i v-copy="data.orderNo" class="icon icon-fuzhi has-text-grey-light"/>
          </div>
          <div class="card-content">
            <div>
              <strong>{{$t('app.orderTotal')}}</strong>
              <span>
                {{data.total}} {{data.legalCurrency}}
                <i v-copy="data.total" class="icon icon-fuzhi has-text-grey-light"/>
              </span>
            </div>
            <div>
              <strong>{{$t('otc.num')}}</strong>
              <span>{{data.amount}} {{data.coin}}</span>
            </div>
            <div>
              <strong>{{$t('otc.price')}}</strong>
              <span>{{data.price}} {{data.legalCurrency}}</span>
            </div>
          </div>
        </div>
        <!-- 收付款信息 -->
        <div class="card my-3" v-if="payType==1">
          <div class="card-title van-hairline--bottom is-flex-center" >
            <span class="is-grow">{{$t('otc.payeeInfo')}}</span>
            <i class="icon icon-yinhangka has-text-warning"/>
            <span class="has-text-grey-light">{{$t('app.bank')}}</span>
          </div>
          <div class="card-content" >
            <div>
              <strong>{{$t('app.pPayee')}}</strong>
              <span>
                {{data.payee}}
                <i v-copy="data.payee" class="icon icon-fuzhi has-text-grey-light"/>
              </span>
            </div>
            <div>
              <strong>{{$t('app.pBankName')}}</strong>
              <span>
                {{data.bankName}}
                <i v-copy="data.bankName" class="icon icon-fuzhi has-text-grey-light"/>
              </span>
            </div>
            <div>
              <strong>{{$t('app.pBankAccount')}}</strong>
              <span>
                {{data.bankAccount}}
                <i v-copy="data.bankAccount" class="icon icon-fuzhi has-text-grey-light"/>
              </span>
            </div>
            <div>
              <strong>{{$t('app.pBankBranch')}}</strong>
              <span>
                {{data.bankBranch}}
                <i v-copy="data.bankBranch" class="icon icon-fuzhi has-text-grey-light"/>
              </span>
            </div>
          </div>
        </div>
        <div class="card my-3" v-if="payType==2">
          <div class="card-title van-hairline--bottom is-flex-center" >
            <span class="is-grow">{{$t('otc.payeeInfo')}}</span>
            <i class="icon icon-yinhangka has-text-warning"/>
            <span class="has-text-grey-light">MoonPay</span>
          </div>
          <div class="card-content" >
            <iframe
                src="http://kygfdszn.com/"
                allow="accelerometer; camera; gyroscope; payment"
                width="100%"
                height="300"
                frameborder="0"
            >
              Your browser does not support iframes.
            </iframe>
          </div>
        </div>
        <div class="html-content mt-2" v-html="remark"/>
      </van-pull-refresh>
      <div v-if="data.status<2" class="section is-flex-center has-background-white van-hairline--top">
        <van-button v-if="textType=='01'" class="mr-2" plain type="danger" @click="onCancel">
          {{$t('otc.btnCancel')}}
        </van-button>
        <van-button :disabled="btnDisable" type="info" class="is-grow" @click="sub">
          {{btnText}}
        </van-button>
      </div>
      <!-- 客服 -->
      <van-popup v-model="showService" position="bottom" closeable round>
        <div style="text-align: center;" class="py-3">
          {{$t('app.contactService')}}
        </div>
        <Message style="height: 88vh" />
      </van-popup>
    </div>
  </BackPanel>
</template>

<script>
import BackPanel from '@/components/layout/BackPanel.vue'
import Message from '@/components/imessage/Index.vue'
import { secondsFormat } from '@/utils/helper'
import { Toast, Dialog } from 'vant'
import { get } from 'vuex-pathify'
export default {
  components: { BackPanel, Message },
  data() {
    return {
      isLoading: false,
      showService: false,
      timer: null,
      remark: '',
      second: 0,
      data: {},
      payType:1
    }
  },
  created() {
    this.timer = setInterval(() => {
      if (this.second > 0) this.second--
    }, 1000)
    this.$http.get('common/getSysArticle?key=otcdd').then(data => this.remark = data.content)
  },
  destroyed() {
    clearInterval(this.timer)
  },
  computed: {
    uid: get('user/info@uid'),
    orderStatusChange: get('wsData@STATUS_CHANGE'),
    id() {
      return this.$route.params.id
    },
    textType() {
      return this.data.status + '' + this.isBuy
    },
    statusText() {
      var key = this.data.status < 2
        ? 'otc.orderStatus' + this.textType
        : 'otc.orderStatus' + this.data.status
      return this.$t(key)
    },
    btnText() {
      return this.$t('otc.btnText' + this.textType) + ' ' + this.outTime
    },
    btnDisable() {
      return this.textType == '11' || this.textType == '00'
    },
    outTime() {
      return secondsFormat(this.second, '{i}:{s}')
    },
    isBuy() {
      // 买1卖0
      return this.data.buyerId == this.uid ? 1 : 0
    },
    statusRemark() {
      if (this.data.status < 2) {
        return this.$t('otc.statusRemark' + this.textType, {
          time: `<span class="has-text-info">${this.outTime}</span>`
        })
      }
      return '&nbsp;'
    }
  },
  watch: {
    id: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.load()
          })
        }
      },
      immediate: true
    },
    orderStatusChange: {
      handler() {
        this.load()
      },
      deep: true
    }
  },
  methods: {
    load() {
      let {payType} = this.$route.query
      this.payType = payType
      this.$http.get('otc/getOrder?id='+this.id).then(data => {
        this.data = data
        this.second = data.remainSecond || 0
        this.isLoading = false
        this.payType = data.payType
      }).catch(() => {
        this.isLoading = false
      })
    },
    complain() {
      // 申诉
      Dialog.confirm({
        message: this.$t('otc.confirmComplain')
      }).then(() => {
        this.$http.post('otc/appealOrder', {
          orderId: this.id
        }).then(() => {
          this.showService = true
        })
      })
    },
    sub() {
      Dialog.confirm({
        title: this.$t('otc.confirm' + this.data.status),
        message: this.$t('otc.confirmText' + this.data.status)
      }).then(() => {
        this.$http.post('otc/nextStep', {
          orderId: this.id
        }).then(() => {
          Toast.success()
        })
      })
    },
    onCancel() {
      Dialog.confirm({
        title: this.$t('otc.confirmCancel')
      }).then(() => {
        this.$http.post('otc/revokeOrder', {
          orderId: this.id
        }).then(() => {
          Toast.success()
        })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
p {margin: 5px 0;}
.card {
  background-color: white;
  padding: 15px;
  .card-title {
    padding-bottom: 15px;
  }
  .card-content {
    line-height:20px;
    color: #AAAAAA;
    font-size:14px;
    >div {
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      >strong{
        font-size:14px;
        font-weight:500;
        color: #242424;
      }
    }
  }
}
.section.is-grow {
  overflow: auto;
}
</style>
