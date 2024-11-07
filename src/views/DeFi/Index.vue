<template>
  <Layout>
    <!-- <NavBar slot="header">{{$t('extra.DeFiShop')}}</NavBar> -->
    <div class="section">
      <div class="flex-around">
        <router-link :to="'/DeFi/detail/'+ tab.typeId" class="tc" v-for="tab in tabs" :key="tab.typeId">
          <img class="box36" :src="typeImg[tab.typeId]">
          <div class="text-13px mt-2">{{tab.typeName}}</div>
        </router-link>
      </div>
      <div class="card-bg bottom flex-between px-4 py-2 mt-4 mb-0">
        <div class="flex1" style="margin:3px 0">
          <div class="name text-primary text-13px">{{$t('extra.Launchpool')}}</div>
          <div class="info text-12px text-mid mt-2" style="margin:3px 0">{{$t('extra.LaunchpoolInfo')}}</div>
        </div>
        <img style="width:66px" src="@/assets/images/new/home_img.svg" alt="">
      </div>
    </div>
    <van-tabs class="section" :sticky="false" animated small small-padding>
      <van-tab :title="$t('extra.hotProduct')" class="this-tab">
        <div slot="title" class="flex tab-title">
          {{$t('extra.hotProduct')}}
          <img style="width: 17px;" class="ml-1" src="@/assets/images/new/icon_hot.svg">
        </div>
      </van-tab>
      <!-- <van-tab :title="$t('extra.newbie')">
        </van-tab>
        <van-tab :title="$t('extra.vipDiscount')">
          <div slot="title" class="flex tab-title">
            {{$t('extra.vipDiscount')}}
            <img style="width: 19px;" class="ml-1" src="@/assets/images/new/icon_vip.svg">
          </div>
        </van-tab> -->
    </van-tabs>
    <div class="flex1-auto ">
      <ItemVue v-for="item in list" :key="item.id" :item="item"></ItemVue>
    </div>
  </Layout>
</template>
<script>
import ItemVue from './Item.vue'
import Layout from '@/components/layout/Index.vue'
import img1 from '@/assets/images/new/defi_wallet.svg'
import img2 from '@/assets/images/new/defi_coin.svg'
import img3 from '@/assets/images/new/defi_deg.svg'
import img4 from '@/assets/images/new/defi_pool.svg'
export default {
  components: { Layout, ItemVue },
  created() {
    this.getTypes()
  },
  data() {
    return {
      tabs: [],
      list: [],
      typeImg: {
        1: img1,
        2: img2,
        3: img3,
        4: img4,
      },
      params: {
        typeId: null,
        status: 1,
      },
    }
  },
  methods: {
    getTypes() {
      this.$http.get('product/productTypeList').then(data => {
        // console.log(data[0])
        this.tabs = data
      })
      this.$http.get('product/productTopList').then(data => {
        console.log({ ...data[0] })
        this.list = data
      })
    },
  },
}
</script>
<style scoped lang="scss">
</style>