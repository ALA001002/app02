<template>
  <Layout>
    <NavBar slot="header" back>{{$t('app.invite')}}</NavBar>
    <div ref="content">
      <div class="card-top text-black">
        <div class="main-title text-36px text-bold line16">{{$t('extra.inviteFriend')}}</div>
        <div class="main-title text-36px text-bold line14">{{$t('extra.inviteFriendInfo')}}</div>
        <div class="text-15px mt-4 pt-1">{{$t('extra.inviteFriendInfo2')}}</div>
        <!-- <div class="top-btn text-15px mt-5" @click="$router.push('/view?type=key&id=fygz')">{{$t('extra.viewTheRules')}}</div> -->
        <div class="top-btn text-15px mt-5" @click="scrollBottom">{{$t('extra.viewTheRules')}}</div>
      </div>
      <div class="bg pb-0">
        <div class="card-type-2">
          <div class="title-corcle">{{$t('extra.inviteFriendsNow')}} </div>
          <div class="px-3 my-2">
            <van-tabs>
              <van-tab :title="$t('extra.shareCode')">
                <div class="text-black text-13px mb-1 mt-2">{{$t('extra.referralCode')}}</div>
                <div class="input-box flex-between">
                  {{user.uid}}
                  <img class="box24" v-copy="user.uid + ''" src="@/assets/images/new/invate_copy.svg">
                </div>
                <div class="text-black text-13px mb-1 mt-5">{{$t('extra.referralLink')}}</div>
                <div class="input-box flex-between ">
                  <span class="text-12px line14">{{inviteUrl}}</span>
                  <img class="box24" v-copy="inviteUrl" src="@/assets/images/new/invate_copy.svg">
                </div>
              </van-tab>
              <van-tab :title="$t('extra.shareQrcode')">
                <div class="mt-4">
                  <vue-qr :text="inviteUrl" class="m-auto" :size="180"></vue-qr>
                </div>
              </van-tab>
            </van-tabs>
          </div>
        </div>
        <div class="text-24px mt-5">{{content.title}}</div>
        <!-- <div class="text-15px text-shallow mt-1">{{$t('extra.noWelfareCardInfo')}}</div> -->
        <pre class="rich-text" v-html="content.content"></pre>
        <!-- <div class="text-24px mt-5">{{$t('extra.noWelfareCard')}}</div>
        <div class="text-15px text-shallow mt-1">{{$t('extra.noWelfareCardInfo')}}</div>
        <div class=" pt-0 index-start">
          <div class="flex-between my-5" v-for="item in  list" :key="item.title">
            <img class="box36" :src="item.icon">
            <div class="flex1 ml-4">
              <div class="index text-17px text-bold">{{item.title}}</div>
              <div class="text-15px text-mid mt-1">{{item.info}}</div>
            </div>
          </div>
        </div> -->
      </div>
      <div class=" bg  pb-0">
        <div class="tabs flex text-17px mb-4">
          <div class="tab mr-4" :class="{'text-primary':tab==='profit'}" @click="tab='profit'">{{$t('invite.myProfit')}}</div>
          <div class="tab" :class="{'text-primary':tab==='invite'}" @click="tab='invite'">{{$t('invite.myInvite')}}</div>
        </div>
        <div v-if="tab==='profit'">
          <div class="tabs2 flex-between">
            <div class="tab2 " :class="{active: coin===item.currency}" @click=" coin=item.currency" v-for="item in wallet" :key="item.id">{{item.currency}}</div>
          </div>
          <div class="flex flex-wrap mt-4">
            <div class=" w-50 mb-5">
              <div class="text-13px text-mid mb-2">{{$t('invite.yesterdayProfit')}} ({{coin}})</div>
              <div class="text-28px">{{inviteInfo.yesterdayProfit}}</div>
            </div>
            <div class="w-50 mb-5">
              <div class="text-13px text-mid mb-2">{{$t('invite.totalProfit')}} ({{coin}})</div>
              <div class="text-28px">{{inviteInfo.totalProfit}}</div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="tabs2 flex-between">
            <div class="tab2 flex1 tc" :class="{active: tab2==='todayTrade'}" @click=" tab2='todayTrade'">{{$t('invite.todayTrade')}}</div>
            <div class="tab2 flex1 tc" :class="{active: tab2==='yesterdayTrade'}" @click=" tab2='yesterdayTrade'">{{$t('invite.yesterdayTrade')}}</div>
          </div>
          <div class="flex flex-wrap mt-4">
            <div class=" w-50 mb-5">
              <div class="text-13px text-mid mb-2">{{$t('invite.inviteNum')}}</div>
              <div class="text-28px">{{data[tab2].inviteNum}}</div>
            </div>
            <div class="w-50 mb-5">
              <div class="text-13px text-mid mb-2">{{$t('invite.tradeNum')}}</div>
              <div class="text-28px">{{data[tab2].tradeNum}}</div>
            </div>
