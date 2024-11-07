<template>
  <router-link tag="div" class="has-background-white mt-1 has-text-grey" style="font-family:PingFangSC-Regular,PingFang SC;" to="">
    <div class="section is-flex-center van-hairline--bottom">
      <span>{{ parseTime(data.buyTime, '{m}-{d} {h}:{i}') }}</span>
      <span v-copy>{{ data.orderNo }} <i class="icon icon-fuzhi"/></span>
    </div>
    <div class="section">
      <div class="mb-2 has-text-dark is-flex-center">
        <div class="is-grow">
          <span :style="{color: data.tradeType == '1' ? '#2DBC8C' : '#EB616E'}">
            {{ data.tradeType == '1' ? $t('exchange.long') : $t('exchange.short') }}
          </span>
          <strong> {{ data.symbolName }} </strong>
          <span> {{ data.contractMultiple }}X </span>
        </div>
        <div>{{ statusName }}</div>
      </div>
      <div class="mb-2">
        {{ (data.status > 0 ? $t('order.profit') : $t('order.nProfit'))  + '(' + data.currency }}):
        <TextFormat :text="profit" :float="profit"/>
        (<TextFormat :text="profitChange" :float="profit" isFormat/>)
      </div>
      <div class="columns is-mobile mt-0 mb-1">
        <div class="column">
          <p>{{$t('order.buyPrice')}}</p>
          <p class="title is-6">{{data.buyPrice}}</p>
        </div>
        <div class="column">
          <p>{{data.status > 0 ? $t('order.sellPrice') : $t('order.nowPrice')}}</p>
          <p class="title is-6">{{data.status > 0 ? data.sellPrice : hqData.price}}</p>
        </div>
      </div>
      <div v-if="data.status==0" class="columns is-mobile mt-0 mb-1">
        <div class="column">
          <p>{{$t('order.total')}}</p>
          <p class="title is-6">{{toNumber(total)}}</p>
        </div>
        <div class="column">
          <p>{{$t('order.predictPrice')}}</p>
          <p class="title is-6">{{data.predictPrice}}</p>
        </div>
      </div>
      <!-- 杂项 -->
      <div class="columns is-mobile is-small mt-0 mb-1">
        <div class="column">
          <p v-if="data.status>0" class="is-flex-center">
            <span class="is-grow">{{$t('order.total')}}</span>
            <span class="is-grow">{{toNumber(total)}}</span>
          </p>
          <p class="is-flex-center">
            <span class="is-grow">{{$t('order.money')}}</span>
            <span class="is-grow">{{data.money}}</span>
          </p>
          <p class="is-flex-center">
            <span class="is-grow">{{$t('order.capitalFee')}}</span>
            <span class="is-grow">{{data.capitalFee}}</span>
          </p>
          <p class="is-flex-center">
            <span class="is-grow">{{$t('order.fee')}}</span>
            <span class="is-grow">{{data.fee}}</span>
          </p>
        </div>
        <div class="column">
          <p v-if="data.status>0" class="is-flex-center">
            <span class="is-grow">{{$t('order.sellTime')}}</span>
            <span class="is-grow">{{parseTime(data.sellTime, '{m}-{d} {h}:{i}')}}</span>
          </p>
          <p class="is-flex-center">
            <span class="is-grow">{{$t('order.replenish')}}</span>
            <span class="is-grow">{{data.replenish}}</span>
          </p>
          <p class="is-flex-center">
            <span class="is-grow">{{$t('order.stopSurplus')}}</span>
            <span class="is-grow">{{data.stopSurplus||'-'}}</span>
          </p>
          <p class="is-flex-center">
            <span class="is-grow">{{$t('order.stopLoss')}}</span>
            <span class="is-grow">{{data.stopLoss||'-'}}</span>
          </p>
        </div>
      </div>
      <!-- 按钮 -->
      <div class="buttons">
        <button v-if="data.status == 0" class="button is-small is-link is-light is-grow" @click="close">{{$t('order.sell')}}</button>
        <button v-if="data.status == 0" class="button is-small is-link is-light is-grow" @click="showReplenish=true">{{$t('order.doReplenish')}}</button>
        <button v-if="data.status == 0" class="button is-small is-link is-light is-grow" @click="showSet=true">{{$t('order.setting')}}</button>
        <button class="button is-small is-link is-light" :class="{'is-grow':data.status>0}" @click="showShare=true"><i class="icon icon-fenxiang"/></button>
      </div>
    </div>
    <!-- 设置 -->
    <van-popup v-if="data.status == 0" v-model="showSet" position="bottom" safe-area-inset-bottom>
      <ContractSet :data="hqData" :form="data" :stopInfo="stopInfo" @sub="setSub" class="contract-set"/>
    </van-popup>
    <!-- 补仓 -->
    <van-popup ref="replenish" v-if="data.status == 0" v-model="showReplenish" position="bottom" safe-area-inset-bottom>
      <ContractReplenish :data="hqData" :form="data" @sub="replenishSub"/>
    </van-popup>
    <!-- 分享 -->
      <van-share-sheet v-model="showShare" :options="shareOptions" :title="$t('invite.shareNow')" get-container="body" @select="shareSelect">
        <template #description>
          <div ref="shareImg" class="share-panel hero">
            <div class="is-grow is-flex-center" style="justify-content: center; flex-direction: column;">
              <div class="yk-image">
                <img :src="require(`@/assets/images/base64/yk${shareIndex}.png`)" />
              </div>
              <div class="mt-3"><strong class="is-size-6">{{$t('order.shareText'+shareIndex)}}</strong></div>
            </div>
            <p class="title"><TextFormat :text="profitChange" :float="profit" isFormat/></p>
            <div class="section mb-4 is-flex-center">
              <div class="has-text-left">
                <p><strong>{{data.symbolName}}</strong></p>
                <span class="tag " :class="data.tradeType == '1' ? 'is-primary' : 'is-danger'">
                  {{data.tradeType == '1' ? $t('exchange.long') : $t('exchange.short')}}
                </span>
              </div>
              <div class="is-grow has-text-centered dq">
                <p><strong>{{data.buyPrice}}</strong></p>
                <span class="has-text-weight-light">{{$t('order.buyPrice')}}</span>
              </div>
              <div class="has-text-right dq">
                <p><strong>{{data.status > 0 ? data.sellPrice : hqData.price}}</strong></p>
                <span class="has-text-weight-light">{{data.status > 0 ? $t('order.sellPrice') : $t('order.nowPrice')}}</span>
              </div>
            </div>
            <div class="share-content is-flex-center">
