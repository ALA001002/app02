<template>
  <router-link tag="div" class="has-background-white mt-1 has-text-grey" style="font-family:PingFangSC-Regular,PingFang SC;" to="">
    <div class="section is-flex-center van-hairline--bottom">
      <span>{{ parseTime(data.trustTime, '{m}-{d} {h}:{i}') }}</span>
      <span>{{ data.orderNo }}</span>
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
        <!-- 状态名称 -->
        <div :class="'has-text-'+colors[data.status]">{{ statusName }}</div>
      </div>
      <div class="columns is-mobile mt-0 mb-1">
        <div class="column">
          <p>{{$t('order.triggerPrice')}}</p>
          <p class="title is-6">{{data.triggerPrice}}</p>
        </div>
        <div class="column">
          <p>{{data.status > 0 ? $t('order.buyPrice') : $t('order.nowPrice')}}</p>
          <p class="title is-6">{{data.status > 0 ? data.finalPrice : hqData.price}}</p>
        </div>
      </div>
      
      <!-- 杂项 -->
      <div class="columns is-mobile is-small my-0">
        <div class="column">
          <p class="is-flex-center">
            <span class="is-grow">{{$t('order.money')}}</span>
            <span class="is-grow">{{data.money}}</span>
          </p>
          <p class="is-flex-center">
            <span class="is-grow">{{$t('order.trustPrice')}}</span>
            <span class="is-grow">{{data.trustPrice||'-'}}</span>
          </p>
          <p v-if="data.dealTime" class="is-flex-center">
            <span class="is-grow">{{$t('order.dealTime')}}</span>
            <span class="is-grow">{{parseTime(data.dealTime)||'-'}}</span>
          </p>
        </div>
        <div class="column">
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
      <div v-if="data.status==0" class="buttons">
        <button class="button is-small is-link is-light is-grow" @click="close">{{$t('order.cancelTrust')}}</button>
      </div>
    </div>
  </router-link>
</template>

<script>
import { Toast, Dialog } from 'vant'
import { get } from 'vuex-pathify'
import { parseTime } from '@/utils/helper'

export default {
  props: {
    data: Object,
    base: Object
  },
  data() {
    return {
      colors: ['grey', 'success', 'info', 'danger']
    }
  },
  computed: {
    hqList: get('hq/hq'),
    hqData: function() {
      return this.hqList.find(p => p.symbolCode == this.data.symbol)
    },
    statusName() {
      switch(this.data.status) {
        case 1: return this.$t('order.trustStatus1')
        case 2: return this.$t('order.trustStatus2')
        case 3: return this.$t('order.trustStatus3')
      }
      return ''
    }
  },
  methods: {
    parseTime,
    close() {
      Dialog.confirm({ title: this.$t('order.confirmCancelTrust') }).then(() => {
        this.$http.post('contract/revokePlan', {
          planId: this.data.id
        }).then(() => {
          Toast.success()
          this.base.load()
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
p{margin-top: 0; margin-bottom: 5px;}
.column {padding-top: 0; padding-bottom: 0;}
.is-6 {font-size: 16px;}
</style>
