<template>
  <div class="header">
    <!-- 头部 -->
    <div class="section flex-between">
      <div class="flex1 flex">
        <van-icon name="fanhui" class-prefix="icon" class="has-text-grey-dark mr-2" @click="$router.back()" />
        <span class="is-size-6 is-flex-center has-text-weight-bold" @click="$emit('showBar')">
          <van-icon name="daohang" class-prefix="icon" class="mr-1" />
          <span>{{ data.symbolName }}</span>
          <TextFormat :float="+data.change" class="text-12px ml-1" :text="+data.change" isFormat />
        </span>
      </div>
<!--      <div class="text-primary text-13px" @click="$emit('toRule')">{{$t('exchange.zhinan')}}</div>-->
    </div>
    <!-- 行情 -->
    <div class="section py-0 flex-between mb-1">
      <div class="flex-y ">
        <TextFormat :float="+data.change" :text="(+data.price||0).toFixed(6)" class="text-28px has-text-weight-bold mr-2" />
        <div class="mt-0">
          <span v-if="active===0" class="link text-12px text-primary text-underline">{{$t('extra.contractInformation')}}</span>
          <span v-else class="link text-12px text-primary text-underline" @click="showActionSheet=true">{{timeType}}</span>
        </div>
      </div>
      <div class="flex1 flex-end text-12px text-shallow" style="line-height:1.8">
        <div class="key mr-3">
          <div class="row">{{ $t('exchange.high') }}</div>
          <div class="row">{{ $t('exchange.low') }}</div>
          <div class="row">{{ $t('extra.trend24h') }}</div>
        </div>
        <div class="value tr">
          <div class="row">
            {{ parseNumber6(+data.highPrice) }}
          </div>
          <div class="row">
            {{ parseNumber6(+data.lowPrice) }}
          </div>
          <div class="row">
            {{ parseNumber6(+data.vol | format)}}
          </div>
        </div>
      </div>
    </div>
    <van-action-sheet get-container="body" v-model="showActionSheet" :cancel-text="$t('extra.cancel')" close-on-click-action :actions="actions" @select="timeTypeSelect" />
  </div>
</template>

<script>
import TextFormat from '@/components/TextFormat.vue'
import {parseNumber6} from '@/utils/number'

export default {
  name: 'headerVue',
  filters: {
    format(val) {
      if (!val) return '-'
      return val > 100000 ? parseInt(val / 1000) + 'K' : parseInt(val)
    },
  },
  components: {
    TextFormat,
  },
  props: {
    data: Object,
    active: Number,
    unit: Number,
  },
  watch: {
    unit(unit) {
      this.timeType = {
        1: this.$t('extra.calculate1m'),
        5: this.$t('extra.calculate5m'),
      }[unit]
    },
  },
  data() {
    console.log(this.unit)
    return {
      showActionSheet: false,
      timeType: this.$t('extra.calculate5m'),
      actions: [
        { name: this.$t('extra.calculate1m'), unit: 1 },
        { name: this.$t('extra.calculate5m'), unit: 5 },
      ],
    }
  },
  methods: {
    parseNumber6,
    timeTypeSelect({ name, unit }) {
      // console.log(name)
      this.timeType = name
      this.$emit('unitChange', unit)
    },
  },
}
</script>

<style scoped lang="scss"></style>