<!--            <div class="w-50 mb-5" v-for="(num, coin) in data[tab2].tradeInfo" :key="coin">-->
<!--              <div class="text-13px text-mid mb-2">{{$t('invite.volume')}} ({{coin}})</div>-->
<!--              <div class="text-28px">{{num}}</div>-->
<!--            </div>-->
          </div>
          <div class="flex-between p-2 px-3 radius-mid mb-4" style="background:#FDEDCC">
            <span class="text-15px">{{$t('invite.totalInviteNum')}}</span>
            <span class="text-32px text-primary line1">{{data.totalInviteNum}}</span>
          </div>
          <div class="flex-between px-2 text-13px text-shallow" style="background:#F6F6F6;height:36px">
            <span>{{$t('invite.inviteAccount')}}</span>
            <span>{{$t('invite.inviteTime')}}</span>
          </div>
          <div v-for="item in data.childList" :key="item.uid" class="flex-between text-shallow mt-3 mb-4">
            <small>{{item.username}}</small>
            <small>{{item.inviteTime}}</small>
          </div>
          <van-empty v-if="!listLoading && !data.childList.length" />
        </div>
      </div>
      <div class="rule bg">
        <div class="rule-title text-17px text-bold">{{rule.title}}</div>
        <pre class="rich-text" v-html="rule.content"></pre>
        <div class="my-4 bg"></div>
      </div>
    </div>
  </Layout>
</template>

