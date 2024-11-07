<template>
  <div ref="echart" class="echart" :style="{width,height}">
  </div>
</template>

<script>
// import * as echarts from 'echarts'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts' // 注册必须的组件
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  GridComponent,
  DatasetComponent,
  TransformComponent,
} from 'echarts/components'
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'
// 注册必须的组件
echarts.use([
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
])

export default {
  name: 'echart',
  props: {
    msg: String,
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '130px',
    },
    symbol: {
      type: String,
      default: 'btcusdt',
    },
  },
  data() {
    return {
      myChart: null,
    }
  },
  created() {
    this.init()
  },
  mounted() {
    this.myChart = echarts.init(this.$refs.echart)
  },
  methods: {
    init() {
      this.$http
        .get(`marketsituation/kline?symbol=${this.symbol}&period=5min&size=100`)
        .then(res => {
          this.draw(res)
        })
    },
    draw(res) {
      this.myChart.setOption({
        grid: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [],
        },
        yAxis: {
          type: 'value',
          min: function (value) {
            return value.min - (value.max - value.min) / 4
          },
          splitLine: {
            show: false,
          },
        },
        series: [
          {
            data: res.map(item => item.close),
            type: 'line',
            lineStyle: {
              width: 2,
              color: '#62CF8A',
            },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(155, 233, 184, 0.3)',
                },
                {
                  offset: 1,
                  color: 'rgb(98, 207, 130, 0)',
                },
              ]),
            },
          },
        ],
      })
    },
  },
}
</script>

<style scoped lang="scss"></style>