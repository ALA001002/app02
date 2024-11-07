<template>
  <div class="hero has-text-dark">
    <van-tabs v-model="coin" type="card" class="my-3 mx-2" color="#377DFF">
      <van-tab v-for="w in wallet" :key="w.id" :name="w.currency" :title="w.currency"/>
    </van-tabs>
    <van-pull-refresh v-model="isLoading" class="is-grow" style="overflow: auto;" @refresh="load">
      <div class="section">
        <div class="card">
          <strong>{{$t('invite.contractInviteProfit')}}</strong>
          <div class="is-flex-center mt-4">
            <div class="is-grow">
              <strong>{{data.yesterdayProfit}}</strong>
              <small class="has-text-grey-light">{{$t('invite.yesterdayProfit')}} ({{coin}})</small>
            </div>
            <div class="is-grow">
              <strong>{{data.totalProfit}}</strong>
              <small class="has-text-grey-light">{{$t('invite.totalProfit')}} ({{coin}})</small>
            </div>
          </div>
        </div>
      </div>
      <div v-html="rebateRules" class="section">

      </div>
    </van-pull-refresh>

    <div class="panel-footer is-flex-center">
      <div><span class="has-text-grey">{{$t('invite.code')}}: </span><span v-copy>{{user.uid}} <i class="icon icon-fuzhi"/></span></div>
      <button class="button is-info is-small is-light" @click="showShare=true">{{$t('invite.shareNow')}} <van-icon class="ml-1 mr-0" name="share"/></button>
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

  </div>
</template>

<script>
import { get } from 'vuex-pathify'
import saveImg from '@/utils/saveImg'
import vueQr from 'vue-qr'
import { Toast } from 'vant'
import http from '@/utils/http'
export default {
  components: { vueQr },
  data() {
    return {
      coin: null,
      isLoading: false,
      data: {},
      showShare: false,
      shareLink: null,
      rebateRules: null,
      shareOptions: [
        { name: this.$t('invite.saveImage'), icon: 'poster' },
        { name: this.$t('invite.link'), icon: 'link' },
      ]
    }
  },
  created() {
    // this.initConfig()
    this.shareLink = http.getH5HomeUrl()
    this.rebateRulesConfig()
  },
  computed: {
    lang: get('lang'),
    wallet: get('user/wallet'),
    user: get('user/info'),
  },
  watch: {
    coin() {
      this.load()
    },
    wallet(val) {
      if(this.coin == null && val.length > 0) {
        this.coin = val[0].currency
      }
    }
  },
  methods: {
    load() {
      this.$http.get('invite/myProfit?coin=' + this.coin).then(data => {
        this.isLoading = false
        this.data = data
      }).catch(() => this.isLoading = false)
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
    },
    initConfig() {
      this.$http.get('common/getShareLink').then(data => {
        this.shareLink = data
      })
    },
    rebateRulesConfig() {
      this.$http.get('/common/getSysArticle?key=fygz').then(data => {
        this.rebateRules = data.content
      })
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
.share-panel {
  position: relative; display: inline-block;
  font-family:PingFangSC-Medium,PingFang SC;
  color: #242424;
  font-size: 0;
  line-height: 0;
  img{ height: 50vh; min-height: 400px; }
}
.share-content{
  font-size: 14px;
  line-height: 16px;
  position: absolute;
  left: 1rem;
  right: 1rem;
  bottom: 1rem;
  text-align: left;
}
.qr {
  height: 3.1rem;
  width: 3.1rem;
  overflow: hidden;
  img { height: 100%; min-height: 100%; }
}
</style>
