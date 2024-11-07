<template>
  <BackPanel :title="$t('app.station')">
    <van-cell
      v-for="item in list"
      :key="item.id"
      :title="item.title"
      :to="`/view?id=${item.id}&title=${item.title}&content=${item.content}`"
    is-link/>
    <!--      :label="parseTime(item.createTime, '{y}-{m}-{d}')"-->
  </BackPanel>

</template>

<script>
import BackPanel from '@/components/layout/BackPanel.vue'
import { parseTime } from '@/utils/helper'
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
  updated() {
    this.$http.api.get('/letter/markRead')
  },
  methods: {
    parseTime,
    load() {
      this.$http.get('/letter/all').then(data => {
        this.list = data
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
