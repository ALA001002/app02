<template>
  <Layout>
    <NavBar slot="header" class="nav-bar">{{$t('app.home')}}
      <img class="user" slot="left" v-if="user.avatar" :src="user.avatar" @click="$router.push('/setting/account')">
      <img class="user" slot="left" v-else src="@/assets/images/new/home_photo.svg" @click="$router.push('/setting/account')">
      <template class="nav-bar-right" slot="right">
        <img src="@/assets/images/new/download.png" style="margin-right: 0.5rem;width: 1.3rem"
        @click="downloadVisible = true"
        />
        <img class="icon mr-2" src="@/assets/images/new/home_ser.svg" @click="$router.push('/iframe/1')">
        <img class="icon" src="@/assets/images/new/home_mail.svg" @click="$router.push('/msgCenter')">
      </template>
    </NavBar>
    <!-- 头部 -->
    <!-- <div class="section pb-0" slot="header" style="text-align: center;">
      <a href="https://play.google.com/store/apps/details?id=okcoinbit.keystore" style="color:gray;vertical-align: center;"><img style="vertical-align: middle;" :src="require(`../assets/images/app_logo.png`)" height="50px" />app</a>
      <router-link tag="span" class="is-pulled-right" to="/letters">
        <van-icon name="volume-o" size="24" v-if="letters.length>0" style="line-height: 41px;" dot />
        <van-icon v-else name="volume-o" size="24" style="line-height: 41px;" />
      </router-link>
    </div> -->
    <!-- 通知栏 -->
    <!-- <div class="section">
      <van-notice-bar :scrollable="false" class="px-0 has-text-weight-light" color="#242424" background="#ffffff" style="flex: 1" left-icon="volume-o">
        <van-swipe vertical class="notice-swipe" :autoplay="3000" :show-indicators="false" style="line-height: 2.13333rem; height: 2.13333rem;" :stop-propagation="false">
          <van-swipe-item v-for="notice in notices" :key="notice.id" @click="noticeTo(notice)">{{notice.title}}</van-swipe-item>
        </van-swipe>
      </van-notice-bar>
      <van-divider style="margin: 0px;" />
    </div> -->
    <div class="section pb-0">
      <div class="chart-part flex-between oh">
        <div class="texts">
          <div class="coin flex">
            <img class="coin" src="@/assets/images/new/home_bit.svg" alt="">
            <span>BTC</span>
          </div>
          <div class="text-24px mt-2" :class="{green:BTC.change>0,'text-danger':BTC.change<0}">{{BTC.change}}%</div>
          <div class="text-danger text-14px mt-1">${{(Number(BTC.price||0)).toFixed(2)}}</div>
        </div>
        <div class="chart flex1">
          <!-- <img src="@/assets/images/new/home-chart.png" alt=""> -->
          <Echart></Echart>
        </div>
      </div>
      <router-link class="big-btn mt-1" v-if="token" to="/options">{{$t('extra.firstBuy')}} <span class="okcoin okcoin-arrow-right ml-3 text-20px text-bold"></span></router-link>
      <router-link class="big-btn mt-1" v-else to="/login">{{$t('extra.loginOrRegister')}} <span class="okcoin okcoin-arrow-right ml-3 text-20px text-bold"></span></router-link>
    </div>
    <div>
      <div class="navs flex-wrap my-3">
        <template v-for="(link,index) in links">
          <router-link tag="div" class="nav-item mt-3" v-if="link.to" :to="link.to" :key="link.to">
            <img class="nav-img" :src="require(`../assets/images/new/${link.icon}.svg`)">
            <span class="nav-text">
              {{link.name}}
            </span>
          </router-link>
          <div class="nav-item mt-3" v-else @click="link.click" :key="index">
            <img class="nav-img" :src="require(`../assets/images/new/${link.icon}.svg`)">
            <span class="nav-text">
              {{link.name}}
            </span>
          </div>
        </template>
      </div>
    </div>
    <!-- 轮播图 -->
<!--    <div class="section">
      <van-swipe :autoplay="5000" class="is-radius" :stop-propagation="false">
        <van-swipe-item v-for="(item, index) in banner" :key="index" @click="bannerTo(item)">
          <Img :src="item.url" class="is-radius" fit="fill" lazy-load />
        </van-swipe-item>
      </van-swipe>
    </div>-->
    <!-- 常用合约 -->
    <div class="section">
      <!-- 通知栏 -->
      <!-- <vueSeamlessScroll v-if="config && !config.xiadanFlag" :data="recharges" :class-option="defaultOption" class="warp card-bg"> -->
