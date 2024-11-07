<template>
  <Layout>
    <NavBar slot="header" back></NavBar>
    <van-tabs v-model="active" sticky animated mini :offset-top="50 + $store.state.statusbarHeight">
      <van-tab :title="$t('extra.flexiblePledge')">
        <Nav1Vue @showPopup="showPopup=true"></Nav1Vue>
      </van-tab>
      <van-tab :title="$t('extra.doubleCoinMining')">
        <Nav2Vue @showPopup="showPopup=true"></Nav2Vue>
      </van-tab>
      <van-tab :title="$t('extra.DefiMining')">
        <Nav3Vue @showPopup="showPopup=true"></Nav3Vue>
      </van-tab>
      <van-tab :title="$t('extra.subscription')">
        <Nav4Vue @showPopup="showPopup=true"></Nav4Vue>
      </van-tab>
    </van-tabs>
    <van-popup v-model="showPopup" closeable round position="bottom">
      <div class="popup-title p-3 text-16px">{{$t('extra.howWork')}}</div>
      <div class="section">
        <NoData></NoData>
      </div>
    </van-popup>
  </Layout>
</template>
<script>
import ItemVue from './Item.vue'
import Nav1Vue from './Nav1.vue'
import Nav2Vue from './Nav3.vue'
import Nav3Vue from './Nav2.vue'
import Nav4Vue from './Nav4.vue'
export default {
  components: { ItemVue, Nav1Vue, Nav2Vue, Nav3Vue, Nav4Vue },
  data() {
    return {
      active: Number(this.$route.params.active),
      showPopup: false,
      showAvailable: false,
    }
  },
  created() {},
}
</script>
<style scoped lang="scss">
</style>