<template>
  <div class="invite-profit">
    <div class="num">
      <div class="top">
        <span :class="{active : current === 0}" @click="change(0)">{{$t('activity.invitej')}}</span>
        <span :class="{active : current === 1}" @click="change(1)">{{$t('activity.invitez')}}</span>
      </div>
      <div class="content1">
        <div class="div">
          <div class="p">{{info.invitedNumber}}</div>
          <div class="info">{{$t('activity.invitexz')}}</div>
        </div>
        <div class="div">
          <div class="p">{{info.exchangeNum}}</div>
          <div class="info">{{$t('activity.invitezr')}}</div>
        </div>
        <div class="div">
          <div class="p">{{info.exchangeCount}}</div>
          <div class="info">{{$t('activity.invitetotal')}}</div>
        </div>
      </div>
    </div>
    <div class="yaoqing">
      <div class="yaoqingpic" @click="showShare=true">
        {{$t('subscription.yq')}}
      </div>
      <div class="yaoqnum">
        <span>{{$t('activity.invitenum')}}</span>
        <span>{{info.invitedNumberCount}}{{$t('activity.invitepen')}}</span>
      </div>
    </div>
    <div class="yaolist">
      <div class="yaolisttop">
        <span>{{$t('activity.invitebyq')}}</span>
        <span>{{$t('activity.invitesj')}}</span>
      </div>
      <div class="yaoli">
        <div class="yaoqli"  v-for="(item, index) in info.childList" :key="index">
          <span>{{item.username}}</span>
          <span>{{item.operateTime}}</span>
        </div>
      </div>
    </div>
    <!-- <div class="rules">
      <div class="t">{{$t('activity.invite')}}</div>
      <div class="s">
        {{$t('activity.i1')}}
      </div>
      <div class="s">
        {{$t('activity.i2')}}
      </div>
      <div class="s">
        {{$t('activity.i3')}}
      </div>
      <div class="s">
        {{$t('activity.i4')}}
      </div>
      <div class="s">
        {{$t('activity.i5')}}
      </div>
    </div> -->
    <!-- 分享 -->
    <van-share-sheet v-model="showShare" :options="shareOptions" :title="$t('invite.shareNow')" get-container="body" @select="shareSelect">
      <template #description>
        <div ref="shareImg" class="share-panel">
          <img style="height:50vh" :src="require('@/assets/images/base64/share-'+lang+'.png')"/>
          <div class="has-background-white share-content is-flex-center">
            <div class="py-2 pl-2 is-grow">
              <strong>{{$t('invite.code')}}: </strong><span class="has-text-info">{{user.uid}}</span>
              <div class="mt-2 has-text-weight-light">{{$t('invite.shareTip')}}</div>
            </div>
            <div class="qr">
              <vue-qr :text="shareLink +'/#/login?code='+ user.uid"></vue-qr>
            </div>
          </div>
        </div>
      </template>
    </van-share-sheet>
  </div>
</template>
<script>
import { get } from 'vuex-pathify'
import { Toast } from 'vant'
import saveImg from '@/utils/saveImg'
import http from '@/utils/http'
export default {
  data() {
    return {
      current: 0,
      showShare: false,
      shareLink: null,
      info: {
        childList: []
      },
      shareOptions: [
        { name: this.$t('invite.saveImage'), icon: 'poster' },
        { name: this.$t('invite.link'), icon: 'link' },
      ]
    }
  },
  created() {
    // this.initConfig()
    this.shareLink = http.getH5HomeUrl()
  },
  mounted() {
    this.init()
  },
  computed: {
    lang: get('lang'),
    wallet: get('user/wallet'),
    user: get('user/info'),
  },
  methods: {
    init() {
      this.$http.api.get(`asset/inviteDetail?timeStatus=${this.current}&coin=DIEM`).then(data => {
        this.info = data.data
      })
    },
    change(val) {
      this.current = val
      this.init()
    },
    initConfig() {
      this.$http.get('common/getShareLink').then(data => {
        this.shareLink = data
      })
    },
    shareSelect(option) {
      if (option.icon === 'poster') {
        saveImg(this.$refs.shareImg)
      } else {
        this.$copyText(this.shareLink +'/#/login?code='+ this.user.uid).then(function () {
          Toast('copy success')
        }, function () {
          Toast('copy fail')
        })

      }
    }
  }
}
</script>
<style lang="scss" scoped>
.invite-profit {
  padding: 20px 20px 40px 20px;
  .num {
    width: 335px;
    height: 115px;
    background: #F6F7FA;
    border-radius: 10px;
    padding: 12px 11px;
    .top {
      display: flex;
      align-items: center;
      span {
        width: 50%;
        display: inline-block;
        text-align: center;
        color: #999999;
        font-size: 14px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
      }
      .active {
        font-size: 16px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: #333333;
      }
    }
    .content1 {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      .div {
        width: 98px;
        height: 59px;
        background: #F1F2F7;
        border-radius: 5px;
        text-align: center;
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #333333;
      }
      .p {
        line-height: 30px;
      }
      .info {
        color: #999999;
        font-size: 12px;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
      }
    }
  }
  .yaoqing {
    height: 158px;
    position: relative;
    .yaoqingpic {
      width: 375px;
      height: 158px;
      position: absolute;
      top: 0;
      left: -20px;
      background: url('../../assets/images/activity/barren.png');
      background-size: cover;
      line-height: 120px;
      text-indent: 3em;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #FFFFFF;
    }
    .yaoqnum {
      position: absolute;
      right: 0;
      left: 0;
      top: 110px;
      display: flex;
      justify-content: space-between;
      height: 22px;
      font-size: 16px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #333333;
      line-height: 22px;
    }
  }
  .yaolist {
    width: 335px;
    height: 130px;
    background: #F6F7FA;
    border-radius: 10px;
    .yaoli {
      width: 335px;
      height: 91px;
      background: #F1F2F7;
      overflow-y: scroll;
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
      color: #999999;
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
</style>
