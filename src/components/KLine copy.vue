<template>
  <div class="hero">
    <!-- K线选择 -->
    <div class="is-flex-center text-mid text-12px has-text-centered pr-1">
      <span v-for="(item, i) in showKTypes" :key="i" v-bind:class="{ 'bicai-active':units && units.indexOf(parseInt(item))>-1 ,'text-primary': option.kType==i}" class="is-grow" @click="option.kType = i,unitChange && unitChange(i)">
        {{ item }}
      </span>
      <van-dropdown-menu class="k-tabs">
        <van-dropdown-item :title="kTitle" :title-class="hideKTypes[option.kType]?'text-primary':null">
          <!-- 更多 -->
          <div class="is-flex-center has-text-centered van-hairline--top">
            <span v-for="(item, i) in hideKTypes" :key="i" :class="{ 'text-primary': option.kType==i }" class="my-2 px-3 has-text-weight-light van-hairline--right" @click="option.kType = i,unitChange && unitChange(i)">
              {{ item }}
            </span>
            <span class="is-grow" />
          </div>
        </van-dropdown-item>
        <van-dropdown-item :title="$t('exchange.indicators')">
          <!-- 主图 -->
          <div class="is-flex-center has-text-centered van-hairline--top">
            <span class="px-3 van-hairline--right has-text-weight-light">{{$t('exchange.primaryIndicators')}}</span>
            <span v-for="item in technicals1" :key="item.technical" :class="{ 'text-primary': option.technical1==item.technical }" class="is-grow py-2 has-text-weight-light" @click="option.technical1 = item.technical">
              {{ item.technical }}
            </span>
          </div>
          <!-- 副图 -->
          <div class="is-flex-center has-text-weight-light has-text-centered">
            <span class="px-3 van-hairline--right has-text-weight-light">{{$t('exchange.secondaryIndicators')}}</span>
            <span v-for="item in technicals2" :key="item.technical" :class="{ 'text-primary': option.technical2==item.technical }" class="is-grow py-2 has-text-weight-light" @click="option.technical2 = item.technical">
              {{ item.technical }}
            </span>
          </div>
        </van-dropdown-item>
      </van-dropdown-menu>
    </div>
    <div ref="kline" class="is-grow" style="overflow: hidden;"></div>
  </div>
</template>

