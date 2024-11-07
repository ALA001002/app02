<template>
  <div class="hero has-text-dark">
    <van-tabs v-model="select" type="card" class="my-3 mx-2" color="#377DFF">
      <van-tab name="todayTrade" :title="$t('invite.todayTrade')"/>
      <van-tab name="yesterdayTrade" :title="$t('invite.yesterdayTrade')"/>
    </van-tabs>
    <van-pull-refresh v-model="isLoading" class="is-grow" style="overflow: auto;" @refresh="load">
      <div class="section">
        <div class="card">
          <div class="is-flex-center">
            <div class="is-grow">
              <strong>{{trade.inviteNum}}</strong>
              <small class="has-text-grey-light">{{$t('invite.inviteNum')}}</small>
            </div>
            <div class="is-grow">
              <strong>{{trade.tradeNum}}</strong>
              <small class="has-text-grey-light">{{$t('invite.tradeNum')}}</small>
            </div>
          </div>
          <div class="is-flex-center mt-4">
            <div v-for="(num, coin) in trade.tradeInfo" :key="coin" class="is-grow">
              <strong>{{num}}</strong>
              <small class="has-text-grey-light">{{$t('invite.volume')}} ({{coin}})</small>
            </div>
          </div>
        </div>
      </div>
      <div style="background:rgba(244,245,246,1);height:10px;" />
      <div class="section">
        <div class="card py-2 mb-4">
          <div class="is-flex-center">
            <strong class="mb-0">{{$t('invite.totalInviteNum')}}</strong>
            <strong class="has-text-info">{{data.totalInviteNum}}</strong>
          </div>
        </div>
        <div class="is-flex-center mb-3">
          <small class="has-text-grey-light">{{$t('invite.inviteAccount')}}</small>
          <small class="has-text-grey-light">{{$t('invite.inviteTime')}}</small>
        </div>
        <div v-for="item in data.childList" :key="item.uid" class="is-flex-center mb-2">
          <small>{{item.username}}</small>
          <small>{{item.inviteTime}}</small>
        </div>
        <van-empty v-if="!isLoading && !data.childList.length" />
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import { get } from 'vuex-pathify'
export default {
  data() {
    return {
      select: 'todayTrade',
      isLoading: false,
      data: { 
        childList: []
      }
    }
  },
  created() {
  },
  computed: {
    wallet: get('user/wallet'),
    user: get('user/info'),
    trade() {
      return this.data[this.select] || {}
    }
  },
  watch: {
    select: {
      handler() {
        this.load()
      },
      immediate: true
    }
  },
  methods: {
    load() {
      this.$http.get('invite/myInvitation').then(data => {
        this.isLoading = false
        this.data = data
      }).catch(() => this.isLoading = false)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.panel-footer {
  box-shadow:4px 0px 6px 0px rgba(0,0,0,0.15);
  padding: 15px;
}
</style>
