<template>
  <Layout>
    <NavBar slot="header" back>VIP</NavBar>
    <div class="section pt-6 pb-0">
      <div class="tc main-color text-32px">{{$t('extra.VIPProgram')}}</div>
      <div class="tc main-color text-12px mt-2 pb-2">{{$t('extra.VIPProgramInfo')}}</div>
      <div class="big-btn radius mt-5">{{$t('extra.applyImmediately')}} <span class="okcoin okcoin-arrow-right ml-3 text-16px text-bold"></span></div>
    </div>

    <div class="mt-1 main-part">
      <img class="main-img" src="@/assets/images/new/vip_icon.svg">
      <div class="card-box">
        <div class="tc main-color text-20px">{{$t('extra.exclusiveRights')}}</div>
        <div class="tc text-mid text-15px mt-1">{{$t('extra.exclusiveRightsInfo')}}</div>
        <div class="big-btn  radius small mt-4 mb-5">{{$t('extra.VIPRateDiscount')}} <span class="okcoin okcoin-arrow-right ml-3 text-16px text-bold"></span></div>
        <div class="small-card mt-4" v-for="item in list" :key="item.title">
          <div class="flex">
            <img class="box36 mr-2" :src="item.icon">
            <div class="main-color text-16px">{{item.title}}</div>
          </div>
          <div class="text-14px text-mid line13 my-2">{{item.info}}</div>
          <div class="link main-color text-14px">{{$t('extra.viewMore')}} <span class="okcoin okcoin-arrow-right ml-1 text-14px text-bold"></span></div>
        </div>
      </div>
    </div>
    <!-- 推荐好友 -->

    <div class="card2  radius-mid my-1">
      <div class="text-24px tc text-black text-bold">{{$t('extra.VIPRecommend')}}</div>
      <div class="text-13px tc text-shallow my-3">{{$t('extra.VIPRecommendInfo')}}</div>
      <div class="big-btn radius small mb-24">{{$t('extra.applyImmediately')}} <span class="okcoin okcoin-arrow-right ml-3 text-16px text-bold"></span></div>
      <img class="vip_gift pt-3" src="@/assets/images/new/vip_gift.svg">
    </div>
    <!-- vip等级  -->
    <div class="card3">
      <div class="p-4 text-16px main-color">{{$t('extra.VIPLevel')}}</div>
      <div class="card3-info px-4 p-2 text-mid text-14px">{{$t('extra.VIPLevelInfo')}}</div>
      <div class="p-4">
        <div class="head flex-between text-mid text-14px">
          {{$t('extra.level')}}
          <span>{{$t('extra.tradingVolume')}}</span>
        </div>
        <div class="main-color text-20px bb py-3 mt-1">
          <img class="box24 mr-1" src="@/assets/images/new/vip_svip.svg">
          VIP 1
          <span class="ml-5">10M~25M</span>
        </div>
        <div class="main-color text-20px bb py-3">
          <img class="box24 mr-1" src="@/assets/images/new/vip_svip.svg">
          VIP 1
          <span class="ml-5">10M~25M</span>
        </div>
        <div class="main-color text-20px bb py-3 -mb-24">
          <img class="box24 mr-1" src="@/assets/images/new/vip_svip.svg">
          VIP 1
          <span class="ml-5">10M~25M</span>
        </div>
      </div>
    </div>
    <!-- VIP身份兑换 -->
    <div class="card2  radius-mid my-5 mb-6">
      <div class="text-24px tc text-black text-bold line14">{{$t('extra.VIPExchange')}}</div>
      <div class="text-13px tc text-shallow my-2">{{$t('extra.VIPExchangeInfo')}}</div>
      <img class="card2-img" src="@/assets/images/new/vip_svip.svg">
      <div class="card2-in">
        <div class="border">
          <div class="tc text-24px mb-4">{{$t('extra.VIPBenefits')}}</div>
          <div class="px-2 py-1 flex text-16px">
            <img class="box16 mr-3" src="@/assets/images/new/vip_select.svg">{{$t('extra.VIPAccountManager')}}
          </div>
          <div class="px-2 py-1 flex text-16px">
            <img class="box16 mr-3" src="@/assets/images/new/vip_select.svg">{{$t('extra.welcomeGift')}}
          </div>
          <div class="px-2 py-1 flex text-16px">
            <img class="box16 mr-3" src="@/assets/images/new/vip_select.svg">{{$t('extra.feeDiscount')}}
          </div>
          <div class="big-btn small radius mt-4 mb-48">{{$t('extra.experienceNow')}} <span class="okcoin okcoin-arrow-right ml-3 text-16px text-bold"></span></div>
        </div>
      </div>
      <img class="vip-card-bottom-img" src="@/assets/images/new/vip-card-bottom.svg">
    </div>
    <div class="my-6">&nbsp;</div>
  </Layout>
