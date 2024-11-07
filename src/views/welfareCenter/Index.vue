<template>
  <Layout>
    <NavBar slot="header" back></NavBar>
    <div class="section py-0">
      <div class="big-title">{{$t('extra.welfareCenter')}}</div>
      <div class="flex-between bg-white radius-mid text-black">
        <input type="text" class="input flex1 text-15px" :placeholder="$t('extra.switchKey')" style="text-indent:1em">
        <div class="btn">{{$t('wallet.switch')}}</div>
      </div>
      <div class="text-primary text-15px mt-2">{{$t('extra.switchRecord')}}</div>
    </div>
    <div class=" mt-5 text-shallow section py-4" style="background:#F2F2F2">
      <div class="bg-title">{{$t('extra.myTask')}}</div>
      <div class="card mt-4 p-0" v-for="i in 2" :key="i">
        <div class="p-4">
          <div class="flex-between mt-2">
            <div class="tag-box mr-2 tc ">
              <div class="text-20px mt-4">$30</div>
              <div class="text-13px mt-2">体验金</div>
            </div>
            <div class="flex1">
              <div class="item-title">WindkExchange ｜ 充值返利，天降好礼</div>
              <div class="tag">14天</div>
            </div>
          </div>
          <div class="text-12px mt-4 pt-1" style="line-height:1.6">即日起至2022年3月10日上午10点（UTC），充值任意合格资产，赚取高达$3,000体验金</div>
        </div>
        <div class="bg-white p-4 mt-3">
          <div class="text-12px bb pt-4 pb-3 mb-24">到期日期：2022-03-04 18:52:13 （UTC）</div>
          <div class="main-btn mb-4">立即充值</div>
        </div>
      </div>
      <div class="bg-title mt-5">{{$t('extra.referFriend')}}</div>
      <div class="card mt-4 p-0 bg-white">
        <div class="p-4">
          <div class="flex-between mt-2">
            <div class="tag-box mr-2 tc " style="background: linear-gradient(180deg, #F5B319 0%, #FBD029 100%);">
              <img class="box36 mt-3" src="@/assets/images/new/welfare_invitate.svg">
              <div class="text-13px mt-2">体验金</div>
            </div>
            <div class="flex1 ">
              <div class="item-title text-24px mt-6">$1000</div>
            </div>
          </div>
          <div class="text-12px mt-4 pt-1 bb pb-4" style="line-height:1.6">每次推荐成功后，您及好友均可获得$20体验金。您还可以赢得价值最高$1000的不限量福利卡</div>
          <div class="main-btn mb-2 mt-4">立即充值</div>
        </div>
      </div>
      <div class="card mt-5 p-0 bg-white">
        <div style="padding:20px 30px">
          <div class="card-title">{{$t('extra.termsOfService')}}</div>
          <pre class="content">什么是体验金?体验金可作交易保证金,亦可抵扣交易永续合约和交割合约时(不包括现货)的账户亏损和手续费。在抵扣相应费用时,体验金将优先于用户的自有本金被抵扣。
            体验金不能提现,但使用体验金进行交易获得的盈利可提现。
            什么是抵扣金?抵扣金仅可抵扣交易永续合约和交割合时(不包括现货)的手续费用。在抵扣、应费用时,抵扣金将优先于用户的自有本金被抵扣。
            充值哪个币种可以领取首充大礼包，您可对 Bybit 平台上的任何币种进行充值。
            如何查看已领取的体验金和抵扣金?请在＂我的福利＂页面查看已领取的体验金和抵扣金细则。体验金总余额也可以在＂资产＂页面查看。您的体验金/抵扣金金额是根据分发时的实时汇率计算的。
          </pre>
        </div>
      </div>
      <div class="card mt-5 p-0 bg-white">
        <div style="padding:20px 30px">
          <div class="card-title">{{$t('extra.commonProblem')}}</div>
          <pre class="content">什么是体验金?体验金可作交易保证金,亦可抵扣交易永续合约和交割合约时(不包括现货)的账户亏损和手续费。在抵扣相应费用时,体验金将优先于用户的自有本金被抵扣。
            体验金不能提现,但使用体验金进行交易获得的盈利可提现。
            什么是抵扣金?抵扣金仅可抵扣交易永续合约和交割合时(不包括现货)的手续费用。在抵扣、应费用时,抵扣金将优先于用户的自有本金被抵扣。
            充值哪个币种可以领取首充大礼包，您可对 Bybit 平台上的任何币种进行充值。
            如何查看已领取的体验金和抵扣金?请在＂我的福利＂页面查看已领取的体验金和抵扣金细则。体验金总余额也可以在＂资产＂页面查看。您的体验金/抵扣金金额是根据分发时的实时汇率计算的。
          </pre>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import { parseTime } from '@/utils/helper'

export default {
  data() {
    return {
      loading: true,
    }
  },
  created() {},
  methods: {
    parseTime,
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.btn {
  background: #f8c353;
  width: 80px;
  height: 50px;
  border-radius: 8px;
  text-align: center;
  line-height: 50px;
  font-size: 15px;
}
.content {
  word-break: break-all;
  white-space: pre-wrap;
}
.card-title {
  font-size: 24px;
  color: #100f15;
  font-weight: bold;
  margin: 8px 0 30px;
}
.main-btn {
  width: 223px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  font-size: 16px;
  color: #100f14;
  background: linear-gradient(270deg, #f5a600 0%, #fbd200 100%);
  border-radius: 25px;
  font-weight: 500;
}
.bg-title {
  background-image: url('~@/assets/images/new/welfare_task.svg');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center top;
  height: 40px;
  padding-top: 20px;
  font-size: 20px;
  color: #212226;
  display: inline-block;
  font-weight: bold;
}
.card {
  background: #f5f5f5;
  border-radius: 8px;
  box-shadow: 2px 2px 8px 0px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  .tag-box {
    width: 80px;
    height: 90px;
    background: linear-gradient(180deg, #e75d55 0%, #f5968e 100%);
    border-radius: 8px;
    color: #fff;
  }
  .item-title {
    font-size: 20px;
    font-weight: 500;
    color: #e9665e;
    line-height: 32px;
  }
  .tag {
    background: #d8d8d8;
    border-radius: 10px;
    color: #999999;
    height: 16px;
    padding: 0 15px;
    font-size: 10px;
  }
  .bb {
    border-bottom: 1px solid #e2e2e2;
  }
}
.bg-white {
  background: #fff !important;
}
</style>
