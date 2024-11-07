<template>
  <div>
    <van-cell
      v-for="item in list"
      :key="item.id"
      :title="item.title"
      :to="`/view?id=${item.id}&title=${item.title}`"
      is-link
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: []
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
