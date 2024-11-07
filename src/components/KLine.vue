<template>
  <div class="hero">
    <!-- K线选择 -->
    <div class="is-flex-center text-mid text-12px has-text-centered pr-1">
      <span v-for="(item, i) in showKTypes" :key="i" v-bind:class="{ 'bicai-active':units && units.indexOf(parseInt(item))>-1 ,'text-primary': option.kType==i}" class="is-grow" @click="option.kType = i,unitChange && unitChange(i)">
        {{ item }}
      </span>
      <van-dropdown-menu class="k-tabs">
        <van-dropdown-item :title="kTitle" :title-class="hideKTypes[option.kType]?'text-primary':null" get-container="body">
          <!-- 更多 -->
          <div class="is-flex-center has-text-centered van-hairline--top text-14px text-shallow">
            <span v-for="(item, i) in hideKTypes" :key="i" :class="{ 'text-primary': option.kType==i }" class="my-2 px-3 has-text-weight-light van-hairline--right" @click="option.kType = i,unitChange && unitChange(i)">
              {{ item }}
            </span>
            <span class="is-grow" />
          </div>
        </van-dropdown-item>
        <van-dropdown-item :title="$t('exchange.indicators')" get-container="body">
          <!-- 主图 -->
          <div class="is-flex-center has-text-centered van-hairline--top text-14px text-shallow">
            <span class="px-3 van-hairline--right has-text-weight-light">{{$t('exchange.primaryIndicators')}}</span>
            <span v-for="item in technicals1" :key="item.technical" :class="{ 'text-primary': option.technical1==item.technical }" class="is-grow py-2 has-text-weight-light" @click="option.technical1 = item.technical">
              {{ item.technical }}
            </span>
          </div>
          <!-- 副图 -->
          <div class="is-flex-center has-text-weight-light has-text-centered van-hairline--top text-14px text-shallow">
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
import dayjs from 'dayjs'
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
      calcParams: {
        MA: [5, 10, 30],
      },
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
    if (this.data.symbolCode.startsWith('diem')) {
      precision = 10
    }

    const chart = init(this.$refs.kline, this.getStyle())
    chart.setPriceVolumePrecision(precision, precision)

    // 设置初始化的指标值
    chart.createTechnicalIndicator(
      {
        name: this.option.technical1,
        calcParams: this.calcParams[this.option.technical1],
      },
      false,
      {
        id: 'candle_pane',
      }
    )

    // 设置一条数据宽度
    chart.setDataSpace(8)
    // 设置图表右边可以空出来的间隙。
    chart.setOffsetRightSpace(10)

    // 增加指标
    chart.createTechnicalIndicator('VOL', false, {
      height: 80,
    })

    this.technical2 = chart.createTechnicalIndicator(
      this.option.technical2,
      false,
      {
        id: 'candle_pane2',
        height: 110,
      }
    )
    chart.loadMore(this.getData)
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
    'option.technical1': function (name) {
      this.chart.createTechnicalIndicator(
        {
          name,
          calcParams: this.calcParams[name],
        },
        false,
        {
          id: 'candle_pane',
        }
      )
    },
    'option.technical2': function (name) {
      // this.chart.overrideTechnicalIndicator({ name: val }, 'candle_pane2')
      this.chart.createTechnicalIndicator(
        { name, calcParams: this.calcParams[name] },
        false,
        {
          id: 'candle_pane2',
        }
      )
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
        const style = this.getStyle()
        style.candle.type = 'area'
        this.chart.setStyleOptions(style)
        return '1min'
      }
      this.chart.setStyleOptions(this.getStyle())
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
              p.timestamp = p.timestamp*1000
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
          data.timestamp = data.timestamp*1000
          this.chart.updateData(data)
        })
        .catch(() => {
          this.updateing = false
        })
    },
    getStyle() {
      return {
        // 网格线
        grid: {
          show: false,
        },
        // 蜡烛图
        candle: {
          // 蜡烛图上下间距，大于1为绝对值，大于0小余1则为比例
          margin: {
            top: 70,
            bottom: 20,
          },
          // 蜡烛图类型 'candle_solid'|'candle_stroke'|'candle_up_stroke'|'candle_down_stroke'|'ohlc'|'area'
          type: 'candle_solid',
          // 蜡烛柱
          bar: {
            upColor,
            downColor,
            noChangeColor: '#888888',
          },
          // 面积图
          area: {
            lineSize: 2,
            lineColor: '#2196F3',
            value: 'close',
            backgroundColor: [
              {
                offset: 0,
                color: 'rgba(33, 150, 243, 0.01)',
              },
              {
                offset: 1,
                color: 'rgba(33, 150, 243, 0.2)',
              },
            ],
          },
          priceMark: {
            show: true,
            // 最高价标记
            high: {
              show: true,
              color: '#D9D9D9',
              textMargin: 5,
              textSize: 10,
              textFamily: 'Helvetica Neue',
              textWeight: 'normal',
            },
            // 最低价标记
            low: {
              show: true,
              color: '#D9D9D9',
              textMargin: 5,
              textSize: 10,
              textFamily: 'Helvetica Neue',
              textWeight: 'normal',
            },
            // 最新价标记
            last: {
              show: true,
              upColor: '#ddd',
              downColor: '#ddd',
              noChangeColor: '#888888',
              line: {
                show: false,
                // 'solid'|'dash'
                style: 'dash',
                dashValue: [4, 4],
                size: 1,
              },
              text: {
                show: true,
                size: 12,
                paddingLeft: 2,
                paddingTop: 2,
                paddingRight: 2,
                paddingBottom: 2,
                color: '#333',
                family: 'Helvetica Neue',
                weight: 'normal',
                borderRadius: 2,
              },
            },
          },
          // 提示
          tooltip: {
            // 'always' | 'follow_cross' | 'none'
            showRule: 'always',
            // 'standard' | 'rect'
            showType: 'standard',
            // labels: ['时间', '开', '收', '高', '低', '成交量'],
            // labels: [
            //   // this.$t('exchange.ktime'),
            //   '',
            //   this.$t('exchange.kopen'),
            //   this.$t('exchange.kclose'),
            //   this.$t('exchange.khigh'),
            //   this.$t('exchange.klow'),
            //   this.$t('exchange.kvol'),
            // ],
            // values:null,
            labels: [
              '',
              this.$t('exchange.kopen'),
              this.$t('exchange.kclose'),
              this.$t('exchange.kvol'),
            ],
            values: val => {
              return [
                dayjs(val.timestamp).format('YYYY-MM-DD HH:mm'),
                val.open,
                val.close,
                val.vol.toFixed(2),
              ]
            },
            defaultValue: 'n/a',
            rect: {
              paddingLeft: 0,
              paddingRight: 10,
              paddingTop: 4,
              paddingBottom: 0,
              offsetLeft: 8,
              offsetTop: 22,
              offsetRight: 8,
              borderRadius: 4,
              borderSize: 1,
              borderColor: '#3f4254',
              backgroundColor: 'rgba(17, 17, 17, 0)',
            },
            text: {
              size: 10,
              family: 'Helvetica Neue',
              weight: 'normal',
              color: '#999',
              marginLeft: 6,
              marginTop: 4,
              marginRight: 0,
              marginBottom: 10,
            },
          },
        },
        // 技术指标
        technicalIndicator: {
          margin: {
            top: 36,
            bottom: 1,
          },
          bar: {
            upColor,
            downColor,
            noChangeColor: '#888888',
          },
          line: {
            size: 1,
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
            upColor: '#26A69A',
            downColor: '#EF5350',
            noChangeColor: '#888888',
          },
          // 最新值标记
          lastValueMark: {
            show: false,
            text: {
              show: false,
              color: '#ffffff',
              size: 10,
              family: 'Helvetica Neue',
              weight: 'normal',
              paddingLeft: 3,
              paddingTop: 2,
              paddingRight: 3,
              paddingBottom: 2,
              borderRadius: 2,
            },
          },
          // 提示
          tooltip: {
            // 'always' | 'follow_cross' | 'none'
            showRule: 'always',
            // 'standard' | 'rect'
            showType: 'standard',
            showName: true,
            showParams: true,
            defaultValue: 'n/a',
            text: {
              size: 10,
              family: 'Helvetica Neue',
              weight: 'normal',
              color: '#D9D9D9',
              marginTop: 4,
              marginRight: 0,
              marginBottom: 0,
              marginLeft: 6,
            },
          },
        },
        // x轴
        xAxis: {
          show: true,
          height: null,
          // x轴线
          axisLine: {
            show: false,
            color: '#888888',
            size: 1,
          },
          // x轴分割文字
          tickText: {
            show: true,
            color: '#D9D9D9',
            family: 'Helvetica Neue',
            weight: 'normal',
            size: 10,
            paddingTop: 3,
            paddingBottom: 6,
          },
          // x轴分割线
          tickLine: {
            show: true,
            size: 1,
            length: 4,
            color: '#888888',
          },
        },
        // y轴
        yAxis: {
          show: true,
          width: null,
          // 'left' | 'right'
          position: 'right',
          // 'normal' | 'percentage' | 'log'
          type: 'normal',
          inside: false,
          // y轴线
          axisLine: {
            show: false,
            color: '#888888',
            size: 1,
          },
          // x轴分割文字
          tickText: {
            show: true,
            color: '#999',
            family: 'Helvetica Neue',
            weight: 'normal',
            size: 12,
            paddingLeft: 3,
            paddingRight: 6,
          },
          // x轴分割线
          tickLine: {
            show: false,
            size: 1,
            length: 3,
            color: '#888888',
          },
        },
        // 图表之间的分割线
        separator: {
          size: 0,
          color: 'rgba(230, 230, 230, 0)',
          fill: true,
          activeBackgroundColor: 'rgba(230, 230, 230, 0)',
        },
        // 十字光标
        crosshair: {
          show: true,
          // 十字光标水平线及文字
          horizontal: {
            show: true,
            line: {
              show: true,
              // 'solid'|'dash'
              style: 'dash',
              dashValue: [2, 2],
              size: 1,
              color: '#888888',
            },
            text: {
              show: true,
              color: '#D9D9D9',
              size: 12,
              family: 'Helvetica Neue',
              weight: 'normal',
              paddingLeft: 2,
              paddingRight: 2,
              paddingTop: 2,
              paddingBottom: 2,
              borderSize: 1,
              borderColor: '#505050',
              borderRadius: 2,
              backgroundColor: '#505050',
            },
          },
          // 十字光标垂直线及文字
          vertical: {
            show: true,
            line: {
              show: true,
              // 'solid'|'dash'
              style: 'dash',
              dashValue: [2, 2],
              size: 1,
              color: '#888888',
            },
            text: {
              show: false,
              color: '#D9D9D9',
              size: 12,
              family: 'Helvetica Neue',
              weight: 'normal',
              paddingLeft: 2,
              paddingRight: 2,
              paddingTop: 2,
              paddingBottom: 2,
              borderSize: 1,
              borderColor: '#505050',
              borderRadius: 2,
              backgroundColor: '#505050',
            },
          },
        },
        // 图形
        shape: {
          point: {
            backgroundColor: '#2196F3',
            borderColor: '#2196F3',
            borderSize: 1,
            radius: 4,
            activeBackgroundColor: '#2196F3',
            activeBorderColor: '#2196F3',
            activeBorderSize: 1,
            activeRadius: 6,
          },
          line: {
            // 'solid'|'dash'
            style: 'solid',
            color: '#2196F3',
            size: 1,
            dashValue: [2, 2],
          },
          polygon: {
            // 'stroke'|'fill'
            style: 'stroke',
            stroke: {
              // 'solid'|'dash'
              style: 'solid',
              size: 1,
              color: '#2196F3',
              dashValue: [2, 2],
            },
            fill: {
              color: 'rgba(33, 150, 243, 0.1)',
            },
          },
          arc: {
            // 'stroke'|'fill'
            style: 'stroke',
            stroke: {
              // 'solid'|'dash'
              style: 'solid',
              size: 1,
              color: '#2196F3',
              dashValue: [2, 2],
            },
            fill: {
              color: '#2196F3',
            },
          },
          text: {
            style: 'fill',
            color: '#2196F3',
            size: 10,
            family: 'Helvetica Neue',
            weight: 'normal',
            offset: [0, 0],
          },
        },
        annotation: {
          // 'top' | 'bottom' | 'point'
          position: 'top',
          offset: [20, 0],
          symbol: {
            // 'diamond' | 'circle' | 'rect' | 'triangle' | 'custom' | 'none'
            type: 'diamond',
            size: 8,
            color: '#2196F3',
            activeSize: 10,
            activeColor: '#FF9600',
          },
        },
        tag: {
          // 'top' | 'bottom' | 'point'
          position: 'point',
          offset: 0,
          line: {
            show: true,
            style: 'dash',
            dashValue: [2, 2],
            size: 1,
            color: '#2196F3',
          },
          text: {
            color: '#FFFFFF',
            backgroundColor: '#2196F3',
            size: 10,
            family: 'Helvetica Neue',
            weight: 'normal',
            paddingLeft: 2,
            paddingRight: 2,
            paddingTop: 2,
            paddingBottom: 2,
            borderRadius: 2,
            borderSize: 1,
            borderColor: '#2196F3',
          },
          mark: {
            offset: 0,
            color: '#FFFFFF',
            backgroundColor: '#2196F3',
            size: 10,
            family: 'Helvetica Neue',
            weight: 'normal',
            paddingLeft: 2,
            paddingRight: 2,
            paddingTop: 2,
            paddingBottom: 2,
            borderRadius: 2,
            borderSize: 1,
            borderColor: '#2196F3',
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
.van-popup {
  background-color: #121e36;
  .van-hairline--top {
    background-color: #121e36;
  }
}
.van-hairline--top::after,
.van-hairline--right::after {
  border-color: #000;
}
.bicai-active {
  // color: green;
}
</style>