<!--      <vueSeamlessScroll :data="recharges" :class-option="defaultOption" class="warp card-bg">
        <ul class="item">
          <li v-for="(item, index) in recharges" :key="index">
            <span>{{ item.dateTime }}</span>
            <span class="flex1 tc no-wrap mx-2">{{item.email}}</span>
            <span>{{$t('wallet.walletStatus4')}}&nbsp;{{item.amount}}USDT</span>
          </li>
        </ul>
        &lt;!&ndash;        <ul class="item">
        <li v-for="recharge in recharges" :key='recharge.email'>
         <span class="date">{{recharge.email}}</span>
        </li>
      </ul>&ndash;&gt;
      </vueSeamlessScroll>-->
      <ContractBoxList :list="myList" />
    </div>
    <!-- 合约列表 -->
    <div class="section pt-1">
      <TradingList :list="list" @select="tradingSelect" />
    </div>
    <!-- 平台底部信息 -->
    <!-- <div class="py-5 px-3 has-text-centered has-text-weight-light">
      <router-link tag="small" :to="`/view?type=key&id=ptxxqpl&title=${this.$t('app.sysInfo')}`" class="has-text-link">
        {{ $t("app.sysInfo") }} >
      </router-link>
      <div class="columns is-mobile has-text-grey-light mt-0">
        <div v-for="(link, index) in links2" :key="index" class="column px-0">
          <small>
            <van-icon class-prefix="icon" :name="link.icon" />
            &nbsp;{{ link.name }}
          </small>
        </div>
      </div>
    </div> -->
    <div class="section mb-6">
      <router-link class="card-bg bottom flex-between px-4 py-2" to="/DeFi">
        <div class="flex1" style="margin:3px 0">
          <div class="name text-15px">{{$t('extra.highIncome')}}</div>
          <div class="info text-12px text-mid" style="margin:3px 0">{{$t('extra.highIncomeInfo')}}</div>
          <div class="link text-primary text-14px">{{$t('extra.earnCoinsNow')}}</div>
        </div>
        <img class="icon" src="@/assets/images/new/home_img.svg" alt="">
      </router-link>
    </div>
    <SelectCoinVue ref="selectCoin" filter="supWithdraw" @select="recharge" :title="$t('extra.recharge')"></SelectCoinVue>
    <SelectCoinVue ref="selectCoinWithdraw" filter="supRecharge" @select="withdraw" :title="$t('extra.withdrawalType')"></SelectCoinVue>

    <van-dialog v-model="downloadVisible"  :title="$t('app.download')" getContainer="body" :confirm-button-text="$t('extra.confirm')">
<!--      <vue-qr :text="downloadUrl" class="m-auto" :size="180"></vue-qr>-->
      <div class="input-box flex-between ">
      <span class="text-12px line14">{{downloadUrl}}</span>
      <img class="box24"  v-copy="downloadUrl" v-copy:success="()=>jumpDownUrl()"  src="@/assets/images/new/invate_copy.svg">
      </div>
    </van-dialog>
  </Layout>
</template>

<script>
import SelectCoinVue from '@/components/SelectCoin.vue'
import Layout from '@/components/layout/Index.vue'
import ContractBoxList from '@/components/contractList/ContractBoxList.vue'
import TradingList from '@/components/trading/TradingList.vue'
import Echart from '@/components/Echart/index.vue'
// import vueSeamlessScroll from 'vue-seamless-scroll'
import { get } from 'vuex-pathify'
// import vueQr from 'vue-qr'

