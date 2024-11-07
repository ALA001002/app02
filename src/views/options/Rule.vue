<template>
  <div class="rule page-full">
    <span class="back-icon okcoin okcoin-back flex-center" :style="{'margin-top':statusBarHeight + '!important' }" @click="$router.go(-1)"></span>
    <div class="back-padding" :style="{'margin-top':statusBarHeight + '!important' }">
      <van-tabs v-model="currentTab" type="card" animated show-header no-padding>
        <van-tab name="1" :title="$t('exchange.tradeRule')">
        </van-tab>
        <van-tab name="2" :title="$t('exchange.tradeTeach')">
        </van-tab>
        <van-tab name="3" :title="$t('exchange.chargeTeach')">
        </van-tab>
      </van-tabs>
    </div>
    <div class="page-full-part px-4">
      <div v-html="content.jygz" class="content" v-if="currentTab==='1'" />
      <div v-html="content.jyjc" class="content" v-else-if="currentTab==='2'" />
      <div v-html="content.czjc" class="content" v-else />
    </div>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      statusBarHeight: window.plus
        ? plus.navigator.getStatusbarHeight() + 10 + 'px'
        : '30px',
      currentTab: '1',
      content: {},
    }
  },
  async mounted() {
    this.queryContent('jygz')
    this.queryContent('jyjc')
    this.queryContent('czjc')
  },
  methods: {
    async queryContent(key) {
      let data = await this.$http.get('/common/getSysArticle', { key })
      this.content[key] = data?.content
      this.content = { ...this.content }
    },
  },
}
</script>
<style lang="scss" scoped>
.content {
  margin-top: 12px;
  ::v-deep iframe {
    width: 100%;
  }
}
.back-padding {
  padding: 0 48px;
}
</style>
