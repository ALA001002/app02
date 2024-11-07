<template>
  <Layout>
    <NavBar slot="header" back></NavBar>
    <div class="flex-between px-4">
      <div class="big-title">{{$t('extra.quickPayment')}}</div>
      <div class="link flex text-mid text-15px" @click="$router.go(-1)">
        <img class="box18 mr-1" src="@/assets/images/new/home_icon_lend.svg">
        {{$t('extra.recharge')}} <van-icon class=" ml-1" name="arrow"></van-icon>
      </div>
    </div>
    <div class="section">
      <div class="card-bg  flex-between  px-3 py-3 mb-24">
        <div class="flex1">
          <div class="text-13px mb-1">
            {{$t('extra.pay')}}
          </div>
          <input type="number" v-model="amount" class="input text-16px line1" :placeholder="$t('extra.least') + '1100'">
        </div>
        <div class="flex">
          <CoinImg class="box20 mr-2" :coin="coin"></CoinImg>
          <span>{{coin}}</span><span class="text-12px text-mid">/USDT</span>
        </div>
        <van-icon name="arrow" color="#ADACB0" size="16px"></van-icon>
      </div>
      <div class="card-bg  flex-between  px-3 py-3" @click="$refs.selectCoin.popup()">
        <div class="flex1">
          <div class="text-13px mb-1">
            {{$t('extra.receive')}}≈
          </div>
          <input type="number" v-model="amount" class="input text-16px line1" :placeholder="$t('extra.least') + '1100'">
        </div>
        <div class="flex">
          <CoinImg class="box20 mr-2" :coin="coin"></CoinImg>
          <span>{{coin}}</span><span class="text-12px text-mid">/USDT</span>
        </div>
        <van-icon name="arrow" color="#ADACB0" size="16px"></van-icon>
      </div>
      <div class="flex-end text-12px  text-shallow mt-3">{{$t('extra.proposedPrice')}}:&nbsp;<span class="text-primary">{{price}}</span> &nbsp;{{coin}}/{{moneyType}}
        <img class="box16 ml-2 mr-1" src="@/assets/images/new/recharge_exchange.svg">
      </div>
      <div class="big-btn radius mt-5">
        {{$t('extra.buy')}}
      </div>
    </div>
    <SelectCoinVue ref="selectCoin" filter="supRecharge" @select="coin=$event" :title="$t('extra.recharge')"></SelectCoinVue>
  </Layout>
</template>

<script>
import { get } from 'vuex-pathify'
import SelectCoinVue from '@/components/SelectCoin.vue'
export default {
  components: { SelectCoinVue },
  data() {
    return {
      moneyType: 'CNY',
      coin: this.$route.params.coin,
      price: '12123123',
      amount: '',
      form: {
        type: '2',
        money: null,
        toAddress: null,
        payPassword: '',
      },
    }
  },
  computed: {
    wallet: get('user/wallet'),
    user: get('user/info'),
  },
  methods: {},
}
</script>