export default {
  name: 'Home',
  components: {
    Echart,
    Layout,
    // vueQr,
    ContractBoxList,
    TradingList,
    // vueSeamlessScroll,
    SelectCoinVue,
  },
  data() {
    return {
      downloadUrl:null,
      downloadVisible:false,
      i18n: false,
      myIndex: localStorage['myIndex']
        ? JSON.parse(localStorage['myIndex'])
        : [],
      banner: [],
      notices: [],
      recharges: [],
      letters: [],
      timer: null,
    }
  },
  created() {
    this.loadData()
    this.loadMsg()
    this.queryDownloadUrl()
  },
  computed: {
    config: get('bgConfig'),
    user: get('user/info'),
    token: get('user/token'),
    loanStatus: get('loanStatus'),
    vipStatus: get('vipStatus'),
    welfareStatus: get('welfareStatus'),
    defaultOption() {
      return {
        limitMoveNum: 2,
        direction: 1,
        step: 0.4,
      }
    },
    BTC() {
      return this.list.find(item => item.symbolCode === 'btcusdt') || {}
    },
    list: get('hq/hq'),
    myList() {
      const myList = this.list
      myList.sort((a, b) => {
        return this.myIndex.includes(a.symbolCode)
          ? 1
          : this.myIndex.includes(b.symbolCode)
          ? -1
          : 0
      })
      return myList.slice(0, 3)
    },
    links() {
      const list = [
        {
          name: this.$t('app.deposit'),
          icon: 'home_recharge',
          click: () => this.$refs.selectCoin.popup(),
          // click: () => this.$router.push('/wallet/deposit/USDT'),
        },
        {
          name: this.$t('extra.withdraw'),
          icon: 'home_withdraw',
          click: () => this.$refs.selectCoinWithdraw.popup(),
        },
        {
          name: this.$t('extra.DeFi'),
          icon: 'home_shop',
          to: '/DeFi',
        },
      ]
      list.push({
        name: this.$t('extra.help'),
        icon: 'home_help',
        to: '/help',
      })
      list.push({
        name: this.$t('extra.invite'),
        icon: 'home_invation',
        to: '/invite',
      })
      if (this.loanStatus == 1) {
        console.log(this.loanStatus)
        list.push({
          name: this.$t('extra.loan'),
          icon: 'home_borrow',
          to: '/loan',
        })
      } else if (this.loanStatus == 0) {
        list.push({
          name: this.$t('extra.loan'),
          icon: 'home_borrow',
          to: '/',
        })
      }
      /*if (this.welfareStatus) {
        list.push({
          name: this.$t('extra.welfare'),
          icon: 'home_walfare',
          to: '/welfareCenter',
        })
      }

      if (this.vipStatus) {
        list.push({
          name: this.$t('extra.vip'),
          icon: 'home_vip',
          to: '/vip',
        })
      }*/

      return list
    },
    links2() {
      return [
        { name: this.$t('app.globalBD'), icon: 'quanqiu' },
        { name: this.$t('app.appTeam'), icon: 'tuandui' },
        { name: this.$t('app.encryption'), icon: 'jiami' },
      ]
    },
  },
  methods: {

    queryDownloadUrl(){
      const self =this
      this.$http.api.get('/common/getDownUrl').then((res)=>{
        self.downloadUrl = res.data.url
      })
    },
    recharge(coin) {
      this.$router.push('/wallet/deposit/' + coin)
    },
    withdraw(coin) {
      this.$router.push('/wallet/withdraw/' + coin)
    },
    toLetters() {
      this.$router.push('/letters')
    },
    loadMsg() {
      if (!localStorage.token) {
        return
      }
      let self = this
      self.$http.api.get('/letter/unread').then(({ data }) => {
        self.letters = data
      })
      this.timer = setTimeout(() => {
        clearTimeout(self.timer)
        self.loadMsg()
      }, 60 * 1000)
    },
    loadData() {
      // banner
      // this.$http.get('common/getSysNoticeList?type=3').then(data => {
      //   this.banner = data
      // })
      // 公告
      // this.$http.get('common/getSysNoticeList?type=1').then(data => {
      //   this.notices = (data || []).slice(0, 3)
      // })
      this.$http.get('common/rechargeRecord').then(data => {
        this.recharges = data
      })
    },
    bannerTo() {
      // console.log(data)
    },
    noticeTo(data) {
      this.$router.push(`/view?id=${data.id}&title=${data.title}`)
    },
    tradingSelect(data) {
      this.$router.push('/options/' + data.symbolCode)
    },
    jumpDownUrl() {
      window.location.href = this.downloadUrl
    }
  },
}
</script>
<style lang="scss" scoped>
.input-box {
  height: 44px;
  line-height: 44px;
  border-radius: 6px;
  border: 1px solid #f1ae2f;
  padding: 0 15px;
  font-size: 16px;
}
.nav-bar {
  .user {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  .nav-bar-right {
    .icon {
      width: 24px;
      height: 24px;
    }
  }
}
.chart-part {
  img.coin {
    width: 24px;
    margin-right: 6px;
  }
  .texts {
    margin-right: 20px;
  }
  img {
    width: 100%;
  }
}
.bottom {
  .icon {
    width: 64px;
    height: 64px;
  }
}
.is-radius {
  overflow: hidden;
  height: 136px;
  width: 100%;
  border-radius: 12px;
}
.warp {
  height: 140px;
  width: 100%;
  margin: 0 auto 5px;
  overflow: hidden;
  overflow: hidden;
  ul {
    list-style: none;
    padding: 0;
    margin: 0 auto;
    li,
    a {
      display: block;
      height: 30px;
      line-height: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        color: var(--primary);
        font-size: 14px;
      }
    }
  }
}
.navs {
  padding: 0 var(--padding);
  justify-content: flex-start;
  // overflow: hidden;
  .nav-item {
    // min-width: 22%;
    width: 33.3%;
    overflow: hidden;
    text-align: center;
    font-size: 12px;
    .nav-img {
      width: 35px;
      height: 35px;
      display: block;
      margin: 0 auto 4px;
    }
  }
}
</style>
