<template>
  <Layout>
    <div class="activity">
      <div class="section pb-1 has-text-centered header" slot="header">
        <span class="has-text-weight-bold is-size-6">{{ $t("activity.titie") }}</span>
      </div>
      <!-- <van-nav-bar
        :title="$t('activity.titie')"
        safe-area-inset-top
        @click-left="$router.back()"
      >
        <template #left>
          <img class="activity-back" src="@/assets/images/activity/return.png" alt="">
        </template>
      </van-nav-bar> -->
      <div class="countdown">
        <div class="title">{{$t('activity.rgdjs')}}</div>
        <van-count-down :time="time">
          <template #default="timeData">
            <div class="time">
              <span class="block">{{ timeData.days }}</span>
              <span class="colon">{{$t('activity.days')}}</span>
              <span class="block">{{ timeData.hours }}</span>
              <span class="colon">{{$t('activity.hours')}}</span>
              <span class="block">{{ timeData.minutes }}</span>
              <span class="colon">{{$t('activity.minutes')}}</span>
              <span class="block">{{ timeData.seconds }}</span>
              <span class="colon">{{$t('activity.seconds')}}</span>
            </div>
          </template>
        </van-count-down>
      </div>
      <div class="tabs">
        <div class="tabs-item tabs-1" :class="{'active-tab1': current === 0}" @click="changeTabs(0)">{{$t('activity.tabs1')}}</div>
        <div class="tabs-item tabs-2" :class="{'active-tab2': current === 1}" @click="changeTabs(1)">{{$t('activity.tabs2')}}</div>
        <div class="tabs-item tabs-3" :class="{'active-tab2': current === 2}" @click="changeTabs(2)">{{$t('activity.tabs3')}}</div>
        <div class="tabs-item tabs-4" :class="{'active-tab4': current === 3}" @click="changeTabs(3)">{{$t('activity.tabs4')}}</div>
      </div>
      <div v-show="current === 0">
        <ActivitiesOnline @switchTab="changeTabs" />
      </div>
      <div v-show="current === 1">
        <InviteProfit />
      </div>
      <div v-show="current === 2">
        <SubscribeToNew />
      </div>
      <div v-show="current === 3">
        <ParticipateInLuckyDraw />
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from '@/components/layout/Index.vue'
import ActivitiesOnline from './ActivitiesOnline'
import InviteProfit from './InviteProfit'
import SubscribeToNew from './SubscribeToNew'
import ParticipateInLuckyDraw from './ParticipateInLuckyDraw'
export default {
  name: 'Activity',
  components: {
    Layout,
    ActivitiesOnline,
    InviteProfit,
    SubscribeToNew,
    ParticipateInLuckyDraw
  },
  data() {
    return {
      current: 2,
      time: '',
    }
  },
  computed: {

  },
  mounted() {
    this.$http.get('common/countdownTime').then(data => {
      this.time = Number(data) -  (+ new Date())
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
.activity {
  overflow: hidden;
  .activity-back {
    width: 17px;
    height: 16px;
  }
  .van-hairline--bottom::after {
    border: none;
  }
  .countdown {
    width: 335px;
    height: 114px;
    background: #FFFFFF;
    box-shadow: 0px 10px 20px 0px rgba(117, 117, 170, 0.1);
    border-radius: 10px;
    border: 1px solid #F0F0F0;
    margin: 27px auto 30px;
    .title {
      margin: 18px auto 25px;
      width: 206px;
      height: 20px;
      font-size: 14px;
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color: #333333;
      line-height: 20px;
      letter-spacing: 1px;
      position: relative;
      text-align: center;
    }
    .title::before {
      position: absolute;
      top: 9px;
      left: -55px;
      content: "";
      width: 50px;
      height: 2px;
      background: linear-gradient(90deg, #FFFFFF 0%, #D8D8D8 100%);
    }
    .title::after {
      position: absolute;
      top: 9px;
      right: -55px;
      content: "";
      width: 50px;
      height: 2px;
      background: linear-gradient(90deg, #D8D8D8 0%,#FFFFFF 100%);
    }
    .time {
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      width: 260px;
      height: 25px;
      line-height: 25px;
      background: #ECECF2;
      border-radius: 13px;
    }
    .colon {
      width: 14px;
      margin: 0 5px;
      height: 20px;
      font-size: 14px;
      font-family: PingFang-SC-Heavy, PingFang-SC;
      font-weight: 800;
      color: #333333;
      line-height: 20px;
    }
    .block {
      width: 35px;
      height: 37px;
      display: inline-block;
      background: url('../../assets/images/activity/countdown.png') no-repeat center;
      background-size: cover;
      font-size: 20px;
      font-family: Eina03-Bold, Eina03;
      font-weight: bold;
      color: #FFFFFF;
      line-height: 36px;
      text-align: center;
      position: relative;
      top: 13px;
    }
  }
  .tabs {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    position: relative;
    left: 15px;
    font-size: 12px;
    font-family: PingFang-SC-Bold, PingFang-SC;
    font-weight: bold;
    color: #999999;
    .tabs-1 {
      width: 91px;
      height: 40px;
      background: url('../../assets/images/activity/item1.png') no-repeat center;
      background-size: cover;
      line-height: 40px;
      text-align: center;
    }
    .tabs-2 {
      width: 95px;
      height: 40px;
      background: url('../../assets/images/activity/item2.png') no-repeat center;
      background-size: cover;
      line-height: 40px;
      text-align: center;
      position: relative;
      left: -10px;
    }
    .tabs-3 {
      width: 95px;
      height: 40px;
      background: url('../../assets/images/activity/item2.png') no-repeat center;
      background-size: cover;
      line-height: 40px;
      text-align: center;
      position: relative;
      left: -20px;
    }
    .tabs-4 {
      width: 91px;
      height: 40px;
      background: url('../../assets/images/activity/item4.png') no-repeat center;
      background-size: cover;
      line-height: 40px;
      text-align: center;
      position: relative;
      left: -30px;
    }
    .active-tab1 {
      background: url('../../assets/images/activity/itema1.png') no-repeat center;
      background-size: cover;
      color: #FFFFFF;
    }
    .active-tab2 {
      background: url('../../assets/images/activity/itema2.png') no-repeat center;
      background-size: cover;
      color: #FFFFFF;
    }
    .active-tab4 {
      background: url('../../assets/images/activity/itema4.png') no-repeat center;
      background-size: cover;
      color: #FFFFFF;
    }
  }
}
</style>

