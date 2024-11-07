<template>
  <Layout full>
    <NavBar slot="header" back></NavBar>
    <van-tabs v-model="typeId" sticky animated mini :offset-top="50 + $store.state.statusbarHeight">
      <van-tab :name="item.typeId" :title="item.typeName" v-for="item in tabs" :key="item.typeId">
      </van-tab>
      <!-- <van-tab :title="$t('extra.doubleCoinMining')">
        <Nav2Vue @showPopup="showPopup=true"></Nav2Vue>
      </van-tab> -->
      <!-- <van-tab :title="$t('extra.DefiMining')">
        <Nav3Vue @showPopup="showPopup=true"></Nav3Vue>
      </van-tab> -->
      <!-- <van-tab :title="$t('extra.subscription')">
        <Nav4Vue @showPopup="showPopup=true"></Nav4Vue>
      </van-tab> -->
    </van-tabs>
    <div class="flex px-4  my-3 text-11px">
      <span class="green mr-4">{{$t('extra.rateOfReturn400')}}</span>
      <span class="green mr-4">{{$t('extra.shortTerm')}}</span>
      <span class="green">{{$t('extra.hassleFree')}}</span>
    </div>
    <Nav1Vue class="page-full-part" v-if="typeId===1" @showPopup="showPopup=true"></Nav1Vue>
    <Nav2Vue class="page-full-part" v-else-if="typeId===2" @showPopup="showPopup=true"></Nav2Vue>
    <van-popup v-model="showPopup" closeable round position="bottom">
      <div class="popup-title p-3 text-16px">{{$t('extra.howWork')}}</div>
      <div class="section">
        <NoData></NoData>
      </div>
    </van-popup>
  </Layout>
</template>
<script>
import Nav1Vue from './Nav1.vue'
import Nav2Vue from './Nav2.vue'
export default {
  components: { Nav1Vue, Nav2Vue },
  data() {
    return {
      typeId: Number(this.$route.params.type),
      tabs: [],
      showPopup: false,
      showAvailable: false,
    }
  },
  created() {
    console.log(this.typeId)
    this.getTypes()
  },
  watch: {},
  methods: {
    getTypes() {
      this.$http.get('product/productTypeList').then(data => {
        // console.log(data[0])
        this.tabs = data
      })
    },
  },
}
</script>
<style scoped lang="scss">
</style>