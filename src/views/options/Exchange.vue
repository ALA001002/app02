<template>
  <Layout>
    <van-tabs type="card" v-model="tabActive" animated show-header no-padding bar-padding sticky>
      <van-tab :title="$t('extra.trendChart')">
        <div class="flex-y-full" :style="{height}">
          <headerVue :data="data" :active="tabActive" @showBar="showBar=true" @toRule="toRule"></headerVue>
          <!-- K线 -->
          <KLine ref="kline" :data="data" class="is-grow flex1" style="overflow: hidden;" :unit="unit" :units="units" :unitChange="unitChange" />
          <!-- 底部按钮 -->

          <collapse-transition>
            <OptionsForm ref="form" v-show="showPanel" :data="data" @down="showPanel=false" @change="formChange"/>
          </collapse-transition>
          <!-- 底部按钮 -->
          <div class="section is-flex-center is-shadow" v-if="showExchangeBtn" :style="{paddingBottom: paddingBottom}">
            <button v-show="!showPanel || form.tradeType != '2'" class="button is-primary is-grow mr-2" @click="show('1')">{{ $t('exchange.longBtn') }}</button>
            <button v-show="!showPanel || form.tradeType != '1'" class="button is-danger is-grow mr-2" @click="show('2')">{{ $t('exchange.shortBtn') }}</button>
            <button class="button is-text" @click="$router.push('/options/order')">
              <i class="icon icon-jilu" />
              <span>{{$t('exchange.order')}}</span>
            </button>
          </div>
<!--          <div class="section" :style="{paddingBottom: paddingBottom}">-->
<!--            <div class="big-btn section" @click="tabActive=1">{{$t('app.spot')}}</div>-->
<!--          </div>-->
        </div>
      </van-tab>
      <!--  旧版现货    -->
<!--      <van-tab :title="$t('app.spot')">
        <Contract @showBar="showBar=true" :code="data && data.symbolCode"></Contract>
      </van-tab>-->
      <!--  新版现货    -->

      <!-- 下单面板 -->
      <van-tab :title="$t('app.spot')">
        <Spot @showBar="showBar=true" :code="data && data.symbolCode"></Spot>
      </van-tab>
      <van-tab :title="$t('app.options')">
           <TimeContract :data="data"></TimeContract>
      </van-tab>
<!--        &lt;!&ndash; &lt;!&ndash;        <headerVue @unitChange="unitChange" :unit="unit" :data="data" :active="tabActive" @showBar="showBar=true" @toRule="toRule"></headerVue>&ndash;&gt;
         &lt;!&ndash;        &lt;!&ndash; 下单面板 &ndash;&gt;&ndash;&gt;
         &lt;!&ndash;        <BiCaiForm ref="form" :data="data" :disabled="!showBuy" @down="showPeriod=false" @change="formChange" :unit="unit" />&ndash;&gt;
         &lt;!&ndash;        <Records :symbol="currentCoin" :unit="unit"></Records>&ndash;&gt;&ndash;&gt;-->


    </van-tabs>
    <!-- 导航 -->
    <van-popup v-model="showBar" position="left" class="bar">
      <HeadSafeArea></HeadSafeArea>
      <div class="section text-20px line2 my-2">{{$t('exchange.coin')}}</div>
      <div class="is-grow">
        <van-cell v-for="item in list" :key="item.symbolCode" :class="{ isActive: item && data && item.symbolCode === data.symbolCode }" @click="to(item.symbolCode)">
          <template #title>
            <span>{{ item.from }}</span><small class="has-text-grey-light">/{{ item.to }}</small>
          </template>
          <template #extra>
            <TextFormat :float="+item.change" :text="parseNumber6(+item.price)" />
          </template>
        </van-cell>
      </div>
    </van-popup>
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
  </Layout>
</template>

<script>
import TextFormat from '@/components/TextFormat.vue'
import Contract from './Contract.vue'
import TimeContract from '@/components/timecontract/index.vue'
import KLine from '@/components/KLine.vue'
import OptionsForm from '@/components/OptionsForm.vue'
import HeadSafeArea from '@/components/HeadSafeArea'
import CollapseTransition from '@/components/CollapseTransition.vue'
import { get } from 'vuex-pathify'
import { Toast } from 'vant'
import BiCaiForm from '@/components/BiCaiForm.vue'
import headerVue from './header.vue'
import Records from './Records.vue'
import {parseNumber6} from '@/utils/number'
import Spot from '@/views/options/Spot.vue'

export default {
  name: 'Home',
  filters: {
    format(val) {
      if (!val) return '-'
      return val > 100000 ? parseInt(val / 1000) + 'K' : parseInt(val)
    },
  },
  components: {
    Spot,
    Contract,
    HeadSafeArea,
    BiCaiForm,
    TextFormat,
    headerVue,
    Records,
    KLine,
    CollapseTransition,
    OptionsForm,
    TimeContract
  },
  data() {
    return {
      showList: false,
      showPeriod: false,
      showBar: false,
      showPanel: false,
      showConfirm: false,
      form: {tradeType:0},
      remark: '',
      currentCoin: this.$route.params.code,
      showExchangeBtn: true,
      units: [],
      unit: 5,
      tabActive: 1,
      showBuy: false,
    }
  },
  created() {
    this.$http.get('common/getSysArticle?key=qqxx').then(data => {
      this.remark = data?.content
    })
    if (this.$route.params.code.startsWith('diem')) {
      this.showExchangeBtn = false
    }
  },
  computed: {
    wsData: get('wsData'),
    config: get('bgConfig'),
    height() {
      return `calc(100vh - ${
        (window.plus ? plus.navigator.getStatusbarHeight() : 20) + 30
      }px)`
    },
    hq: get('hq/hq'),
    list: function () {
      return this.hq || []
      // .filter(p => !!p.supTimeContract)
    },
    bottom: get('config@bottom'),
    paddingBottom: function () {
      return (this.bottom > 0 ? this.bottom : 10) + 'px'
    },
    coin: function () {
      return this.$route.params.code
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
    // this.$refs.form.$el.addEventListener(
    //   window.ontransitionend ? 'transitionend' : 'webkitTransitionEnd',
    //   () => {
    //     this.$refs.kline.resize()
    //   },
    //   false
    // )

    // setTimeout(() => {
    //   this.$refs.kline.resize()
    // }, 600)

    this.$ws.load()
    this.queryPeriod()
  },
  destroyed() {
    this.$ws.load()
  },
  watch: {
    coin() {
      this.queryPeriod()
    },
    wsData(){
      Toast.loading({type: 'loading',duration:2000})
    }
  },
  methods: {
    parseNumber6,
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

      this.units.includes(parseInt(unit)) && (this.unit = parseInt(unit))
      this.showBuy = this.units.includes(parseInt(unit))
      this.showPeriod = this.showBuy ? this.showPeriod : false

      // this.unit = parseInt(unit)
      // this.showBuy = this.units.indexOf(this.unit) > -1
      // this.showPeriod = this.showBuy ? this.showPeriod : false
    },
    async queryPeriod() {
      // const data = await this.$http.post('/periodOrder/units', {
      //   symbol: this.coin,
      // })
      // this.units = data.map(item => item.unit)
      // this.showBuy = this.units.includes(this.unit)
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
      this.currentCoin = to
      this.$router.replace('/options/' + to)
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
  background-color: #100f14;
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
    background-color: #232224;
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
