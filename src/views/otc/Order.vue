<template>
  <BackPanel :title="$t('otc.order')">
    <van-cell
      v-for="item in list"
      :key="item.id"
      :title="titleText(item)" :to='`/otc/order/${item.id}`'
      :label="item.createTime"
      :value="statusText(item)"
      :icon="icon(item)"
      icon-prefix="icon"
      is-link
    />
  </BackPanel>
</template>

<script>
import BackPanel from '@/components/layout/BackPanel.vue'
import { get } from 'vuex-pathify'
export default {
  components: { BackPanel },
  data() {
    return {
      list: []
    }
  },
  created() {
    this.load()
  },
  computed: {
    uid: get('user/info@uid'),
  },
  methods: {
    load() {
      this.$http.get('otc/myOrderList').then((data) => {
        this.list = data
      })
    },
    titleText(data) {
      var isBuy = data.buyerId == this.uid ? 1 : 0
      return this.$t('otc.type'+isBuy) + ' ' + data.amount + ' ' + data.coin
    },
    icon(data) {
      var isBuy = data.buyerId == this.uid ? 1 : 0
      return isBuy ? 'chongzhi' : 'tibi'
    },
    statusText(data) {
      var isBuy = data.buyerId == this.uid ? 1 : 0
      var key = data.status < 2 
        ? 'otc.orderStatus' + data.status + '' + isBuy 
        : 'otc.orderStatus' + data.status
      return this.$t(key)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