<script>
import { init, dispose } from 'klinecharts'
import { sync } from 'vuex-pathify'
const upColor = '#41BB6E'
const downColor = '#FE782E'
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
    units: {
      type: Array,
      required: false,
    },
    unitChange: {
      type: Function,
      required: false,
    },
  },
  data() {
    return {
      chart: null,
      technical2: null,
      timer: null,
      technicals1: [
        { technical: 'MA' },
        { technical: 'BOLL' },
        { technical: 'EMA' },
        { technical: 'SAR' },
      ],
      technicals2: [
        { technical: 'MACD' },
        { technical: 'KDJ' },
        { technical: 'RSI' },
        { technical: 'WR' },
      ],
    }
  },
  mounted() {
    // 初始化图表
    let tempVal = parseFloat(this.data.price).toFixed(9)
    let realVal = tempVal.substring(0, tempVal.length - 1)
    let dataPrice = (realVal + '').split('.')
    let precision = dataPrice.length < 2 ? 2 : dataPrice[1].length
    if (precision < 2) {
      precision = 2
    }
    const chart = init(this.$refs.kline)
    // 自定义MA指标参数
    chart.setTechnicalIndicatorParams('MA', [5, 10, 30])
    // 设置一条数据宽度
    chart.setDataSpace(8)
    // 设置初始化的指标值
    chart.setCandleStickTechnicalIndicatorType(this.option.technical1)
    chart.createTechnicalIndicator('VOL', 80, false)
    if (this.data.symbolCode.startsWith('diem')) {
      precision = 10
    }
    chart.setPrecision(precision, precision)
    // 设置样式
    chart.setStyleOptions(this.getStyle())
    chart.loadMore(this.getData)
    this.technical2 = chart.createTechnicalIndicator(
      this.option.technical2,
      110,
      false
    )
    this.chart = chart
    this.option.kType = '5min'
    this.unitChange(5)
    // 为图表添加数据
    this.getData()
  },
  destroyed() {
    if (this.chart) {
      dispose(this.chart)
    }
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  watch: {
    'data.symbolCode': function () {
      if (this.chart) {
        this.chart.clearData()
      }
      this.getData()
    },
    'option.kType': function () {
      if (this.chart) {
        this.chart.clearData()
      }
      this.getData()
    },
    'option.technical1': function (val) {
      this.chart.setCandleStickTechnicalIndicatorType(val)
    },
    'option.technical2': function (val) {
      this.chart.setTechnicalIndicatorType(this.technical2, val)
    },
  },
  computed: {
    option: sync('klineOpt'),
    kTitle() {
      const kt = this.hideKTypes[this.option.kType]
      return kt ? kt : this.$t('exchange.kmore')
    },
    showKTypes() {
      return {
        0: this.$t('exchange.k0'),
        '1min': this.$t('exchange.k1min'),
        '5min': this.$t('exchange.k5min'),
        '15min': this.$t('exchange.k15min'),
        '30min': this.$t('exchange.k30min'),
      }
    },
    hideKTypes() {
      return {
        '60min': this.$t('exchange.k1hour'),
        '4hour': this.$t('exchange.k4hour'),
        '1day': this.$t('exchange.k1day'),
      }
    },
    kType() {
      var isMin = this.option.kType == '0'
      if (isMin) {
        this.chart.setCandleStickChartType('real_time')
        return '1min'
      }
      this.chart.setCandleStickChartType('candle_stick')
      return this.option.kType
    },
  },
  methods: {
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
    resize() {
      this.chart.resize()
    },
    getData(timestamp = new Date().getTime(), size = 100) {
      this.$http
        .get('marketsituation/kline', {
          symbol: this.data.symbolCode,
          period: this.kType,
          timestamp,
          size,
        })
        .then(res => {
          const data = res
            .map(p => {
              p.volume = p.vol
              p.turnover = ((p.open + p.close + p.high + p.low) / 4) * p.volume
              return p
            })
            .reverse()
          // console.log({ ...data[0] })
          let more = data.length >= size
          timestamp
            ? this.chart.applyMoreData(data, more)
            : this.chart.applyNewData(data, more)
          // 拉去最后一笔K线数据
          if (!this.timer) {
            this.timer = setInterval(() => this.updateData(), 1000)
          }
        })
    },
    updateData() {
      if (this.updateing) return
      this.updateing = true
      this.$http.api
        .get('marketsituation/kline', {
          params: {
            symbol: this.data.symbolCode,
            period: this.kType,
            timestamp: new Date().getTime(),
            size: 1,
          },
        })
        .then(res => {
          this.updateing = false
          if (!res.data.length) return
          const data = res.data[0]
          if (data.period != this.kType || data.symbol != this.data.symbolCode)
            return
          data.volume = data.vol
          data.turnover =
            ((data.open + data.close + data.high + data.low) / 4) * data.volume
          this.chart.updateData(data)
        })
        .catch(() => {
          this.updateing = false
        })
    },
    getStyle() {
      return {
        grid: {
          display: false,
          horizontal: {
            display: true,
            size: 1,
            color: 'rgba(255,255,255,0.3)',
            // 'solid'|'dash'
            style: 'dash',
            dashValue: [2, 2],
          },
          vertical: {
            display: true,
            size: 1,
            color: 'rgba(255,255,255,0.3)',
            // 'solid'|'dash'
            style: 'dash',
            dashValue: [2, 2],
          },
        },
        candleStick: {
          bar: {
            // 'solid'|'stroke'|'up_stroke'|'down_stroke'|'ohlc'
            style: 'solid',
            upColor,
            downColor,
            noChangeColor: '#999999',
          },
          priceMark: {
            display: true,
            high: {
              display: false,
              color: '#D9D9D9',
              textMargin: 5,
              textSize: 10,
              textFamily: 'Arial',
            },
            low: {
              display: false,
              color: '#D9D9D9',
              textMargin: 5,
              textSize: 10,
              textFamily: 'Arial',
            },
            last: {
              display: true,
              upColor: 'rgba(255,255,255,.8)',
              downColor: 'rgba(255,255,255,.8)',
              noChangeColor: '#666666',
              line: {
                display: false,
                // 'solid'|'dash'
                style: 'dash',
                dashValue: [2, 2],
                size: 1,
              },
              text: {
                display: true,
                size: 12,
                paddingLeft: 2,
                paddingTop: 2,
                paddingRight: 2,
                paddingBottom: 2,
                color: '#444',
                family: 'Arial',
              },
            },
          },
        },
        realTime: {
          timeLine: {
            color: '#1e88e5',
            size: 2,
            areaFillColor: 'rgba(30, 136, 229, 0.08)',
          },
          averageLine: {
            display: true,
            color: '#F5A623',
            size: 2,
          },
        },
        technicalIndicator: {
          bar: {
            upColor,
            downColor,
            noChangeColor: '#999999',
          },
          line: {
            size: 1,
            // colors: ['#D9D9D9', '#F5A623', '#F601FF', '#1587DD', '#1e88e5'],
            colors: [
              '#F6DC93',
              '#61D1C0',
              '#CB92FE',
              '#11c6d6',
              '#f84fff',
              '#ee742c',
              '#f0f091',
              '#cccccc',
            ],
          },
          circle: {
            upColor: upColor,
            downColor: downColor,
            noChangeColor: '#666666',
          },
          lastValueMark: {
            display: false,
            textColor: '#ffffff',
            textSize: 10,
            textFamily: 'Arial',
            textPaddingLeft: 3,
            textPaddingTop: 2,
            textPaddingRight: 3,
            textPaddingBottom: 2,
          },
        },
        xAxis: {
          display: true,
          maxHeight: 50,
          minHeight: 30,
          axisLine: {
            display: false,
            color: '#888888',
            size: 1,
          },
          tickText: {
            display: true,
            color: '#ADABAF',
            family: 'DINAlternate-Bold,DINAlternate,Arial',
            size: 12,
            margin: 3,
          },
          tickLine: {
            display: true,
            size: 1,
            length: 3,
            color: '#888888',
          },
        },
        yAxis: {
          display: true,
          maxWidth: 100,
          minWidth: 60,
          // 'left' | 'right'
          position: 'right',
          // 'normal' | 'percentage'
          type: 'normal',
          axisLine: {
            display: false,
            color: '#888888',
            size: 1,
          },
          tickText: {
            // 'outside' | 'inside'
            position: 'outside',
            display: true,
            color: '#ADABAF',
            family: 'DINAlternate-Bold,DINAlternate,Arial',
            size: 12,
            margin: 3,
          },
          tickLine: {
            display: false,
            size: 1,
            length: 3,
            color: '#888888',
          },
        },
        separator: {
          size: 0,
          color: '#888888',
          fill: true,
        },
        floatLayer: {
          // display: false,
          crossHair: {
            display: true,
            horizontal: {
              display: true,
              line: {
                display: true,
                // 'solid'|'dash'
                style: 'dash',
                dashValue: [2, 2],
                size: 1,
                color: '#888888',
              },
              text: {
                display: true,
                color: '#D9D9D9',
                size: 12,
                family: 'Arial',
                paddingLeft: 2,
                paddingRight: 2,
                paddingTop: 2,
                paddingBottom: 2,
                borderSize: 1,
                borderColor: '#505050',
                backgroundColor: '#505050',
              },
            },
            vertical: {
              display: true,
              line: {
                display: true,
                // 'solid'|'dash'
                style: 'dash',
                dashValue: [2, 2],
                size: 1,
                color: '#888888',
              },
              text: {
                display: true,
                color: '#D9D9D9',
                size: 12,
                family: 'Arial',
                paddingLeft: 2,
                paddingRight: 2,
                paddingTop: 2,
                paddingBottom: 2,
                borderSize: 1,
                borderColor: '#505050',
                backgroundColor: '#505050',
              },
            },
          },
          prompt: {
            // 'always' | 'follow_cross' | 'none'
            displayRule: 'follow_cross',
            candleStick: {
              // 'standard' | 'rect'
              showType: 'rect',
              labels: [
                this.$t('exchange.ktime'),
                this.$t('exchange.kopen'),
                this.$t('exchange.kclose'),
                this.$t('exchange.khigh'),
                this.$t('exchange.klow'),
                this.$t('exchange.kvol'),
              ],
              values: null,
              rect: {
                paddingLeft: 0,
                paddingRight: 0,
                paddingTop: 0,
                paddingBottom: 6,
                left: 8,
                top: 8,
                right: 8,
                borderRadius: 4,
                borderSize: 1,
                borderColor: '#3f4254',
                fillColor: '#1A2D50',
              },
              text: {
                size: 12,
                color: '#D9D9D9',
                family: 'Arial',
                marginLeft: 8,
                marginTop: 6,
                marginRight: 8,
                marginBottom: 0,
              },
            },
            technicalIndicator: {
              text: {
                size: 10,
                family: 'Arial',
                color: '#D9D9D9',
                marginTop: 6,
                marginRight: 8,
                marginBottom: 0,
                marginLeft: 8,
              },
              point: {
                display: true,
                radius: 3,
              },
            },
          },
        },
        graphicMark: {
          line: {
            color: '#1e88e5',
            size: 1,
          },
          point: {
            backgroundColor: '#1e88e5',
            borderColor: '#1e88e5',
            borderSize: 1,
            radius: 4,
            activeBackgroundColor: '#1e88e5',
            activeBorderColor: '#1e88e5',
            activeBorderSize: 1,
            activeRadius: 6,
          },
          text: {
            color: '#1e88e5',
            size: 10,
            family: 'Arial',
            marginLeft: 2,
            marginRight: 2,
            marginTop: 2,
            marginBottom: 6,
          },
        },
      }
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.k-tabs {
  flex-grow: 2;
  flex-basis: 0%;
  ::v-deep .van-dropdown-menu__bar {
    height: 1.8rem;
    background-color: transparent;
    .van-dropdown-menu__title {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.6rem;
    }
    .text-primary .van-dropdown-menu__title {
      color: inherit;
    }
  }
}
::v-deep .van-popup {
  background-color: #121e36;
}
.van-hairline--top::after,
.van-hairline--right::after {
  border-color: #000;
}
.bicai-active {
  // color: green;
}
</style>
