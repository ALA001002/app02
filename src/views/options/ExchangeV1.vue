<template>
  <div class="hero is-full has-text-white has-background-grey-darker is-size-7">
    <!-- 头部 -->
    <HeadSafeArea color="transparent" />
    <div class="section is-flex-center">
      <van-icon name="fanhui" class-prefix="icon" class="has-text-grey-dark mr-2" @click="$router.back()"/>
      <span class="is-size-6 is-flex-center has-text-weight-bold" @click="showBar = true">
        <van-icon name="daohang" class-prefix="icon" class="mr-1"/>
        <span>{{ data.symbolName }}</span>
      </span>
      <div class="is-grow pl-2">
        <transition name="van-fade">
          <TextFormat v-show="showPanel" :float="data.change" :text="data.price" style="font-size: 120%" />
        </transition>
      </div>
    </div>
    <!-- 行情 -->
    <collapse-transition>
      <div v-show="!showPanel" class="section py-0">
        <div class="is-flex-center">
          <TextFormat :float="data.change" :text="data.price" class="is-size-4 has-text-weight-bold mr-2" />
          <TextFormat :float="data.change" :text="data.change" style="line-height: 1.1rem; width: 3.1rem " isBlock isFormat/>
          <div class="is-grow is-flex-center has-text-right has-text-weight-light">
            <div class="is-grow pr-2">
              <div>{{$t('exchange.optionsRemark')}}</div>
            </div>
            <div>
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
    <KLine ref="kline" :unitChange="unitChange" :data="data" class="is-grow has-background-black-ter" style="overflow: hidden;"/>
    <!-- 下单面板 -->
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
        <div>{{$t('exchange.tradeType')}}</div>
        <div>
          <span :style="{color: form.tradeType == '1' ? '#2DBC8C' : '#EB616E'}">
            {{form.tradeType == '1' ? $t('exchange.long') : $t('exchange.short')}}
          </span>
        </div>
        <div>{{$t('exchange.optionsPeriod')}}</div><div>{{form.period}}s</div>
        <div>{{$t('exchange.yield')}}</div><div> {{ form.yieldRate }}%</div>
        <div>{{$t('exchange.margin')}}</div><div>{{form.amount}} <small>{{form.currency}}</small></div>
        <div>{{$t('order.fee')}}</div><div> {{ form.fee }}%</div>
        <div>{{$t('exchange.minMoney')}}</div><div> {{ form.minMoney }} <small>{{form.currency}}</small></div>
      </div>
    </van-dialog>
    <!-- 确认面板 -->
    <van-dialog v-model="calcConfirm" :title="$t('exchange.confirmBuy')" class="dark-dialog"
                @confirm="calcConfirm=false">
      <div class="confirmPanel">
        <div>{{$t('exchange.tradeType')}}</div>
        <div>
          <span :style="{color: calcItem.tradeType == '1' ? '#2DBC8C' : '#EB616E'}">
            {{calcItem.tradeType == '1' ? $t('exchange.long') : $t('exchange.short')}}
          </span>
        </div>
        <div>{{$t('exchange.optionsPeriod')}}</div><div>{{calcItem.period}}s</div>
        <div>{{$t('exchange.yield')}}</div><div> {{ calcItem.yieldRate }}%</div>
        <div>{{$t('exchange.margin')}}</div><div>{{calcItem.amount}} <small>{{calcItem.currency}}</small></div>
        <div>{{$t('order.fee')}}</div><div> {{ calcItem.fee }}%</div>
        <div>{{$t('exchange.minMoney')}}</div><div> {{ calcItem.minMoney }} <small>{{calcItem.currency}}</small></div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import HeadSafeArea from '@/components/HeadSafeArea.vue'
import TextFormat from '@/components/TextFormat.vue'
import KLine from '@/components/KLine.vue'
import OptionsForm from '@/components/OptionsForm.vue'
import CollapseTransition from '@/components/CollapseTransition.vue'
import {get} from 'vuex-pathify'
import {Toast} from 'vant'

