<template>
  <Layout full>
    <NavBar slot="header" back></NavBar>
    <div class="big-title px-4">{{$t('extra.addAddress')}}</div>
    <div class="section page-full-part">
      <div class="card-bg  flex-between  px-3 py-4" @click="$refs.selectCoin.popup()">
        <div class="flex1">
          <div class="flex">
            <CoinImg class="box20 mr-2" :coin="coin"></CoinImg>
            <span>{{coin}}</span><span class="text-12px text-mid"></span>
          </div>
        </div>
        <van-icon name="arrow" color="#ADACB0" size="16px"></van-icon>
      </div>
      <!-- <div class="flex my-3 mt-4" style="gap:15px">
        <div class="coin-type" :class="{active:coinType===type}" @click="coinType=type" v-for="type in coinTypes" :key="type">{{type}}</div>
      </div> -->
      <div class="text-15px text-shallow my-3">{{$t('extra.address')}}</div>
      <input type="text" v-model="form.address" class="input-bg" :placeholder="$t('extra.enterAddress')">
      <div class="text-15px text-shallow my-3">{{$t('extra.addressName')}}</div>
      <input type="text" v-model="form.remark" class="input-bg" :placeholder="$t('extra.enterAddressName')">
    </div>
    <div class="section">
      <div class="big-btn radius mt-5" :disabled="!form.address || !form.remark" @click="onSubmit">
        {{$t('wallet.submit')}}
      </div>
    </div>
    <SelectCoinVue ref="selectCoin" filter="supWithdraw" @select="coin=$event" :title="$t('extra.withdrawalType')"></SelectCoinVue>
  </Layout>
</template>

<script>
// import QrScan from '@/components/QrScan.vue'
// import { get } from 'vuex-pathify'
import { Toast } from 'vant'
import SelectCoinVue from '@/components/SelectCoin.vue'
export default {
  components: {
    SelectCoinVue,
  },
  data() {
    return {
      coin: this.$route.params.coin,
      coinType: 'ERC20',
      coinTypes: ['ERC20', 'TRC20'],
      form: {
        address: '',
        remark: '',
      },
    }
  },
  methods: {
    onSubmit() {
      this.$http
        .post('asset/bindWithdrawAddr', { coin: this.coin, ...this.form })
        .then(() => {
          Toast.success()
          this.$router.go(-1)
        })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.coin-type {
  background: #18171c;
  height: 24px;
  line-height: 24px;
  font-size: 12px;
  padding: 0 15px;
  border-radius: 2px;
  color: #9b9aa1;
  &.active {
    color: var(--primary);
  }
}
</style>
