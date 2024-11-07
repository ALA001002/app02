<template>
  <Layout>
    <NavBar slot="header" back></NavBar>
    <div class="section py-0">
      <div class="big-title">{{$t('app.help')}}</div>
      <router-link v-for="item in list" :key="item.id" class="card-bg flex-between mb-5 px-3 py-4" :to="`/view?id=${item.id}&title=${item.title}`">
        <div class="text-15px flex1 my-1">{{item.title}}</div>
        <van-icon name="arrow" color="#ADACB0"></van-icon>
      </router-link>
    </div>
  </Layout>
</template>

<script>
export default {
  data() {
    return {
      list: [],
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      this.$http.get('common/getSysNoticeList?type=7').then(data => {
        this.list = data
      })
    },
  },
}
</script>

<style scoped lang="scss">
</style>
