<template>
  <Layout>
    <NavBar slot="header" back></NavBar>
    <div class="section py-0">
      <div class="big-title">{{$t('extra.systemNotification')}}</div>
      <router-link v-for="item in list" :key="item.id" class="card-bg flex-between mb-5 px-3 py-4" :to="`/view?id=${item.id}&title=${item.title}`">
        <div class="text-15px flex1 my-1">{{item.title}}</div>
        <van-icon name="arrow" color="#ADACB0"></van-icon>
      </router-link>
      <noData v-if="!loading&&!list.length"></noData>
    </div>
  </Layout>

</template>

<script>
import { parseTime } from '@/utils/helper'
export default {
  data() {
    return {
      list: [],
      loading: true,
    }
  },
  created() {
    this.load()
  },
  methods: {
    parseTime,
    load() {
      this.loading = true
      this.$http
        .get('common/getSysNoticeList?type=2')
        .then(data => {
          this.list = data
        })
        .finally(() => (this.loading = false))
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
