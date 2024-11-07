<template>
  <BackPanel :title="$t('app.licaijl')">
    <div class="lclist-item" v-for="(item, index) in list" :key="index">
      <div class="top">
        <div>
          <span class="blod">{{item.productName}}</span>/{{item.currency}}
        </div>
        <div class="time">{{$t('licai.mrsj')}}：{{item.createTime}}</div>
      </div>
      <div class="middle">
        <div>
          <span class="day">{{item.productName}}</span>
          <span class="syl" style="display: block">
            <span style="color:#B1B2B3;">{{$t('licai.syl').replace("%s",(item.profitTimeValue+(item.profitTimeType=="min"?$t('licai.min'):$t('licai.day'))))}}</span>
            ：<span style="color:#E86072">{{item.profitRate}}%</span></span>
        </div>
        <div>
          <div class="qs">{{item.profitTime*item.profitTimeValue}}{{(item.profitTimeType=="min"?$t('licai.min'):$t('licai.day'))}}</div>
        </div>
        <div>
          <div class="qs red">{{item.purchaseAmount}}</div>
          <div class="sy">+{{item.profitAmount}}</div>
        </div>
      </div>
      <div class="bottom van-hairline--top">
        <span class="time">{{$t('licai.mcsj')}}：{{item.endReleaseTime}}</span>
      </div>
    </div>
  </BackPanel>
</template>

<script>
import BackPanel from '@/components/layout/BackPanel.vue'
import { get } from 'vuex-pathify'
export default {
  components: { BackPanel },
  data() {
    return {
      list: [],
      show: false,
      num: ''
    }
  },
  computed: {
    user: get('user/info'),
  },
  mounted() {
    this.$http.get('product/productOrderList').then(data => this.list = data)
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.lclist-item {
  font-family: PingFangSC-Semibold;
  position: relative;
  width: 355px;
  background: #FFFFFF;
  border-radius: 4px;
  margin: 10px auto 0;
  padding: 10px 12px 0px 12px;
  box-sizing: border-box;
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 31px;
    line-height: 31px;
    font-size: 12px;
    color: #999999;
    font-weight: 600;
  }
  .time {
    font-size: 10px;
    color: #999999;
  }
  .bottom {
    line-height: 24px;
    height: 24px;
  }
  .middle {
    height: 67px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding-top: 10px;
    box-sizing: border-box;
    .day {
      font-size: 18px;
      color: #333333;
      text-align: center;
      font-weight: 600;
    }
    .qs {
      line-height: 30px;
      font-size: 18px;
      color: #333333;
      text-align: center;
      font-weight: 600;
    }
    .sy {
      font-size: 13px;
      color: #EB6175;
      text-align: center;
      font-weight: 500;
    }
    .red {
      color: #EB6175;
    }
  }
}
</style>
