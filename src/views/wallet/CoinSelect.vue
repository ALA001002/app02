<!--<template>
  <BackPanel :title="$t('wallet.selectCoin')">
    <van-cell
    v-for="item in wallet"
    :key="item.id"
    :title="item.currency"
    @click="gotoNextPage(item)"
    is-link
  />
    <div v-html="$t('wallet.tip')" style="background: white;padding: 20px" v-if=" this.goto === 'withdraw'">
    </div>
  </BackPanel>
</template>

<script>
import BackPanel from '@/components/layout/BackPanel.vue'
import { get } from 'vuex-pathify'
import {Toast} from 'vant'
export default {
  components: { BackPanel },
  computed: {
    userWallet: get('user/wallet'),
    wallet() {
      var type = this.goto === 'withdraw' ? 'supWithdraw' : 'supRecharge'
      return this.userWallet.filter(p => p[type] === 1)
    },
    goto: function() {
      return this.$route.params.goto
    }
  },
  methods:{
    gotoNextPage(item){
      if(this.goto==='withdraw' && item.currency!=='DIEM'){
        Toast.fail({ message:this.$t('wallet.diemTip'), className:'width-toast' })
        return false
      }
      this.$router.push(`/wallet/${this.goto}/${item.currency}`)
    }
  }
}
</script>-->

<template>
  <BackPanel :title="$t('wallet.selectCoin')">
    <van-cell
        v-for="item in wallet"
        :key="item.id"
        :title="item.currency"
        :to="'/wallet/'+goto+'/'+item.currency"
        is-link
    />
    <div>
      <van-cell title="1% 1day" to="/licai"
                is-link/>
    </div>
    <div class="banner-img"></div>
  </BackPanel>
</template>

<script>
import BackPanel from '@/components/layout/BackPanel.vue'
import { get } from 'vuex-pathify'
export default {
  components: { BackPanel },
  computed: {
    userWallet: get('user/wallet'),
    wallet() {
      var type = this.goto === 'withdraw' ? 'supWithdraw' : 'supRecharge'
      return this.userWallet.filter(p => p[type] === 1)
    },
    goto: function() {
      return this.$route.params.goto
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.width-toast{
  width: 300px;
}
.banner-img{
  width: 100%;
  height: 300px;
  background: url('../../assets/images/licai_banner.jpeg') no-repeat;
  background-size: 100% 100%;
}
</style>
