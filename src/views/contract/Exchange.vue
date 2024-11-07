<template>
  <div class="hero is-full has-text-white has-background-grey-darker is-size-7">
    <!-- 头部 -->
    <HeadSafeArea color="transparent" />
    <div class="section is-flex-center">
      <van-icon name="fanhui" class-prefix="icon" class="has-text-grey-dark mr-2" @click="$router.back()" />
      <span class="is-size-6 is-flex-center has-text-weight-bold" @click="showBar = true">
        <van-icon name="daohang" class-prefix="icon" class="mr-1" />
        <span>{{ data.symbolName }}</span>
      </span>
      <div class="is-grow pl-2">
        <transition name="van-fade">
          <TextFormat v-show="showPanel" :float="data.change" :text="numFilter(data.price)" style="font-size: 120%" />
        </transition>
      </div>
      <!-- <span>逐仓模式 <i class="icon icon-gengduo has-text-weight-light" style="font-size:85%"/></span> -->
    </div>
    <!-- 行情 -->
    <collapse-transition>
      <div v-show="!showPanel" class="section py-0">
        <div class="is-flex-center">
          <TextFormat :float="data.change" :text="numFilter(data.price)" class="is-size-4 has-text-weight-bold mr-2" />
          <!-- <van-icon name="tishi" class-prefix="icon" class="mr-2 has-text-grey-dark"/> -->
          <TextFormat :float="data.change" :text="data.change" style="line-height: 1.1rem; width: 3.1rem " isBlock isFormat />
          <div class="is-grow is-flex-center has-text-right has-text-weight-light">
            <div class="is-grow pr-2">
              <div v-help="remark">{{$t('exchange.remark')}}</div>
              <!-- <div class="mt-1">{{$t('exchange.capitalRatePeriod')}}</div> -->
            </div>
            <div>
              <!-- <div>{{ data.capitalRate }}</div> -->
              <!-- <div class="mt-1">{{ data.capitalRatePeriod }}</div> -->
            </div>
          </div>
        </div>
        <div class="is-flex-center pt-1">
          <span class="has-text-weight-light mr-1">{{ $t('exchange.high') }}</span><span>{{ data.highPrice }}</span>
          <span class="has-text-weight-light mr-1 ml-3">{{ $t('exchange.low') }}</span><span>{{ data.lowPrice }}</span>
          <span class="has-text-weight-light mr-1 ml-3">24h</span><span>{{ data.vol | format }}</span>
          <span class="is-grow"></span>
        </div>
      </div>
    </collapse-transition>
    <!-- K线 -->
    <KLine ref="kline" :data="data" class="is-grow has-background-black-ter" style="overflow: hidden;" />
    <!-- 下单面板 -->
    <collapse-transition>
      <contractForm ref="contractForm" v-show="showPanel" :data="data" @down="showPanel=false" @change="formChange" />
    </collapse-transition>
    <!-- 底部按钮 -->
    <div class="section is-flex-center is-shadow" :style="{paddingBottom: paddingBottom}">
      <button v-show="!showPanel || form.tradeType != '2'" class="button is-primary is-grow mr-2" @click="show('1')">{{ $t('exchange.longBtn') }}</button>
      <button v-show="!showPanel || form.tradeType != '1'" class="button is-danger is-grow mr-2" @click="show('2')">{{ $t('exchange.shortBtn') }}</button>
      <button class="button is-text" @click="$router.push('/contract/order')">
        <i class="icon icon-jilu" />
        <span>{{$t('exchange.order')}}</span>
      </button>
    </div>
    <!-- 导航 -->
    <van-popup v-model="showBar" position="left" class="bar">
      <HeadSafeArea color="transparent" />
      <div class="section is-size-4">{{$t('exchange.coin')}}</div>
      <div class="is-grow">
        <van-cell v-for="item in list" :key="item.symbolCode" :class="{ isActive: item.symbolCode == data.symbolCode }" @click="to(item.symbolCode)">
          <template #title>
            <span>{{ item.from }}</span><small class="has-text-grey-light">/{{ item.to }}</small>
          </template>
          <template #extra>
            <TextFormat :float="item.change" :text="item.price" />
          </template>
        </van-cell>
      </div>
    </van-popup>
    <!-- 确认面板 -->
    <van-dialog v-model="showConfirm" :title="$t('exchange.confirmBuy')" class="dark-dialog" show-cancel-button @confirm="sub">
      <div class="confirmPanel">
        <div>{{$t('exchange.tradeType')}}/{{$t('exchange.leverage')}}</div>
        <div>
          <span :style="{color: form.tradeType == '1' ? '#2DBC8C' : '#EB616E'}">
            {{form.tradeType == '1' ? $t('exchange.long') : $t('exchange.short')}}
          </span>
          {{form.contractMultiple}}X
        </div>
        <div>{{$t('exchange.trustType')}}</div>
        <div>{{form.trustType == '0' ? $t('exchange.marketPrice') : $t('exchange.trigger')}}</div>
        <div v-show="form.trustType == '1'">{{$t('exchange.triggerPrice')}}</div>
        <div v-show="form.trustType == '1'">{{form.triggerPrice}}</div>
        <div>{{$t('exchange.margin')}}</div>
        <div>{{form.amount}} <small>{{form.currency}}</small></div>
        <div>{{$t('order.stopSurplus')}}</div>
        <div>{{stopSurplus}}</div>
        <div>{{$t('order.stopLoss')}}</div>
        <div>{{stopLoss}}</div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import HeadSafeArea from '@/components/HeadSafeArea.vue'
