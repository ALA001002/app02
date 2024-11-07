<template>
  <van-tabbar id="tabbar_menu" :zIndex="999" :fixed="false" route safe-area-inset-bottom>
    <!-- <template v-for="tab in tabs">
      <van-tabbar-item :key="tab.name" :icon="tab.icon" :to="tab.to" icon-prefix="icon" v-if="!(config.licaiFlag && tab.key==='licai') && config">
        {{config.shequFlag && tab.key==='shequ'?$t('app.communityNew'):tab.name }}
      </van-tabbar-item>
    </template> -->
    <!-- <van-tabbar-item icon="aim" url="http://192.168.0.17:8080">
      Test
    </van-tabbar-item> -->
    <van-tabbar-item replace to="/home">
      <span>{{$t('app.home')}}</span>
      <template slot="icon" slot-scope="props">
        <img v-if="props.active" class="icon" src="@/assets/images/new/tab_home_press.svg">
        <img v-else class="icon" src="@/assets/images/new/tab_home_default.svg">
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/options">
      <span>{{$t('extra.quotes')}}</span>
      <template slot="icon" slot-scope="props">
        <img v-if="props.active" class="icon" src="@/assets/images/new/tab_price_press.svg">
        <img v-else class="icon" src="@/assets/images/new/tab_price_default.svg">
      </template>
    </van-tabbar-item>
    <van-tabbar-item to="/options/btcusdt">
      <span>{{$t('app.spot')}}</span>
      <template slot="icon" slot-scope="props">
        <img v-if="props.active" class="icon" src="@/assets/images/new/tab_price_press.svg">
        <img v-else class="icon" src="@/assets/images/new/tab_predict_default.svg">
      </template>
    </van-tabbar-item>
    <!-- <van-tabbar-item to="/licai" v-if="config && config.licaiFlag"> -->
    <van-tabbar-item replace to="/DeFi">
      <span>{{$t('extra.DeFi')}}</span>
      <template slot="icon" slot-scope="props">
        <img v-if="props.active" class="icon" src="@/assets/images/new/tab_money_default.svg">
        <img v-else class="icon" src="@/assets/images/new/tab_money_press.svg">
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/account">
      <span>{{$t('extra.assets')}}</span>
      <template slot="icon" slot-scope="props">
        <img v-if="props.active" class="icon" src="@/assets/images/new/tab_asset_press.svg">
        <img v-else class="icon" src="@/assets/images/new/tab_asset_default.svg">
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { get } from 'vuex-pathify'
export default {
  data() {
    return {
      active: 0,
    }
  },
  created() {},
  computed: {
    config: get('bgConfig'),
    tabs() {
      return [
        { name: this.$t('app.home'), icon: 'shouye', to: '/home' },
        // {
        //   name: this.$t('subscription.swichtitle'),
        //   icon: 'saoma',
        //   to: '/activity',
        // },
        // { name: this.$t('app.contract'), icon: 'heyue', to: '/contract' },
        // { name: this.$t('app.options'), icon: 'heyue', to: '/options' },
        // { name: this.$t('app.otc'), icon: 'OTC', to: '/otc' },
        { name: this.$t('app.plan'), icon: 'heyue', to: '/options' },
        {
          name: this.$t('app.licai'),
          icon: 'zengjin',
          to: '/licai',
          key: 'licai',
        },
        {
          name: this.$t('app.community'),
          icon: 'shequ',
          to: '/community',
          key: 'shequ',
        },
        { name: this.$t('app.account'), icon: 'wode', to: '/account' },
      ]
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.van-hairline--top-bottom::after {
  display: none;
}
.van-tabbar-item {
  span {
    font-size: 10px;
  }
  img.icon {
    width: 30px;
    height: 30px;
  }
}
</style>
