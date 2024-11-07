<template>
  <Layout full>
    <van-sticky :offset-top="$store.state.statusbarHeight">
      <van-tabs  v-model="active" custom>
        <van-tab :title="$t('extra.tabTotal')" name="tabTotal"></van-tab>
        <van-tab :title="$t('extra.tabMoney')" name="tabMoney"></van-tab>
        <van-tab :title="$t('extra.loan')" name="loan" v-if="loanStatus"></van-tab>
        <van-tab :title="$t('extra.DeFi')" name="DeFi"></van-tab>
<!--        <van-tab :title="$t('wallet.expressway')" name="expressway" ></van-tab>-->
      </van-tabs>
      <!-- 资产和用户资料 -->
      <div class="section flex-between pb-1" style="margin-top:10px">
        <div class="money">
          <div class="flex text-mid text-13px">
            <span>{{ $t("app.totalAssets") }}(USDT)</span>
            <van-icon :name="see?'eye-o':'closed-eye'" size="16" @click="see = !see" />
          </div>
          <div class="text-28px mt-3 mb-0 text-primary">{{ see ? totalAssets : "--" }}</div>
          <div class="flex text-mid text-13px">
            <span>≈ {{ see ? totalAssets.toFixed(2) : "--"}} USDT</span>
          </div>
        </div>
        <div class="userinfo">
          <div class=" text-shallow text-13px flex-end">
            UID:{{user.uid}}
            <img class="ml-2 br50" style="width: 32px;" v-if="user.avatar" :src="user.avatar">
            <img class="ml-2 br50" style="width: 32px;" v-else src="@/assets/images/new/home_photo.svg">
          </div>
          <div class=" text-12px flex-end mt-1 mb-2">
            {{ user.email}}
          </div>
          <router-link tag="div" to="/setting/account" class=" text-13px text-primary flex-end">
            {{ $t("app.editAccount")}}
          </router-link>
        </div>
      </div>
      <div class="section mt-0 mb-0">
        <div class="btns">
<!--          <div class="btn bg-primary" @click="$router.push('/wallet/deposit/USDT')">{{$t('app.deposit')}}</div>-->
           <div class="btn bg-primary" @click="$refs.selectCoin.popup()">{{$t('app.deposit')}}</div>
          <div class="btn" @click="$refs.selectCoinWithdraw.popup()">{{$t('app.withdraw')}}</div>
<!--          <div class="btn" @click="$router.push('/switchp')">{{$t('app.switch')}}</div>-->
          <div class="btn">{{$t('app.switch')}}</div>
        </div>
      </div>
    </van-sticky>
    <van-tabs v-model="active" animated hide-header>
      <van-tab title="" name="tabTotal"></van-tab>
      <van-tab title="" name="tabMoney"></van-tab>
      <van-tab title="" name="loan" v-if="loanStatus"></van-tab>
      <van-tab title="DeFi" name="DeFi"></van-tab>
      <van-tab name="expressway"></van-tab>
    </van-tabs>
    <!-- 资产 -->
    <div class="section coin-list mt-1" v-if="active==='tabTotal'">
      <router-link class="coin-item flex-between mb-5" v-for="w in wallet" :key="w.id" :to="'/wallet/details/'+w.currency">
<!--        <coinImg class="icon mr-2" :coin="w.currency"></coinImg>-->
        <img class="icon mr-2" :src="w.ico"/>
        <div class="flex1">
          <div class="text-16px"> {{w.currency}}</div>
          <div class="text-11px text-shallow">{{$t('extra.availableBalance')}}</div>
        </div>
        <div class="tr">
          <div class="text-16px">{{see ? w.balance : "--"}}</div>
          <div class="text-11px text-shallow">{{see ? w.balance : "--"}}</div>
        </div>
      </router-link>
      <div class="coin-item flex-between mb-5" v-for="w in walletExtra" :key="w.id" :to="'/wallet/details/USDT'">
        <img class="icon mr-2" src="@/assets/images/new/OTHER_COIN.svg">
        <div class="flex1">
          <div class="text-16px"> {{w.currency}}</div>
          <div class="text-11px text-shallow">{{$t('extra.availableBalance')}}</div>
        </div>
        <div class="tr">
          <div class="text-16px">{{see ? w.balance : "--"}}</div>
          <div class="text-11px text-shallow">{{see ? w.balance : "--"}}</div>
        </div>
      </div>
    </div>
    <walletDetail v-else-if="active==='tabMoney'"></walletDetail>
    <account v-else-if="active==='loan' && loanStatus"></account>
    <DeFiNav v-else-if="active==='DeFi'"></DeFiNav>
    <fastDetail v-else-if="active==='expressway'"></fastDetail>
    <SelectCoinVue ref="selectCoin" filter="supWithdraw" @select="recharge" :title="$t('extra.recharge')"></SelectCoinVue>
    <SelectCoinVue ref="selectCoinWithdraw" filter="supRecharge" @select="withdraw" :title="$t('extra.withdrawalType')"></SelectCoinVue>
  </Layout>
