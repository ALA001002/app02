<template>
  <van-pull-refresh v-model="isLoading" @refresh="load">
    <van-steps direction="vertical" style="overflow: auto; height: 100%;">
      <van-step v-for="item in list" :key="item.id">
        <!-- 图标 -->
        <template #active-icon>
          <div class="circle"></div>
        </template>
        <template #inactive-icon>
          <div class="circle"></div>
        </template>
        <!-- 内容 -->
        <div class="line-title">{{item.title}}</div>
        <div class="line-content html-content" v-html="item.content"/>
        <div class="line-label">
          {{ formatTime(item.createTime) }} · {{item.source}}
        </div>
      </van-step>
    </van-steps>
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
      this.$http.get('common/getSysNoticeList?type=9').then(data => {
        this.list = data
        this.isLoading = false
      }).catch(() => this.isLoading = false)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.line-title {
  font-size:16px;
  font-family:PingFangSC-Medium,PingFang SC;
  font-weight:500;
  color:rgba(36,36,36,1);
  line-height:22px;
}
.line-content {
  margin: 10px auto;
  font-size:12px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(36,36,36,1);
  line-height:17px;
  word-wrap: break-word;
}
.line-label {
  font-size:10px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(170,170,170,1);
  line-height:14px;
}
.circle {
  width:12px;
  height:12px;
  background:rgba(55,125,255,1);
  border:2px solid rgba(196,217,255);
  border-radius: 50%;
}
</style>
