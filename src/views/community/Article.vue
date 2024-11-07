<template>
  <van-pull-refresh v-model="isLoading" @refresh="load">
    <div style="overflow: auto; height: 100%;">
      <van-cell
        v-for="item in list"
        :key="item.id"
        :to="`/view?id=${item.id}`"
      >
        <template #title>
          <div class="van-multi-ellipsis--l2">{{ item.title }}</div>
        </template>
        <template #label>
          {{ formatTime(item.createTime) }} · {{item.source}}
        </template>
        <template #right-icon>
          <van-image width="112" height="80" radius="4" :src="item.coverImage" :error-icon="require('@/assets/images/logo2.png')"/>
        </template>
      </van-cell>
    </div>
  </van-pull-refresh>
</template>

<script>
import { formatTime } from '@/utils/helper'
export default {
  data() {
    return {
      isLoading: false,
      list: []
    }
  },
  created() {
    this.load()
  },
  methods: {
    formatTime,
    load() {
      this.$http.get('common/getSysNoticeList?type=8').then(data => {
        this.list = data
        this.isLoading = false
      }).catch(() => this.isLoading = false)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
::v-deep {
  .van-cell__title {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    margin-right: 12px;
    font-size:16px;
    font-family:PingFangSC-Medium,PingFang SC;
    font-weight:500;
    color:rgba(36,36,36,1);
    line-height:22px;
  }
  .van-image__error { background:rgba(243,247,255,1); }
  .van-icon__image {
    width: 36px;
    height: 36px;
  }
}
</style>