<!--              <img :src="require('@/assets/images/base64/logo.png')" class="mr-2"/>-->
              <div class="is-grow">
                <strong>BIGO</strong>
                <div class="mt-2 has-text-weight-light">{{$t('invite.shareTip2')}}</div>
              </div>
              <div class="qr">
                <vue-qr :text="shareLink + user.uid"></vue-qr>
              </div>
            </div>
          </div>
        </template>
      </van-share-sheet>
  </router-link>
</template>

<script>
import TextFormat from '@/components/TextFormat.vue'
import { Toast, Dialog } from 'vant'
import { get } from 'vuex-pathify'
import { parseTime } from '@/utils/helper'
import ContractSet from '../ContractSet'
import ContractReplenish from '../ContractReplenish'
import saveImg from '@/utils/saveImg'
import vueQr from 'vue-qr'

export default {
  props: {
    data: Object,
    base: Object,
    shareLink: String
  },
  data() {
    return {
      showSet: false,
      showShare: false,
      showReplenish: false,
      stopInfo: {},
      shareOptions: [
        { name: this.$t('invite.saveImage'), icon: 'poster' }
      ]
    }
  },
  components: { TextFormat, ContractSet, ContractReplenish, vueQr },
  computed: {
    hqList: get('hq/hq'),
    user: get('user/info'),
    hqData: function() {
      return this.hqList.find(p => p.symbolCode == this.data.symbol)
    },
    total() {
      return this.data.money * this.data.contractMultiple
    },
    profit() {
      if (this.data.status > 0) {
        return this.data.profitType != 2 ? this.data.profit : -this.data.profit
      }
      var profit = this.toNumber(this.total * this.hqData.price / this.data.buyPrice - this.total, 4)
      return this.data.tradeType=='1'?profit:-profit
    },
    profitChange() {
      return this.profit / this.data.money * 100
    },
    statusName() {
      switch(this.data.status) {
        case 1: return this.$t('order.status1')
        case 2: return this.$t('order.status2')
        case 3: return this.$t('order.status3')
      }
      return ''
    },
    shareIndex() {
      if (this.profitChange > 50) {
        return '4'
      } else if (this.profitChange > 20) {
        return '3'
      } else if (this.profitChange > 10) {
        return '2'
      } else if (this.profitChange > 5) {
        return '1'
      } else if (this.profitChange < -50) {
        return '-5'
      } else if (this.profitChange < -20) {
        return '-4'
      } else if (this.profitChange < -10) {
        return '-3'
      } else if (this.profitChange < -5) {
        return '-2'
      } else if (this.profitChange < 0) {
        return '-1'
      } else {
        return '0'
      }
    }
  },
  watch: {
    showSet(val) {
      if (val) {
        this.stopInfo = Object.assign({}, this.data.stopInfo)
      }
    }
  },
  methods: {
    parseTime,
    close() {
      Dialog.confirm({ title: this.$t('order.confirmSell') }).then(() => {
        this.$http.post('contract/closeContract', {
          contractId: this.data.id
        }).then(() => {
          Toast.success()
          this.base.load()
        })
      })
    },
    setSub(form) {
      var f = Object.assign({}, form, { contractId: this.data.id })
      this.$http.post('contract/updateStopInfo', f).then(() => {
        this.showSet=false
        this.base.load()
        Toast.success()
      })
    },
    replenishSub(form) {
      var f = Object.assign({}, form, { contractId: this.data.id })
      this.$http.post('contract/replenishContract', f).then(() => {
        this.showReplenish=false
        this.base.load()
        Toast.success()
        // this.$refs.replenish.load()
      })
    },
    shareSelect() {
      saveImg(this.$refs.shareImg)
    }
  }
}
</script>
<style lang="scss" scoped>
p{margin-top: 0; margin-bottom: 5px;}
.column {padding-top: 0; padding-bottom: 0;}
.is-6 {font-size: 16px;}
.share-panel {
  font-family:PingFangSC-Medium,PingFang SC;
  font-size: 14px;
  color: #242424;
  height: 50vh;
  min-height: 500px;
  background-color: #E1ECFF;
  strong { font-size: 16px; }
  .tag {
    border-radius:2px;
  }
  .dq {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
  }
  .yk-image {
    height: 158px;
    width: 158px;
    padding: 4px;
    border: 1px dotted #377DFF;
    border-radius: 50%;
    img { width: 100%; height: 100%; }
  }
}
.share-content{
  background-color: #1A2D50;
  border-radius:10px 10px 0px 0px;
  font-size: 14px;
  line-height: 16px;
  text-align: left;
  color: white;
  padding: 10px 15px;
  img { height: 2rem; width: 2rem; }
}
.qr {
  height: 3.1rem;
  width: 3.1rem;
  overflow: hidden;
  img { height: 3.1rem; width: 3.1rem; }
}
.contract-set {
  background-color: white;
  ::v-deep {
    .has-text-white, .is-flex-center, .van-field__label, input {
      color: #242424 !important;
    }
    .section .is-flex-center {
      background:rgba(55,125,255,.1) !important;
    }
    .is-border >* {
      border-color: #aaaaaa !important;
    }
    small{
      color: #aaaaaa !important;
    }
    .button:not(.is-selected) {
      border-color: #aaaaaa !important;
      color: #242424 !important;
    }
  }
}
</style>
