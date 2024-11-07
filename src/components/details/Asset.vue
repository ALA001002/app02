<template>
  <div class="table mt-1">
    <div class="header flex text-shallow text-13px mb-3">
      <div class=" w-30">{{$t('wallet.coin')}}</div>
      <div class=" w-30 tr pr-4">{{$t('wallet.assetLog')}}</div>
      <div class=" flex1 tr">{{$t('wallet.time')}}</div>
    </div>
    <div class="header flex text-deep line1 mb-3" v-for="item in list" :key="item.id">
      <div class="w-30 flex">
        <CoinImg class="box20 mr-2" :coin="item.coin"></CoinImg>
        <span class="text-16px">{{item.coin}}</span>
      </div>
      <div class=" w-30 text-20px tr pr-4">
        <TextFormat :float="item.dim?-1:1" :text="(item.dim?'-':'+')+item.amount" />
        <div class="text-shallow text-10px mt-1 mr-2">{{getTitle(item)}}</div>
      </div>
      <div class="tr flex1 text-12px">{{item.operateTime}}</div>
    </div>
    <no-data v-if="!isLoading&&!list.length"></no-data>
  </div>
  <!-- <van-pull-refresh v-model="isLoading" @refresh="load">
    <van-cell
      v-for="item in list"
      :key="item.id"
      :title="getTitle(item)"
      :label="item.operateTime"
      title-class="is-text-ellipsis"
    >
      <span :class="getColor(item.dim)">{{item.dim?'-':'+'}}{{Number(item.amount)}}</span><br>
    </van-cell>
    <van-empty v-if="!isLoading && !list.length" />
  </van-pull-refresh> -->
</template>

<script>
import TextFormat from '@/components/TextFormat.vue'
export default {
  components: {
    TextFormat,
  },
  props: {
    coin: String,
  },
  data() {
    return {
      isLoading: false,
      show: false,
      data: {},
      list: [],
    }
  },
  watch: {
    coin: {
      handler() {
        this.load()
      },
      immediate: true,
    },
  },
  methods: {
    load() {
      this.isLoading = true
      this.$http
        .get('asset/getAssetHistory?coin=' + (this.coin || ''))
        .then(data => {
          this.list = data
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    getTitle(data) {
      switch (data.type) {
        case 1:
          return this.$t('wallet.assetStatus1')
        case 2:
          return this.$t('wallet.assetStatus2')
        case 3:
          return this.$t('wallet.assetStatus3')
        case 4:
          return this.$t('wallet.assetStatus4')
        case 5:
          return this.$t('wallet.assetStatus5')
        case 6:
          return this.$t('wallet.assetStatus6')
        case 7:
          return this.$t('wallet.assetStatus7')
        case 8:
          return this.$t('wallet.assetStatus8')
        case 10:
          return this.$t('wallet.assetStatus10')
        case 11:
          return this.$t('wallet.assetStatus11')
        case 12:
          return this.$t('wallet.assetStatus12')
        case 13:
          return this.$t('wallet.assetStatus13')
        case 14:
          return this.$t('wallet.assetStatus14')
        case 15:
          return this.$t('wallet.assetStatus15')
        case 16:
          return this.$t('wallet.assetStatus16')
        case 17:
          return this.$t('wallet.assetStatus17')
        case 18:
          return this.$t('wallet.assetStatus18')
        case 19:
          return this.$t('wallet.assetStatus19')
        case 20:
          return this.$t('wallet.assetStatus20')
        case 21:
          return this.$t('wallet.assetStatus21')
        case 22:
          return this.$t('wallet.assetStatus22')
        case 23:
          return this.$t('wallet.assetStatus23')
        case 24:
          return this.$t('wallet.assetStatus24')
        case 25:
          return this.$t('wallet.assetStatus25')
        default:
          return this.$t('wallet.assetStatus0')
      }
    },
    getColor(dim) {
      switch (dim) {
        case 0:
          return 'has-text-primary'
        case 1:
          return 'has-text-danger'
        default:
          return 'has-text-grey'
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.cellTitle {
  flex: inherit;
  width: 80px;
}
</style>