import TextFormat from '@/components/TextFormat.vue'
import KLine from '@/components/KLine.vue'
import ContractForm from '@/components/ContractForm.vue'
import CollapseTransition from '@/components/CollapseTransition.vue'
import { get } from 'vuex-pathify'
import { Toast } from 'vant'

export default {
  name: 'Home',
  filters: {
    format(val) {
      if (!val) return '-'
      return val > 100000 ? parseInt(val / 1000) + 'K' : parseInt(val)
    },
  },
  components: {
    HeadSafeArea,
    TextFormat,
    KLine,
    CollapseTransition,
    ContractForm,
  },
  data() {
    return {
      showBar: false,
      showPanel: false,
      showConfirm: false,
      form: {},
      remark: '',
    }
  },
  created() {
    this.$http.get('common/getSysArticle?key=heyxx').then(data => {
      this.remark = data.content
    })
  },
  computed: {
    list: get('hq/hq'),
    bottom: get('config@bottom'),
    paddingBottom: function () {
      return (this.bottom > 0 ? this.bottom : 10) + 'px'
    },
    data: function () {
      return this.list.find(p => p.symbolCode == this.$route.params.code)
    },
    stopSurplus() {
      if (this.form.stopSurplus) {
        return this.form.stopSurplusType == 1
          ? this.form.stopSurplus
          : this.form.stopSurplus + '%'
      }
      return '-'
    },
    stopLoss() {
      if (this.form.stopLoss) {
        return this.form.stopLossType == 1
          ? this.form.stopLoss
          : this.form.stopLoss + '%'
      }
      return '-'
    },
  },
  mounted() {
    this.$refs.contractForm.$el.addEventListener(
      window.ontransitionend ? 'transitionend' : 'webkitTransitionEnd',
      () => {
        this.$refs.kline.resize()
      },
      false
    )

    setTimeout(() => {
      this.$refs.kline.resize()
    }, 600)
  },
  methods: {
    show(type) {
      if (this.showPanel) {
        // 校验
        if (!this.form.amount) {
          Toast.fail(this.$t('exchange.amountError'))
          return
        }
        // 确认购买
        this.showConfirm = true
      } else {
        this.$refs.contractForm.resize()
        this.showPanel = true
        this.$refs.contractForm.form.tradeType = type
      }
    },
    sub() {
      var form = this.form
      form.symbolCode = this.data.symbolCode
      this.$http.post('contract/buyContract', form).then(() => {
        Toast.success()
        this.$refs.contractForm.load()
      })
    },
    to(to) {
      this.showBar = false
      this.$router.replace(to)
    },
    formChange(form) {
      this.form = form
    },
    numFilter(value) {
      var tempVal
      if (value > 1) {
        tempVal = parseFloat(value).toFixed(7)
      } else {
        tempVal = parseFloat(value).toFixed(10)
      }
      let realVal = tempVal.substring(0, tempVal.length - 1)
      return realVal
    },
  },
}
</script>
<style lang="scss" scoped>
.button {
  font-size: 0.75rem;
  height: 2.2rem;
}
.button.is-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding: 0 5px;
  > i {
    margin: 0 !important;
  }
  &:focus,
  &:active {
    background-color: transparent;
    color: initial;
  }
}
::v-deep {
  .has-text-weight-light {
    color: rgba(255, 255, 255, 0.5);
  }
}
::v-deep .bar {
  height: 100%;
  width: 70%;
  background-color: #1a2d50;
  display: flex;
  flex-direction: column;
  .is-grow {
    overflow: auto;
  }
  .van-cell {
    color: white;
    background-color: transparent;
  }
  .van-cell.isActive {
    background-color: #112150;
  }
  .van-cell::after {
    border-bottom: 0;
  }
}

.confirmPanel {
  > div {
    width: 50%;
    display: inline-block;
    padding: 1px 4px;
    box-sizing: border-box;
  }
  > div:nth-child(even) {
    color: white;
  }
  small {
    color: rgba(255, 255, 255, 0.8);
  }
}
</style>
