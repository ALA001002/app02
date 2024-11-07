<template>
  <Layout>
    <NavBar slot="header" back></NavBar>
    <div class="section py-0">
      <div class="big-title">{{$t('app.settings')}}</div>
      <div class="card-bg flex-between p-3 mb-24" @click="dd">
        <img class="box40" src="@/assets/images/new/set_update.svg">
        <div class="flex1 ml-2 text-15px">{{$t('app.verionCheck')}}</div>
        <div class="flex">
          <div class="text-15px text-mid">{{ version }}</div>
          <!-- <van-icon v-if="newVersion.version != version" class="pl-2 mr-1" dot /> -->
          <van-icon name="arrow" class="ml-1" color="#888" size="16"></van-icon>
        </div>
      </div>
      <div class="card-bg flex-between p-3" @click="showLangSelectModal=true">
        <img class="box40" src="@/assets/images/new/set_message.svg">
        <div class="flex1 ml-2 text-15px">{{$t('app.lang')}}</div>
        <div class="flex">
          <div class="text-15px text-mid">{{ langName }}</div>
          <van-icon name="arrow" class="ml-1" color="#888" size="16"></van-icon>
        </div>
      </div>
    </div>
    <van-action-sheet v-model="showLangSelectModal" close-on-click-action :cancel-text="$t('app.cancel')" :actions="langs" :round="false" @select="changeLang" />
  </Layout>
</template>

<script>
import { get, call } from 'vuex-pathify'
import { langs } from '@/i18n'
import { Dialog, Toast } from 'vant'
export default {
  components: {},
  data() {
    return { langs, showLangSelectModal: false }
  },
  computed: {
    lang: get('lang'),
    version: get('version'),
    newVersion: get('newVersion'),
    langName() {
      return (langs.find(p => p.id == this.lang) || {}).name
    },
  },
  methods: {
    logout: call('user/logout'),
    checkVersion: call('checkVersion'),
    confirm() {
      Dialog.confirm({ title: this.$t('app.confirmLogout') }).then(() => {
        this.logout()
      })
    },
    changeLang(lang) {
      this.$i18n.changeLang(lang.id)
    },
    dd() {
      this.checkVersion({
        callback: data => {
          if (data.version == this.version) {
            Toast('已经是最新版本')
          }
        },
      })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
