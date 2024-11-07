<template>
  <Layout>

    <div class="hero is-full has-text-white has-background-grey-darker is-size-7">
      <!-- 头部 -->
      <div class="section is-flex-center">
        <van-icon name="fanhui" class-prefix="icon" class="has-text-grey-dark mr-2" @click="$router.back()" />
        <span class="is-size-6 is-flex-center has-text-weight-bold" @click="showBar = true">
          <van-icon name="daohang" class-prefix="icon" class="mr-1" />
          <span>{{ data.symbolName }}</span>
        </span>
        <div class="is-grow pl-2">
          <transition name="van-fade">
            <TextFormat v-show="showPanel" :float="+data.change" :text="+data.price" style="font-size: 120%" />
          </transition>
        </div>
        <div v-if="!config.xiadanFlag" @click="toRule">{{$t('exchange.rule')}}</div>

      </div>
      <!-- 行情 -->
      <collapse-transition>
        <div v-show="!showPanel" class="section py-0">
          <div class="is-flex-center">
            <TextFormat :float="+data.change" :text="+data.price" class="is-size-4 has-text-weight-bold mr-2" />
            <TextFormat :float="+data.change" :text="+data.change" style="line-height: 1.1rem; width: 3.1rem " isBlock isFormat />
            <div class="is-grow is-flex-center has-text-right has-text-weight-light">
              <div class="is-grow pr-2">
                <div>{{$t('exchange.optionsRemark')}}</div>
              </div>
              <div>
              </div>
            </div>
          </div>
          <div class="is-flex-center pt-1">
            <span class="has-text-weight-light mr-1">{{ $t('exchange.high') }}</span><span>{{ +data.highPrice }}</span>
            <span class="has-text-weight-light mr-1 ml-3">{{ $t('exchange.low') }}</span><span>{{ +data.lowPrice }}</span>
            <span class="has-text-weight-light mr-1 ml-3">24h</span><span>{{ data.vol | format }}</span>
            <span class="is-grow"></span>
          </div>
        </div>
      </collapse-transition>
      <!-- K线 -->
      <KLine ref="kline" :data="data" class="is-grow has-background-black-ter" style="overflow: hidden;" :units="units" :unitChange="unitChange" />
      <!-- 下单面板 -->
      <collapse-transition>
        <OptionsForm ref="form" v-show="showPanel" :data="data" @down="showPanel=false" @change="formChange" />
      </collapse-transition>
      <collapse-transition>
        <BiCaiForm ref="form" v-show="showPeriod" :data="data" @down="showPeriod=false" @change="formChange" :unit="unit" />
      </collapse-transition>
      <!-- 底部按钮 -->
      <div class="section is-flex-center is-shadow" v-if="showBuy" :style="{paddingBottom: paddingBottom}">
        <button v-show="!showPeriod && !config.xiadanFlag" class="button is-primary is-grow mr-2" @click="showPeriodAction">{{$t("exchange.coinLottery")}}</button>
        <!--      <button v-show="!showPanel || form.tradeType != '2'" class="button is-primary is-grow mr-2" @click="show('1')">{{ $t('exchange.longBtn') }}</button>-->
        <!--      <button v-show="!showPanel || form.tradeType != '1'" class="button is-danger is-grow mr-2" @click="show('2')">{{ $t('exchange.shortBtn') }}</button>-->
        <!--      <button class="button is-text" @click="$router.push('/options/order')">-->
        <!--        <i class="icon icon-jilu" />-->
        <!--        <span>{{$t('exchange.order')}}</span>-->
        <!--      </button>-->
      </div>
      <!-- 导航 -->
      <van-popup v-model="showBar" position="left" class="bar">
        <div class="section is-size-4">{{$t('exchange.coin')}}</div>
        <div class="is-grow">
          <van-cell v-for="item in list" :key="item.symbolCode" :class="{ isActive: item.symbolCode == data.symbolCode }" @click="to(item.symbolCode)">
            <template #title>
              <span>{{ item.from }}</span><small class="has-text-grey-light">/{{ item.to }}</small>
            </template>
            <template #extra>
              <TextFormat :float="+item.change" :text="+item.price" />
            </template>
          </van-cell>
        </div>
      </van-popup>
      <!--币彩交易-->
      <!--    <van-dialog v-model="showPeriod" class="dark-dialog" show-cancel-button @confirm="sub">-->
      <!--      <div class="confirmPanel">-->
      <!--        <div>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--    </van-dialog>-->
      <!-- 确认面板 -->
      <van-dialog v-model="showConfirm" :title="$t('exchange.confirmBuy')" class="dark-dialog" show-cancel-button @confirm="sub">
        <div class="confirmPanel">
          <div>{{$t('exchange.tradeType')}}</div>
          <div>
            <span :style="{color: form.tradeType == '1' ? '#2DBC8C' : '#EB616E'}">
              {{form.tradeType == '1' ? $t('exchange.long') : $t('exchange.short')}}
            </span>
          </div>
          <div>{{$t('exchange.optionsPeriod')}}</div>
          <div>{{form.period}}s</div>
          <div>{{$t('exchange.yield')}}</div>
          <div> {{ form.yieldRate }}%</div>
          <div>{{$t('exchange.margin')}}</div>
          <div>{{form.amount}} <small>{{form.currency}}</small></div>
          <div>{{$t('order.fee')}}</div>
          <div> {{ form.fee }}%</div>
          <div>{{$t('exchange.minMoney')}}</div>
          <div> {{ form.minMoney }} <small>{{form.currency}}</small></div>
        </div>
      </van-dialog>
    </div>
  </Layout>