</template>

<script>
import img1 from '@/assets/images/new/vip_recharge.svg'
import img2 from '@/assets/images/new/vip_sale.svg'
import img3 from '@/assets/images/new/vip_vip.svg'
import img4 from '@/assets/images/new/vip_hour.svg'
import img5 from '@/assets/images/new/vip_report.svg'
import img6 from '@/assets/images/new/vip_new.svg'
export default {
  data() {
    return {
      list: [
        {
          title: this.$t('extra.VIPCardTitle1'),
          info: this.$t('extra.VIPCardInfo1'),
          to: '/',
          icon: img1,
        },
        {
          title: this.$t('extra.VIPCardTitle2'),
          info: this.$t('extra.VIPCardInfo2'),
          to: '/',
          icon: img2,
        },
        {
          title: this.$t('extra.VIPCardTitle3'),
          info: this.$t('extra.VIPCardInfo3'),
          to: '/',
          icon: img3,
        },
        {
          title: this.$t('extra.VIPCardTitle4'),
          info: this.$t('extra.VIPCardInfo4'),
          to: '/',
          icon: img4,
        },
        {
          title: this.$t('extra.VIPCardTitle5'),
          info: this.$t('extra.VIPCardInfo5'),
          to: '/',
          icon: img5,
        },
        {
          title: this.$t('extra.VIPCardTitle6'),
          info: this.$t('extra.VIPCardInfo6'),
          to: '/',
          icon: img6,
        },
      ],
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {},
  },
}
</script>

<style scoped lang="scss">
.card2 {
  background: linear-gradient(180deg, #fef4dd 0%, #fefefe 100%);
  margin: 0 25px;
  padding: 30px 23px;
  position: relative;
  overflow: hidden;
  .vip-card-bottom-img {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
  }
}
.bb {
  border-bottom: 1px solid #524b48;
}
.card3 {
  background: #35302c;
  border-radius: 8px;
  margin: 25px;
  .card3-info {
    background: #4b4340;
  }
}
.card2-img {
  width: 96px;
  display: block;
  margin: 12px auto 0;
}
.card2-in {
  margin-top: -62px;
  width: 270px;
  background: linear-gradient(138deg, #353337 0%, #353337 15%, #131117 100%);
  border-radius: 8px;
  border: 1px solid #979797;
  .border {
    border-radius: 8px;
    margin: 12px 10px;
    padding: 60px 30px 0;
    border: 1px solid #edd3a2;
  }
}
.main-color {
  color: #e5c183;
}
.big-btn {
  background: linear-gradient(270deg, #e4c281 0%, #f8eaca 100%);
  &.small {
    height: 40px;
  }
}
.vip_gift {
  width: 100%;
}
.main-part {
  background-image: url('~@/assets/images/new/vip_bg.svg');
  background-size: contain;
  background-position: top center;
  background-repeat: no-repeat;
  padding: 20px 25px;
}
.small-card {
  background-image: url('~@/assets/images/new/vip_list_bg.svg');
  background-size: contain;
  background-position: top center;
  background-repeat: no-repeat;
  padding: 20px 16px;
}
.main-img {
  width: 126px;
  display: block;
  margin: 10px auto 0;
  z-index: 1;
}
.card-box {
  background: #35302c;
  border-radius: 8px;
  padding: 20px 23px;
  z-index: 10;
}
.small-card {
  height: 160px;
}
</style>
