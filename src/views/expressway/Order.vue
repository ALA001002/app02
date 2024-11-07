<template>
  <BackPanel :title="$t('otc.expressTitle')">
    <van-cell
        v-for="item in list"
        :key="item.id"
        :is-link="false"
    >
      <div class="item">
        <div class="row">
          <span class="left">{{ item.payOrderId }}<i v-copy="item.payOrderId" class="icon icon-fuzhi"/></span>
          <span class="right">{{ statusText(item) }}</span></div>
        <div class="row gray">
          <span class="left">{{ titleText(item) }}</span>
          <span class="right">{{item.paySuccTime}}</span>
        </div>
      </div>
    </van-cell>
  </BackPanel>
</template>

<script>
import BackPanel from '@/components/layout/BackPanel.vue'
import {get} from 'vuex-pathify'

export default {
  components: {BackPanel},
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
      this.$http.get('pay/orderList').then((data) => {
        this.list = data
      })
    },
    titleText(data) {
      var isBuy = 1
      return this.$t('otc.type' + isBuy) + ' ' + data.amount + ' ' + 'USDT'
    },
    icon() {
      var isBuy = 1
      return isBuy ? 'chongzhi' : 'tibi'
    },
    statusText(data) {
      let key = `otc.newOrderStatus${data.status}`
      return this.$t(key)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.item .row{
  display: flex;
  flex-direction: row;
  .left{
    flex:1;
  }
  .right{
    width: 150px;
    text-align: right;
  }
}
.gray{
  color: rgba(11, 20, 36, 0.44);
}
</style>
