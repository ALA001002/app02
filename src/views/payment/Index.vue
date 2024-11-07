<template>
  <BackPanel :title="$t('app.payment')">
    <van-cell
      v-for="item in list"
      :key="item.id"
      :title="item.bankName" :to='`/payment/${item.id}?name=${item.bankName}`'
      :label="item.bankAccount"
      :value="item.legalCurrency"
      class="van-contact-card"
      icon="shoukuanfangshi"
      icon-prefix="icon"
      is-link
    />
    <van-cell :title="$t('app.addPayment')" icon="add-square" @click="show=true"/>
    <van-action-sheet v-model="show" :actions="pList" :cancel-text="$t('app.cancel')" close-on-click-action @select="select"/>
  </BackPanel>
</template>

<script>
import BackPanel from '@/components/layout/BackPanel.vue'
export default {
  components: { BackPanel },
  data() {
    return {
      show: false,
      list: [],
      pList: [
        {
          name: this.$t('app.bank')
        }
      ]
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      this.$http.get('otc/getPayment').then((data) => {
        this.list = data
      })
    },
    select(action) {
      this.$router.push(`/payment/add?id=${action.id}&name=${action.name}`)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