</template>

<script>
import HeadSafeArea from '@/components/HeadSafeArea.vue'
import TextFormat from '@/components/TextFormat.vue'
import KLine from '@/components/KLine.vue'
import OptionsForm from '@/components/OptionsForm.vue'
import CollapseTransition from '@/components/CollapseTransition.vue'
import { get } from 'vuex-pathify'
import { Toast } from 'vant'
import BiCaiForm from '../../components/BiCaiForm'

export default {
  name: 'Home',
  filters: {
    format(val) {
      if (!val) return '-'
      return val > 100000 ? parseInt(val / 1000) + 'K' : parseInt(val)
    },
  },
  components: {
    BiCaiForm,
    HeadSafeArea,
    TextFormat,
    KLine,
    CollapseTransition,
    OptionsForm,
  },
  data() {
    return {
      showList: false,
      showPeriod: false,
      showBar: false,
      showPanel: false,
      showConfirm: false,
      form: {},
      remark: '',
      showExchangeBtn: true,
      units: [],
      unit: 5,
      showBuy: false,
    }
  },
  created() {
    this.$http.get('common/getSysArticle?key=qqxx').then(data => {
      this.remark = data.content
    })
    if (this.$route.params.code.startsWith('diem')) {
      this.showExchangeBtn = false
    }
  },
  computed: {
    config: get('bgConfig'),
    hq: get('hq/hq'),
    list: function () {
      return this.hq
      // .filter(p => !!p.supTimeContract)
    },
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
    this.$refs.form.$el.addEventListener(
      window.ontransitionend ? 'transitionend' : 'webkitTransitionEnd',
      () => {
        this.$refs.kline.resize()
      },
      false
    )

    setTimeout(() => {
      this.$refs.kline.resize()
    }, 600)
    this.queryPeriod()
  },
  destroyed() {},
  methods: {
    toRule() {
      this.$router.push('/rule')
    },
    unitChange(unit) {
      if (unit === '1hour') {
        unit = 60
      }
      if (unit === '1day') {
        unit = 60 * 24
      }
      this.unit = parseInt(unit)
      this.showBuy = this.units.indexOf(this.unit) > -1
      this.showPeriod = this.showBuy ? this.showPeriod : false
    },
    async queryPeriod() {
      const data = await this.$http.post('/periodOrder/units', {
        symbol: this.data.symbolCode,
      })
      // console.log(data)
      this.units = data.map(item => item.unit)
      this.showBuy = this.units.indexOf(this.unit) > -1
    },
    showPeriodAction() {
      this.showPeriod = true
    },
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
        this.$refs.form.resize()
        this.showPanel = true
        this.$refs.form.form.tradeType = type
      }
    },
    periodAction() {},
    sub() {
      var form = this.form
      form.symbolCode = this.data.symbolCode
      this.$http
        .post('timeContract/buyContract', form, true)
        .then(() => {
          Toast.success()
          this.$refs.form.load()
        })
        .catch(err => {
          // console.log(err)
          if (err.data == null) {
            Toast.fail(window.i18n.t(`service.${err.msg}`))
          } else {
            Toast.fail(window.i18n.t(`service.${err.msg}`) + err.data)
          }
        })
    },
    to(to) {
      this.showBar = false
      this.$router.replace(to)
    },
    formChange(form) {
      this.form = form
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
