<template>
  <BackPanel :title="$t('app.licai')">
    <div class="lc-item" v-for="(item, index) in list" :key="index">
      <div class="top">
        <span class="blod">{{item.productName}}</span>/{{item.currency}}
        <span style="color:#E86072">{{$t("licai.remain")}}：{{item.remainingNumber}}</span>
      </div>
      <div class="middle">
        <span class="nf">{{item.profitRate}}%</span>
        <span class="day">{{item.profitTime*item.profitTimeValue}}{{(item.profitTimeType=="min"?$t('licai.min'):$t('licai.day'))}}</span>
      </div>
      <div class="bottom">
        <span class="syl">{{$t('licai.syl').replace("%s",(item.profitTimeValue+(item.profitTimeType=="min"?$t('licai.min'):$t('licai.day'))))}}</span>
        <!--<span>{{item.purchaseAmountMin}}{{$t('licai.qg')}}</span>-->
      </div>
      <div class="btn" @click="shopId(item.id, item.currency, item.purchaseAmountMin)">
        {{$t('licai.ljgm')}}
      </div>
    </div>
    <van-popup v-model="show" round position="bottom" safe-area-inset-bottom :style="{ height: '70%' }">
      <div class="content">
        <p class="title">{{$t('exchange.minMoney')}}:{{purchaseAmountMin}}</p>
        <div class="inpu van-hairline--bottom">
          <div class="nums">{{num ? num : $t('licai.ts')}}</div>
          <div class="handle">
            <span>{{ gmCurrency }}</span>
            <span class="line van-hairline--left"></span>
            <span class="all" @click="selectAll">{{$t('licai.all')}}</span>
          </div>
        </div>
        <div class="btn" @click="buy">
          {{$t('licai.qsgm')}}
        </div>
      </div>
      <van-number-keyboard
        :show="true"
        v-model="num"
        extra-key="."
      />
    </van-popup>
  </BackPanel>
</template>

<script>
import BackPanel from '@/components/layout/BackPanel.vue'
import { get } from 'vuex-pathify'
import { Toast } from 'vant'

export default {
  components: { BackPanel },
  data() {
    return {
      show: false,
      gmCurrency: '',
      purchaseAmountMin: '',
      num: '',
      list: []
    }
  },
  computed: {
    user: get('user/info'),
    userWallet: get('user/wallet'),
  },
  mounted() {
    this.$http.get('product/productInfoList').then(data => this.list = data)
  },
  methods: {
    buy() {
      this.$http.post('product/buyProducts', {
        productId: this.id,
        buyProducts: this.num
      }, true).then(() => {
        this.$toast('success')
        this.$router.push('/licaiList')
      }).catch((err) => {
        console.log(err.data)
        if(err.data == null) {
          Toast.fail(window.i18n.t(`service.${err.msg}`))
        }else {
          Toast.fail(window.i18n.t(`service.${err.msg}`)+err.data)
        }
      })
    },
    shopId(id, gmCurrency, purchaseAmountMin) {
      this.id = id
      this.show = true
      this.gmCurrency = gmCurrency
      this.purchaseAmountMin = purchaseAmountMin
    },
    selectAll() {
      this.num = this.userWallet[0].balance
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.lc-item {
  font-family: PingFangSC-Semibold;
  position: relative;
  width: 355px;
  height: 100px;
  background: #FFFFFF;
  border-radius: 4px;
  margin: 10px auto 0;
  padding: 10px 17px 12px 12px;
  box-sizing: border-box;
  .top {
    height: 31px;
    line-height: 31px;
    font-size: 12px;
    color: #999999;
    font-weight: 600;
  }
  .blod {
    font-size: 15px;
    color: #333333;
    font-weight: 600;
  }
  .middle {
    line-height: 33px;
    height: 33px;
    margin-top: 3px;
    font-size: 24px;
    color: #E86072;
    font-weight: 600;
    display: flex;
    align-items: center;
    .nf {
      width: 137px;
      text-align: left;
      display: inline-block;
    }
    .day {
      display: inline-block;
      line-height: 33px;
      font-size: 18px;
      color: #333333;
      text-align: center;
      font-weight: 600;
    }
  }
  .bottom {
    height: 14px;
    font-size: 13px;
    color: #B1B2B3;
    text-align: left;
    font-weight: 500;
    .syl {
      margin-right: 98px;
    }
  }
  .btn {
    position: absolute;
    top: 41px;
    right: 17px;
    background: #EB6175;
    border-radius: 3px;
    font-size: 15px;
    color: #FFFFFF;
    text-align: center;
    font-weight: 500;
    line-height: 28px;
    padding: 0 9px;
    box-sizing: border-box;
  }
}
.content {
  height: 222px;
  padding: 22px 15px;
  box-sizing: border-box;
  .title {
    margin: 0px;
    line-height: 22px;
    font-size: 16px;
    color: #999999;
    text-align: left;
    font-weight: 600;
  }
  .inpu {
    margin-top: 16px;
    height: 57px;
    line-height: 57px;
    width: 345px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .nums {
      text-align: left;
      font-size: 15px;
      color: #999999;
    }
    .handle {
      font-size: 15px;
      color: #666666;
      text-align: center;
      .line {
        margin: 0 7px;
      }
      .all {
        color: #3181FF;
      }
    }
  }
  .btn {
    margin-top: 33px;
    width: 345px;
    background: #357DEC;
    border-radius: 3px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 16px;
    color: #FFFFFF;
    text-align: center;
    font-weight: 500;
  }
}
</style>
