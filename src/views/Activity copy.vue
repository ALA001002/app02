<template>
  <Layout>
    <NavBar slot="header" back>
      <span slot="right" class="text-15px text-mid">{{$t('extra.allRead')}}</span>
    </NavBar>
    <div class="section py-0">
      <div class="big-title">{{$t('extra.latestEvents')}}</div>
      <div class="item mb-4" v-for="item in list" :key="item.id">
        <div class="tc text-12px text-mid mb-2">{{item.createTime}}</div>
        <router-link tag="div" :to="`/view?id=${item.id}&title=${item.title}`">
          <img class="img" src="https:dummyimage.com/400x300/f90" alt="img">
          <div class="text-15px flex item-title">{{item.title}}</div>
        </router-link>
      </div>
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
        .get('common/getSysNoticeList?type=7')
        .then(data => {
          this.list = data
        })
        .finally(() => (this.loading = false))
    },
  },
}
</script>

<style scoped lang="scss">
.item {
  border-radius: 16px;
  position: relative;
  .img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 16px;
    display: block;
  }
  .item-title {
    background: rgba(0, 0, 0, 0.6);
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    line-height: 1.5;
    padding: 8px 16px;
    font-size: 15px;
    &::before {
      content: '';
      display: block;
      width: 8px;
      height: 8px;
      background: #fb463b;
      border-radius: 50%;
      margin-right: 6px;
    }
  }
}
</style>
