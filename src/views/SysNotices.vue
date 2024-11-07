<template>
  <Layout>
    <NavBar slot="header" back>
      <!-- <span slot="right" class="text-15px text-mid">{{$t('extra.allRead')}}</span> -->
    </NavBar>
    <div class="section py-0">
      <div class="big-title">{{$t('extra.systemNotification')}}</div>
      <div class="item mb-4" v-for="item in list" :key="item.id">
        <div class="tc text-12px text-mid mb-2">{{item.createTime}}</div>
        <div tag="div" class="card-bg  py-4 px-3 radius-big" :to="`/view?id=${item.id}&title=${item.title}`">
          <div class="flex">
            <div class="dot"></div>
            <div class="text-16px ">{{item.title}}</div>
          </div>
          <pre class="text-12px ml-3 text-mid mt-3 rich-text" v-html="item.content"></pre>
        </div>
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
        .get('common/getSysNoticeList?type=2')
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
  .dot {
    width: 8px;
    height: 8px;
    background: #fb463b;
    border-radius: 50%;
    margin-right: 6px;
  }
}
</style>
