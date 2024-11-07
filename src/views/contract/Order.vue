<template>
  <BackPanel :title="$t('exchange.order')">
    <div class="hero pt-3" style="height: 100%;">
      <van-tabs v-model="form.trustType" class="mb-3" color="#377DFF" title-inactive-color="#AAAAAA" type="card">
        <van-tab v-for="item in trustTypes" :key="item.value" :name="item.value" :title="item.text"/>
      </van-tabs>
      <van-tabs v-model="form.status" color="#377DFF" title-inactive-color="#AAAAAA">
        <van-tab v-for="item in statues" :key="item.value" :name="item.value" :title="item.text"/>
      </van-tabs>
      <van-pull-refresh v-model="isLoading" class="is-grow" style="overflow: auto; pt-3" @refresh="load">
        <template v-if="form.trustType == '0'">
          <OrderItem v-for="item in list" :key="item.id" :data="item" :base="sup" :shareLink="shareLink" />
        </template>
        <template v-else>
          <OrderItem2 v-for="item in list" :key="item.id" :data="item" :base="sup" />
        </template>
        <van-empty v-if="!isLoading && !list.length" />
      </van-pull-refresh>
    </div>
  </BackPanel>
</template>

<script>
import BackPanel from '@/components/layout/BackPanel.vue'
import OrderItem from '@/components/contractList/OrderItem.vue'
import OrderItem2 from '@/components/contractList/OrderItem2.vue'
import { get } from 'vuex-pathify'
export default {
  components: { BackPanel, OrderItem, OrderItem2 },
  data() {
    return {
      sup: this,
      allList: [],
      isLoading: false,
      shareLink: null,
      form: {
        contractType: 0,
        trustType: this.$route.query.type || '0',
        status: '0'
      },
      trustTypes: [
        { text: this.$t('order.orderMarket'), value: '0' },
        { text: this.$t('order.orderTrust'), value: '1' }
      ],
      statues: [
        { text: this.$t('order.orderNow'), value: '0' },
        { text: this.$t('order.orderHistory'), value: '1' }
      ]
    }
  },
  created() {
    this.load()
    this.initConfig()
  },
  computed: {
    orderStatusChange: get('wsData@STATUS_CHANGE'),
    list() {
      return this.allList.filter(p => {
        if (this.form.status == '0') {
          return p.status == 0
        }
        return p.status != 0
      })
    }
  },
  watch: {
    'form.trustType': function() {
      this.load()
    },
    orderStatusChange: {
      handler() {
        this.load()
      },
      deep: true
    }
  },
  methods: {
    load: function() {
      var form = Object.assign({}, this.form)
      form.status = null
      this.$http.get('contract/listContract', form).then(data => {
        this.isLoading = false
        this.allList =data
      }).catch(() => {
        this.allList = []
        this.isLoading = false
      })
    },
    initConfig() {
      this.$http.get('common/getShareLink').then(data => {
        this.shareLink = data
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