</template>

<script>
import Layout from '@/components/layout/Index.vue'
import DeFiNav from '@/views/DeFi/Nav.vue'
import account from '@/views/loan/account.vue'
import walletDetail from '@/views/wallet/walletDetail.vue'
import fastDetail from '@/views/wallet/fastDetail.vue'
import { get, sync, call } from 'vuex-pathify'
import SelectCoinVue from '@/components/SelectCoin.vue'

export default {
  name: 'Home',
  components: {
    account,
    Layout,
    walletDetail,
    fastDetail,
    DeFiNav,
    SelectCoinVue,
  },
  data() {
    return {
      active: 'tabTotal',
      imgUrl: '',
      walletWidth: 170,
      showProfit: false,
      walletExtra: [

      ],
    }
  },
  created() {
    this.walletWidth = (document.body.clientWidth - 40) / 2
    this.load()
    this.updateInfo()
    this.$http.get('common/profitStatus').then(data => {
      if (data == 1) {
        this.showProfit = true
      } else {
        this.showProfit = false
      }
    })
  },
  computed: {
    user: get('user/info'),
    see: sync('config@see'),
    wallet: get('user/wallet'),
    loanStatus: get('loanStatus'),
    hqList: get('hq/hq'),
    // profit: get('user/profit'),
    config: get('bgConfig'),
    links() {
      return [
        {
          name: this.$t('subscription.property'),
          icon: 'OTC',
          to: '/property',
        },
        {
          name: this.$t('app.deposit'),
          icon: 'chongzhi',
          to: '/walletPage/main',
        },
        { name: this.$t('app.withdraw'), icon: 'tibi', to: '/wallet/withdraw' },
        // { name: this.$t('app.switch'), icon: 'huazhuan', to: '/switchp' },

        // { name: this.$t('app.otc'), icon: 'OTC', to: '/otc' }
      ]
    },
    menu() {
      var authStatus = this.$t('app.idCardStatus'+(this.user.authStatus||0))
      return [
        { icon: 'kefu', title: this.$t('app.contactService'), to: '/iframe/1' },
        {
          icon: 'baozhangjijin',
          title: this.$t('wallet.caiwu'),
          to: 'mywallet',
          key: 'hide',
        },
        { icon: 'tongzhi', title: this.$t('app.station'), to: '/letters' },
        // { icon: 'bangzhu', title: this.$t('app.helpCenter'), to: '/help' },
        // { icon: 'yaoqingren', title: this.$t('app.myInviter'), to: '/myInviter' },
        { icon: 'renzheng', title: this.$t('app.auth'), to: '/authentication', value: authStatus },
        // { icon: 'shoukuan', title: this.$t('app.payment'), to: '/payment' },
        {
          title: this.$t('app.licaijl'),
          icon: 'zengjin',
          to: '/licaiList',
          key: 'hide',
        },
        {
          icon: 'anquan',
          title: this.$t('app.security'),
          to: '/security',
          key: 'hide',
        },
        { icon: 'shezhi', title: this.$t('app.settings'), to: '/setting' },
        {
          icon: 'guanyuwomen',
          title: this.$t('app.aboutUs'),
          to: '/about',
          key: 'hide',
        },
      ]
    },
    totalAssets() {
      var usdt = 0
      for (var w of this.wallet) {
        if (w.currency === 'USDT') {
          usdt += w.balance
          // console.log(w.balance)
        } else {
          var price = this.hqList.find(
            p => p.from === w.currency && p.to === 'USDT'
          )
          if (price) {
            // console.log(price.from, w.balance , price.price, price.price * w.balance )
            usdt += price ? price.price * w.balance : 0
          }
        }
      }
      return this.toNumber(usdt)
    },
    ud() {
      return this.profit == undefined ? 0 : this.profit
    },
  },
  methods: {
    ...call({
      updateInfo: 'user/info',
    }),
    recharge(coin) {
      this.$router.push('/wallet/deposit/' + coin)
    },
    withdraw(coin) {
      this.$router.push('/wallet/withdraw/' + coin)
    },
    async refreshAccountInfo() {
      this.$http.create_api.get('common/refreshAccountInfo')
    },
    load() {
      this.$http.get('common/getSysNoticeList?type=4').then(data => {
        if (data.length) {
          this.imgUrl = data[0].url
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.wallet {
  border-radius: 4px 4px 0 0;
  background-image: url('~@/assets/images/yx.png');
  background-repeat: no-repeat;
  background-position: top right;
  background-size: contain;
  color: white;
}
.wallet.ETH {
  background-color: #33579b !important;
}
::v-deep {
  .icon-morentouxiang {
    font-size: 2.8rem;
  }
}
.grid-icon {
  background-color: rgba(55, 125, 255, 0.06);
  border-radius: 50%;
  padding: 7px;
  margin-bottom: 6px;
}
</style>
