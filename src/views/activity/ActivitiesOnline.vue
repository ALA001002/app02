<template>
  <div class="activities-online">
    <div class="title">
      {{$t('activity.infotitle')}}
    </div>
    <div class="desc">
      {{$t('activity.infodesc')}}
    </div>
    <div class="btn">
      <a href="https://www.facebook-diem.net" target="_blank" rel="noopener noreferrer">
        {{$t('activity.infobtn')}}
      </a>
    </div>
    <img class="btc_coins" src="@/assets/images/activity/btc_coins.png" alt="">
    <div class="grids">
      <div class="h">
        <div class="item">
          <img class="pic" src="@/assets/images/activity/mobile.png" alt="">
          <div class="t" v-if="$i18n.locale === 'zh_hk'">移動</div>
          <div class="d" v-else>Mobile</div>
        </div>
        <div class="item">
          <img class="pic" src="@/assets/images/activity/wd.png" alt="">
          <div class="t" v-if="$i18n.locale === 'zh_hk'">穩定</div>
          <div class="d" v-else>Stable</div>
        </div>
        <div class="item">
          <img class="pic" src="@/assets/images/activity/sj.png" alt="">
          <div class="t" v-if="$i18n.locale === 'zh_hk'">世界</div>
          <div class="d" v-else>For the World</div>
        </div>
      </div>
      <div class="h">
        <div class="item">
          <img class="pic" src="@/assets/images/activity/ks.png" alt="">
          <div class="t" v-if="$i18n.locale === 'zh_hk'">快速</div>
          <div class="d" v-else>Fast</div>
        </div>
        <div class="item">
          <img class="pic" src="@/assets/images/activity/hkz.png" alt="">
          <div class="t" v-if="$i18n.locale === 'zh_hk'">可擴展</div>
          <div class="d" v-else>Scalable</div>
        </div>
        <div class="item">
          <img class="pic" src="@/assets/images/activity/sj.png" alt="">
          <div class="t" v-if="$i18n.locale === 'zh_hk'">安全</div>
          <div class="d" v-else>Secure</div>
        </div>
      </div>
    </div>
    <div class="vides">
      <!-- <video class="video" src=""></video>
      <img class="play" src="@/assets/images/activity/play.png" alt=""> -->
      <iframe width="335" height="190" src="https://www.youtube.com/embed/BE12dZwSKU8" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
    <div class="rg">
      <div class="t">{{$t('activity.librat')}}</div>
      <div class="show">
        <div>
          <span class="i">{{$t('activity.slrg')}}</span>
          <span>{{info.releaseCountNum}} DIEM</span>
        </div>
        <!--<div>-->
          <!--<span class="i">{{$t('activity.yrgzg')}}</span>-->
          <!--<span>{{info.countNum}} DIEM</span>-->
        <!--</div>-->
      </div>
      <!--<div class="total-w">
        &lt;!&ndash; <div class="total">5000 DIEM</div> &ndash;&gt;
        <van-slider v-model="value" bar-height="6px" disabled>
          <template #button>
            <div class="custom-w">
              <span class="custom-value">{{info.releaseCountNum}} DIEM</span>
              <span class="custom-button"></span>
            </div>
          </template>
        </van-slider>
      </div>-->

    </div>
    <div class="rgbtn" @click="goToSwitch">
      {{$t('activity.rginfo')}}
    </div>
    <div class="rules">
      <div class="t">{{$t('activity.relus')}}</div>
      <div class="s">
        {{$t('activity.s1')}}
      </div>
      <div class="s">
        {{$t('activity.s2')}}
      </div>
      <div class="s">
        {{$t('activity.s3')}}
      </div>
      <div class="s">
        {{$t('activity.s4')}}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ActivitiesOnline',
  data() {
    return {
      value: 0,
      info: {
        releaseCountNum: '',
        countNum: ''
      }
    }
  },
  methods: {
    goToSwitch() {
      this.$emit('switchTab', 2)
    }
  },
  mounted() {
    this.$http.api.get('common/releaseProcess').then(data => {
      this.info = data.data
      this.value = (data.data.countNum / data.data.releaseCountNum) * 100
    })
  }
}
</script>
<style lang="scss" scoped>
.activities-online {
  padding: 19px 20px 30px;
  position: relative;
  .van-slider {
    // width: 234px;
    background: linear-gradient(135deg, #2884F7 0%, #51BAFC 100%) !important;
  }
  .title {
    font-size: 20px;
    font-family: PingFang-SC-Bold, PingFang-SC;
    font-weight: bold;
    color: #333333;
    line-height: 34px;
  }
  .desc {
    width: 218px;
    font-size: 14px;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #333333;
    line-height: 21px;
  }
  .btn {
    margin-top: 20px;
    width: 113px;
    height: 26px;
    line-height: 22px;
    background: linear-gradient(263deg, #2F5FFF 0%, #3CBAFF 100%);
    box-shadow: 0px 4px 8px 0px rgba(79, 80, 164, 0.2);
    border-radius: 15px;
    border: 3px solid #FFFFFF;
    font-size: 10px;
    font-family: PingFang-SC-Bold, PingFang-SC;
    font-weight: bold;
    color: #FFFFFF;
    text-align: center;
    a {
      color: #FFFFFF;
    }
  }
  .btc_coins {
    width: 127px;
    height: 69px;
    position: absolute;
    right: 15px;
    top: 143px;
  }
  .grids {
    margin: 46px auto 30px;
    padding: 0 20px;
    .h {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .item {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        .pic {
          width: 60px;
          height: 60px;
        }
        .t {
          text-align: center;
          height: 20px;
          font-size: 14px;
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          color: #333333;
          line-height: 20px;
        }
        .d {
          text-align: center;
          height: 21px;
          font-size: 12px;
          font-family: Eina03-Regular, Eina03;
          font-weight: 400;
          color: #333333;
          line-height: 21px;
        }
      }
    }
  }
  .vides {
    width: 335px;
    height: 188px;
    background: #EDF0F6;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    .video {
      width: 315px;
      height: 137px;
      background: linear-gradient(180deg, rgba(249, 249, 249, 0.5) 0%, rgba(0, 0, 0, 0.5) 100%);
      border-radius: 5px;
    }
    .play {
      width: 36px;
      height: 36px;
      z-index: 99;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
    }
  }
  .rg {
    margin: 20px auto 10px;
    width: 335px;
    height: 140px;
    background: rgba(237, 240, 246, .5);
    border-radius: 10px;
    padding: 12px 10px;
    box-sizing: border-box;
    .t {
      font-size: 16px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #333333;
    }
    .show {
      margin-top: 10px;
      width: 315px;
      height: 59px;
      background:rgba(185,190,206,0.075);
      border-radius: 5px;
      // opacity: 0.0757;
      padding: 10px;
      box-sizing: border-box;
      div {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #333333;
        .i {
          color:#929295;
        }
      }
    }
    .van-slider {
      z-index: 99;
    }
    .total-w {
      margin-top: 42px;
      position: relative;
      .total {
        position: absolute;
        right: -2px;
        top: -7px;
        width: 85px;
        height: 20px;
        background: #4FB7FB;
        border-radius: 10px;
        font-size: 12px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #FFFFFF;
        line-height: 20px;
        text-align: center
      }
      .custom-w {
        position: relative;
        z-index: 999;
        .custom-value {
          border-radius: 5px;
          position: absolute;
          top: -26px;
          min-width: 108px;
          height: 24px;
          text-align: center;
          line-height: 24px;
          text-align: center;
          background: #2884F7;
          font-size: 10px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #FFFFFF;
        }
        .custom-button {
          box-sizing: content-box;
          display: block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 4px solid #4FB7FB;
        }
      }

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
