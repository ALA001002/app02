<template>
  <Layout>
    <NavBar slot="header" back></NavBar>
    <div class="section py-0">
      <div class="big-title">{{$t('extra.msgCenter')}}</div>
      <router-link class="card-bg flex-between mb-5 px-3 py-4" v-for="item in list" :key="item.title" :to="item.to">
        <img class="box48 mr-4 my-1" :src="item.img">
        <div class="flex1">
          <div class="text-15px  flex-between">
            {{item.title}}
            <div class="text-11px  text-shallow">{{item.time}}</div>
          </div>
          <div class="text-12px  text-shallow mt-1">{{item.subtitle}}</div>
        </div>
      </router-link>
    </div>
  </Layout>

</template>

<script>
import { parseTime } from '@/utils/helper'
import img1 from '@/assets/images/new/message_system.svg'
import img2 from '@/assets/images/new/message_news.svg'
import img3 from '@/assets/images/new/message_plat.svg'

export default {
  data() {
    return {
      list: [
        {
          title: this.$t('extra.systemNotification'),
          to: '/SysNotices',
          subtitle: '',
          time: '',
          img: img1,
        },
        {
          title: this.$t('extra.latestEvents'),
          to: '/Activity',
          subtitle: '',
          time: '',
          img: img2,
        },
        {
          title: this.$t('extra.platformAnnouncement'),
          to: '/Announcement',
          subtitle: '',
          time: '',
          img: img3,
        },
      ],
      loading: true,
    }
  },
  created() {
    // 系统通知
    this.$http.get('common/getSysNoticeList?type=2').then(data => {
      this.list[0].subtitle = data[0]?.title
      this.list[0].time = data[0]?.createTime
    })
    // 最新活动
    this.$http.get('common/getSysNoticeList?type=12').then(data => {
      this.list[1].subtitle = data[0]?.title
      this.list[1].time = data[0]?.createTime
    })
    // 平台公告
    this.$http.get('common/getSysNoticeList?type=1').then(data => {
      this.list[2].subtitle = data[0]?.title
      this.list[2].time = data[0]?.createTime
    })
  },
  methods: {
    parseTime,
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