<script>
import { get } from 'vuex-pathify'
import vueQr from 'vue-qr'
import img1 from '@/assets/images/new/invate_send.svg'
import img2 from '@/assets/images/new/invate_in.svg'
import img3 from '@/assets/images/new/invate_get.svg'
import img4 from '@/assets/images/new/invate_more.svg'
import http from '@/utils/http'
export default {
  components: {
    vueQr,
  },
  data() {
    return {
      isLoading: true,
      listLoading: true,
      shareLink: http.getH5HomeUrl(),
      rule: {},
      content: {
        title: '',
        content: '',
      },
      data: {
        yesterdayTrade: {},
        todayTrade: {},
        childList: [],
      },
      inviteInfo: {},
      tab: 'profit',
      list: [
        {
          title: this.$t('extra.shareCodeInfo1'),
          info: this.$t('extra.shareCodeDesc1'),
          to: '/',
          icon: img1,
        },
        {
          title: this.$t('extra.shareCodeInfo2'),
          info: this.$t('extra.shareCodeDesc2'),
          to: '/',
          icon: img2,
        },
        {
          title: this.$t('extra.shareCodeInfo3'),
          info: this.$t('extra.shareCodeDesc3'),
          to: '/',
          icon: img3,
        },
        {
          title: this.$t('extra.shareCodeInfo4'),
          info: this.$t('extra.shareCodeDesc4'),
          to: '/',
          icon: img4,
        },
      ],
      coin: '',
      tab2: 'todayTrade',
    }
  },
  mounted() {
    this.load()
  },
  computed: {
    wallet: get('user/wallet'),
    user: get('user/info'),
    inviteUrl() {
      return `${this.shareLink}/#/register?code=${this.user.uid}`
    },
  },
  watch: {
    wallet(wallet) {
      if (wallet && wallet.length) {
        this.coin = wallet[0].currency
      }
    },
    coin: 'loadCoinInfo',
  },
  methods: {
    load() {
      this.listLoading = true
      this.$http
        .get('invite/myInvitation')
        .then(data => {
          this.listLoading = false
          this.data = data
        })
        .catch(() => (this.listLoading = false))
      this.$http
        .get('common/getSysArticle?key=fygz')
        .then(rule => {
          this.rule = {
            title: '',
            content: '',
            ...rule,
          }
        })
        .catch(() => (this.isLoading = false))
      this.$http.get('/common/getSysArticle?key=invitat').then(content => {
        this.content = {
          title: '',
          content: '',
          ...content,
        }
        // console.log({ ...content })
      })
    },
    loadCoinInfo() {
      this.$http
        .get('invite/myProfit?coin=' + this.coin)
        .then(data => {
          this.isLoading = false
          this.inviteInfo = data
        })
        .catch(() => (this.isLoading = false))
    },
    scrollBottom() {
      this.$refs.content.scrollIntoView({ block: 'end', behavior: 'smooth' })
    },
  },
}
</script>

<style scoped lang="scss">
.tabs {
  .tab {
    padding: 5px 0;
    border-bottom: 3px solid transparent;
  }
  .tab.text-primary {
    border-bottom: 3px solid #f5a601;
  }
}
.tabs2 {
  background: #f4f4f5;
  padding: 3px;
  font-size: 15px;
  border-radius: 2px;
  .tab2 {
    height: 24px;
    border-radius: 2px;
    line-height: 24px;
    border-bottom: 3px solid transparent;
    color: #87868b;
    padding: 0 18px;
  }
  .tab2.active {
    background: #f5a601;
    color: #fff;
  }
}
.bg {
  overflow: hidden;
  padding: 15px;
  color: #12100e;
  .title-corcle {
    height: 100px;
    background: #f9edd7;
    border-radius: 100%;
    margin-top: -50px;
    line-height: 150px;
    text-align: center;
    color: #4e422c;
    font-size: 20px;
    font-weight: bold;
  }
  .card-type-2 {
    height: 320px;
    background: #ffffff;
    border-radius: 6px;
    border: 1px solid #e8a012;
    overflow: hidden;
    color: #606060;
  }
}
.bg {
  background: #fff;
}
.card-top {
  background: linear-gradient(180deg, #e5c385 0%, #f4e3bb 100%);
  padding: 45px 17px 75px;
}
.thead {
  background: #f6f6f6;
  height: 36px;
  font-size: 13px;
  padding: 0 15px;
}
.tbody {
  font-size: 13px;
  padding: 0 15px;
}
.top-btn {
  height: 40px;
  line-height: 40px;
  background: #000000;
  border-radius: 4px;
  color: #fff;
  display: inline-block;
  padding: 0 24px;
}
.input-box {
  height: 44px;
  line-height: 44px;
  border-radius: 6px;
  border: 1px solid #f1ae2f;
  padding: 0 15px;
  font-size: 16px;
}
.van-tabs ::v-deep {
  .van-tabs__wrap {
    background: #fff;
    height: 36px;
  }

  .van-tab {
    font-size: 15px;
    color: #121212;
  }
  .van-tab--active {
    color: #f1ae2f;
  }

  .van-tabs__line {
    width: 112px;
  }
}
.index-start {
  counter-reset: section;
  .index::before {
    counter-increment: section;
    content: counter(section) '.';
  }
}
</style>
