<template>
  <div class="property">
    <van-nav-bar
      fixed
      :title="$t('subscription.property')"
      safe-area-inset-top
      @click-left="$router.back()"
    >
      <template #left>
        <img class="activity-back" src="@/assets/images/activity/return.png" alt="">
      </template>
    </van-nav-bar>
    <van-tabs
      v-model="active"
      :offset-top="45"
      sticky
      background="#F6F7FA"
      color="#2884F7"
      :swipe-threshold="6"
      :before-change="beforeChange"
    >
      <van-tab :title="$t('subscription.bb')">
        <!-- <div class="search">
          <van-checkbox v-model="checked" shape="square" checked-color="#2884F7">隐藏小币种</van-checkbox>
          <div class="input-w">
            <img class="search-icon" src="@/assets/images/activity/search.png" alt="">
            <input type="text" class="search-input" v-model="value1" placeholder="搜索">
          </div>
        </div> -->
        <div class="tab van-hairline--top-bottom" v-for="(item, index) in wallet" :key="index">
          <div class="top">
            <span>{{item.currency}}</span>
            <router-link :to="'/wallet/details/'+item.currency">
              <van-icon class="right-icon" name="arrow" />
            </router-link>

          </div>
          <div class="middle">
            <span style="width: 33%;">{{$t('subscription.ky')}}</span>
            <span style="width: 33%;">{{$t('subscription.dj')}}</span>
            <span style="width: 33%;">{{$t('subscription.zhm')}}</span>
          </div>
          <div class="bottom">
            <span style="width: 33%;">{{item.balance}}</span>
            <span style="width: 33%;">0.00</span>
            <span style="width: 33%;color: #999999;">{{item.usdPrice}}</span>
          </div>
        </div>
      </van-tab>
      <van-tab :title="$t('app.contract')"></van-tab>
      <van-tab :title="$t('subscription.fb')"></van-tab>
      <van-tab :title="$t('exchange.leverage')"></van-tab>
      <van-tab :title="$t('subscription.bc')"></van-tab>
    </van-tabs>
    <div style="height: 60px;"></div>
  </div>
</template>
<script>
import { Toast } from 'vant'
import { get, sync } from 'vuex-pathify'
export default {
  data() {
    return {
      value1: '',
      active: 0,
      checked: false
    }
  },
  computed: {
    user: get('user/info'),
    see: sync('config@see'),
    wallet: get('user/wallet'),
    hqList: get('hq/hq'),
    links() {
      return [
        { name: this.$t('app.deposit'), icon: 'chongzhi', to: '/wallet/deposit' },
        { name: this.$t('app.withdraw'), icon: 'tibi', to: '/wallet/withdraw' },
        { name: this.$t('app.contract'), icon: 'huazhuan', to: '/contract' },
        { name: this.$t('subscription.property'), icon: 'OTC', to: '/property' },
        // { name: this.$t('app.otc'), icon: 'OTC', to: '/otc' }
      ]
    }
  },
  methods: {
    beforeChange() {
      Toast(this.$t('subscription.noopen'))
      return false
    }
  }
}
</script>
<style lang="scss" scoped>
.property {
  padding-top: 45PX;
  .activity-back {
    width: 17px;
    height: 16px;
  }
  .van-hairline--bottom::after {
    border: none;
  }
  ::v-deep {
    .van-tabs__wrap {
      height: 36px;
    }
    .van-nav-bar {
      height: 45PX;
    }
  }
  .search {
    height: 40px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    font-family: PingFang-SC-Bold, PingFang-SC;
    font-weight: bold;
    color: #aaaaaa;
    ::v-deep {
      .van-checkbox__label {
        color: #aaaaaa;
      }
    }
    .input-w {
      width: 100px;
      height: 28px;
      border-radius: 2px;
      border: 1px solid #ECECEC;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 5px;
      box-sizing: border-box;
      .search-icon {
        width: 17px;
        height: 17px;
      }
      .search-input {
        width: 60px;
        outline: none;
        border: none;
      }
    }
  }
  .tab {
    padding:10px 20px;
    box-sizing: border-box;
    height: 75px;
    background: #FFFFFF;
    .top {
      display: flex;
      justify-content: space-between;
      height: 20px;
      font-size: 14px;
      font-family: Eina03-Bold, Eina03;
      font-weight: bold;
      color: #2884F7;
      line-height: 20px;
      .right-icon {
        font-size: 10px;
        color: #999999;
      }
    }
    .middle {
      display: flex;
      justify-content: space-between;
      color: #999999;
      height: 20px;
      font-size: 10px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 20px;
      span {
        text-align: left;
      }
      span:last-child {
        text-align: right;
      }
    }
    .bottom {
      display: flex;
      justify-content: space-between;
      color: #333333;
      height: 20px;
      font-size: 10px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 20px;
      span {
        text-align: left;
      }
      span:last-child {
        text-align: right;
      }
    }
  }
}
</style>
