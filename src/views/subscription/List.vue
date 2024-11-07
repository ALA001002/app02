<template>
  <div class="subscription-list">
    <van-nav-bar
      :title="$t('subscription.listitle')"
      safe-area-inset-top
      @click-left="$router.back()"
    >
      <template #left>
        <img class="activity-back" src="@/assets/images/activity/return.png" alt="">
      </template>
    </van-nav-bar>
    <div class="top">
      <span style="width: 30%;">{{$t('subscription.listtop1')}}</span>
      <span style="width: 35%;">{{$t('subscription.listtop2')}}</span>
      <span style="width: 35%;">{{$t('subscription.listtop3')}}</span>
    </div>
    <div class="list">
      <div class="li" v-for="(item, index) in list" :key="index">
        <span style="width: 30%;">{{item.amount}}</span>
        <span style="width: 35%;">{{item.operateTime}}</span>
        <span style="width: 35%;">{{item.releaseTime}}</span>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SubscriptionList',
  components: {

  },
  data() {
    return {
      list: []
    }
  },
  computed: {

  },
  mounted() {
    this.$http.api.get('asset/myExchangeList?coin=DIEM').then(data => {
      this.list = data.data
    })
  },
  methods: {
    changeTabs(val) {
      this.current = val
    }
  }
}
</script>
<style lang="scss" scoped>
.subscription-list {
  .activity-back {
    width: 17px;
    height: 16px;
  }
  .van-hairline--bottom::after {
    border: none;
  }
  .top {
    width: 375px;
    height: 36px;
    line-height: 36px;
    background:#F6F7FA;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 11px;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: #999999;
    text-align: left;
  }
  .list {
    .li {
      text-align: left;
      padding: 0 20px;
      line-height: 40px;
      height: 40px;
      font-size: 10px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #333333;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>

