<template>
  <div class="subscribe">
    <div class="card">
      <div class="top">
        <span style="margin-right: 20px;">{{$t('activity.subscribename')}}</span>
        <span>{{$t('activity.subscribeprice')}}</span>
      </div>
      <div class="top1">
        <span style="margin-right: 20px;">DIEM</span>
        <span>{{info.currentPrice}}</span>
        <span style="font-size: 10px;">DIEM/USDT</span>
      </div>
      <div class="top2">
        {{$t('activity.subscribeyg')}}
      </div>
      <div class="top1">
        {{info.exchangeNum}} DIEM
      </div>
      <div class="btn" @click="$router.push('/subscriptionSwitch')">
        {{$t('activity.subscribellrg')}}
      </div>
      <div class="desc">
        {{$t('activity.subscribedesc')}}
      </div>
      <img class="cardpic" src="@/assets/images/activity/cardpic.png" alt="">
    </div>
    <div class="record" v-if="myLotteryCode.length">
      <span>{{$t('activity.wdcjm')}}</span>
    </div>
    <div class="codelist" v-if="myLotteryCode.length">
      <div class="codeitem" v-for="(item, index) in myLotteryCode" :key="index">
        <span>{{item.lotteryCode}}</span>
        <div v-copy="item.lotteryCode" style="color: #2884F7">{{$t('activity.copy')}}</div>
<!--        <span @click="showGiveConfirmPanel(item.lotteryCode)">{{$t('activity.give')}}</span>-->
<!--        <div @click="$router.push({name:'giveLotteryCode', params:{lotteryCode:item.lotteryCode}})" class="jl" style="color: #2884F7">{{$t('activity.give')}}</div>-->
      </div>
    </div>
    <div class="record">
      <span>{{$t('activity.subscribejl')}}</span>
      <span @click="$router.push('/subscriptionList')" class="jl">{{$t('activity.subscribewjl')}}</span>
    </div>
    <div class="yaolist">
      <div class="yaolisttop">
        <span>{{$t('activity.subscribezh')}}</span>
        <span>{{$t('activity.subscribenum')}}</span>
        <span>{{$t('activity.subscribetime')}}</span>
      </div>
      <div class="yaoli">
        <vue-list-marquee :listData='info.exchangeList' >
          <template slot-scope="{ item, index }">
            <div class="yaoqli" :key="index">
                <span style="width: 35%;text-align: left;display: inline-block;overflow: hidden;text-overflow:ellipsis;white-space:nowrap;">{{item.username}}</span>
                <span style="width: 35%;text-align: left;display: inline-block;overflow: hidden;text-overflow:ellipsis;white-space:nowrap;">{{item.amount}}</span>
                <span>{{item.operateTime.split(' ')[0]}}</span>
            </div>
          </template>
        </vue-list-marquee>
        <!-- <div class="yaoqli" v-for="(item, index) in info.exchangeList" :key="index">
          <span>{{item.username}}</span>
          <span style="width: 33%;    text-align: left;display: inline-block;">{{item.amount}}</span>
          <span>{{item.operateTime.split(' ')[0]}}</span>
        </div> -->
      </div>
    </div>
    <div class="rules">
      <div class="t">{{$t('activity.subscribe')}}</div>
      <!-- <div class="s">
        {{$t('activity.r1')}}
      </div>  -->
      <div class="s">
        {{$t('activity.r1')}}
      </div>
      <div class="s">
        {{$t('activity.r2')}}
      </div>
      <div class="s">
        {{$t('activity.r3')}}
      </div>
    </div>
    <van-dialog v-model="showGiveConfirm" :title="$t('activity.give')" show-cancel-button @confirm="sub">
      <div class="confirmPanel">
        <div>{{$t('activity.lottery_code')}}</div><div>{{lotteryCode}}</div>
        <div></div>
      </div>
    </van-dialog>
  </div>