export default {
  name: 'Home',
  filters: {
    format(val) {
      if (!val) return '-'
      return val > 100000 ? parseInt(val / 1000) + 'K' : parseInt(val)
    }
  },
  components: { HeadSafeArea, TextFormat, KLine, CollapseTransition, OptionsForm },
  data() {
    return {
      calcItem:{},
      calcConfirm:false,
      showBar: false,
      showPanel: false,
      showConfirm: false,
      timer:null,
      form: {},
      remark: '',
      showExchangeBtn: true,
      allList:[{remainTime:0}]
    }
  },
  created() {
    this.$http.get('common/getSysArticle?key=qqxx').then(data => {
      this.remark = data?.content
    })
    if(this.$route.params.code.startsWith('ppb')){
      this.showExchangeBtn = false
    }
  },
  computed: {
    hq: get('hq/hq'),
    list: function() {
      return this.hq
      // .filter(p => !!p.supTimeContract)
    },
    bottom: get('config@bottom'),
    paddingBottom: function() {
      return (this.bottom > 0 ? this.bottom : 10) + 'px'
    },
    data: function() {
      return this.list.find(p => p.symbolCode == this.$route.params.code)
    },
    stopSurplus() {
      if (this.form.stopSurplus) {
        return this.form.stopSurplusType == 1 ? this.form.stopSurplus : (this.form.stopSurplus + '%')
      }
      return '-'
    },
    stopLoss() {
      if (this.form.stopLoss) {
        return this.form.stopLossType == 1 ? this.form.stopLoss : (this.form.stopLoss + '%')
      }
      return '-'
    }
  },
  mounted() {
    if (window.plus) {
      plus.navigator.setStatusBarStyle('light')
    }
    this.$refs.form.$el.addEventListener(window.ontransitionend ? 'transitionend' : 'webkitTransitionEnd', () => {
      this.$refs.kline.resize()
    }, false)

    setTimeout(() => {
      this.$refs.kline.resize()
    }, 600)
    this.load()
  },
  destroyed() {
    if (window.plus) {
      plus.navigator.setStatusBarStyle('dark')
    }
  },
  methods: {
    startTime(){
      clearTimeout(this.timer)
      this.timer = setInterval(() => {
        const data = this.allList.filter(p => p.remainTime > 0)
        for (let datum of data) {
          datum.remainTime = datum.remainTime-1
          if(datum.remainTime===0){
            this.calcItem = datum
            this.calcConfirm = true
          }
        }
      }, 1000)
    },
    load: function() {
      const form = Object.assign({}, this.form)
      form.status = null
      this.$http.get('timeContract/listContract', form).then(data => {
        this.isLoading = false
        this.allList =data
        this.startTime()
      }).catch(() => {
        this.allList = []
        this.isLoading = false
      })
    },
    unitChange(){
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
    sub() {
      var form = this.form
      form.symbolCode = this.data.symbolCode
      this.$http.post('timeContract/buyContract', form,true).then(() => {
        Toast.success()
        this.$refs.form.load()
        this.load()
      }).catch((err) => {
        // console.log(err)
        if(err.data == null) {
          Toast.fail(window.i18n.t(`service.${err.msg}`))
        } else {
          Toast.fail(window.i18n.t(`service.${err.msg}`)+err.data)
        }
      })
    },
    to(to) {
      this.showBar=false
      this.$router.replace(to)
    },
    formChange(form) {
      this.form = form
    }
  }
}
</script>
<style lang="scss" scoped>
.button {
  font-size: 0.75rem;
  height: 2.2rem;
}
.button.is-text {
  color: rgba(255,255,255,.8);
  font-size: 12px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding: 0 5px;
  >i {margin: 0 !important;}
  &:focus, &:active {
    background-color: transparent;
    color: initial;
  }
}
::v-deep {
  .has-text-weight-light {
    color: rgba(255, 255, 255, 0.5)
  }
}
::v-deep .bar {
  height: 100%;
  width: 70%;
  background-color: #1A2D50;
  display: flex;
  flex-direction: column;
  .is-grow {overflow: auto;}
  .van-cell {
    color: white;
    background-color: transparent
  }
  .van-cell.isActive {
    background-color: #112150
  }
  .van-cell::after {
    border-bottom: 0
  }
}

.confirmPanel {
  >div{width: 50%; display: inline-block; padding: 1px 4px; box-sizing: border-box;; }
  >div:nth-child(even) { color: white; }
  small {color: rgba(255, 255, 255, 0.8);}
}
</style>
