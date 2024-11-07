<template>
  <van-popup v-model="typeModel" position="bottom" closeable get-container="body">
    <layout>
      <NavBar slot="header">{{title}}</NavBar>
      <div class="type-list section">
        <div class="type-item flex" v-for="coin in list" :key="coin.id" @click="select(coin.currency)">
          <CoinImg class="icon" :coin="coin.currency"></CoinImg>
          <div class="text-16px ml-2">{{coin.currency}}<small class="text-12px text-shallow"></small></div>
        </div>
      </div>
    </layout>
  </van-popup>
</template>

<script>
import { get } from 'vuex-pathify'
export default {
  name: 'select-coin',
  props: {
    title: String,
    filter: String,
  },
  data() {
    return {
      typeModel: false,
      type: '',
    }
  },
  computed: {
    userWallet: get('user/wallet'),
    list() {
      return this.filter
        ? this.userWallet.filter(item => item[this.filter])
        : this.userWallet
    },
  },
  methods: {
    select(coin) {
      this.$emit('select', coin)
      this.typeModel = false
    },
    popup() {
      this.typeModel = true
    },
  },
}
</script>

<style scoped lang="scss">
.type-list {
  color: #fff;
  .type-item {
    margin-bottom: 24px;
    .coin {
      width: 20px;
      height: 20px;
    }
  }
}
</style>