</template>
<script>
export default {
  components: {
   
  },
  data() {
    return {
      list: [],
      info: {},
      myLotteryCode: [],
      showGiveConfirm: false,
      lotteryCode: null
    }
  },
  computed: {

  },
  mounted() {
    this.$http.api.get('asset/exchangeRecord?coin=DIEM').then(data => {
      this.info = data.data
    })
    this.$http.api.get('luck/myLotteryCode').then(data => {
      this.myLotteryCode = data.data
    })
    
  },
  methods: {
    changeTabs(val) {
      this.current = val
    },
    showGiveConfirmPanel(lotteryCode) {
      this.lotteryCode = lotteryCode
      this.showGiveConfirm = true
    }
  }
}
</script>
<style lang="scss" scoped>
.subscribe {
  padding: 34px 20px 30px;
  .card {
    position: relative;
    width: 335px;
    height: 184px;
    background: linear-gradient(263deg, #2F5FFF 0%, #3CBAFF 100%);
    border-radius: 10px;
    padding: 16px 20px;
    .top {
      height: 14px;
      font-size: 10px;
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color:#C1DAFF;
      line-height: 14px;
    }
    .top1 {
      margin-top: 5px;
      height: 14px;
      font-size: 14px;
      font-family: Eina03-Bold, Eina03;
      font-weight: bold;
      color: #FFFFFF;
      line-height: 19px;
    }
    .top2 {
      margin-top: 20px;
      height: 14px;
      font-size: 10px;
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color: #C1DAFF;
      line-height: 14px;
    }
    .btn {
      margin-top: 20px;
      width: 90px;
      height: 27px;
      background: #FFFFFF;
      border-radius: 14px;
      line-height: 27px;
      text-align: center;
      font-size: 12px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #3B52ED;
    }
    .desc {
      margin-top: 8px;
      font-size: 8px;
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color:  #C1DAFF;
    }
    .cardpic {
      width: 169px;
      height: 192px;
      position: absolute;
      right: 28px;
      bottom: 16px;
    }
  }
  .record {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-size: 16px;
    font-family: PingFang-SC-Bold, PingFang-SC;
    font-weight: bold;
    color: #333333;
    line-height: 22px;
    .jl {
      font-size: 12px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #2884F7;
    }
  }
  .codelist {
    margin-top: 10px;
    background: #F1F2F7;
    padding: 5px 10px;
    border-radius: 5px;
  }
  .codeitem {
    display: flex;
    height: 36px;
    align-items: center;
    justify-content: space-between;
  }
  .yaolist {
    margin-top: 10px;
    margin-bottom: 20px;
    width: 335px;
    height: 200px;
    background: #F6F7FA;
    border-radius: 10px;
    .yaoli {
      width: 335px;
      height: 180px;
      background: #F1F2F7;
      overflow: hidden;
      // overflow-y: scroll;
      .yaoqli {
        display: flex;
        justify-content: space-between;
        height: 29px;
        line-height: 29px;
        padding: 0 20px 0 10px;
        font-size: 11px;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: #333333;
      }
    }
    .yaolisttop {
      display: flex;
      justify-content: space-between;
      height: 29px;
      line-height: 29px;
      padding: 0 20px 0 10px;
      font-size: 11px;
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color: #949596;
    }
  }
  .rgbtn {
    width: 335px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: #2884F7;
    border-radius: 5px;
    text-align: center;
    font-size: 14px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #FFFFFF;
  }
  .rules {
    margin-top: 20px;
    margin-bottom: 20px;
    .t {
      font-size: 16px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #333333;
      line-height: 22px;
    }
    .s {
      font-size: 12px;
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color: #999999;
      line-height: 24px;
    }
  }
}
::v-deep {
  .van-dialog {
    text-align: left;
  }
  .van-dialog__content {
    padding: 20px 30px 30px 30px;
    color: #999999;
    line-height: 20px;
    font-size: 14px;
  }
}
.confirmPanel {
  >div{width: 50%; display: inline-block; padding: 1px 4px; box-sizing: border-box;; }
  >div:nth-child(even) { color: #242424; }
  small {color: rgba(255, 255, 255, 0.8);}
}
</style>
