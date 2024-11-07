<template>
  <van-popup :z-index="999" v-model="showNotice" @click="showNotice=false">
    <div class="wrapper" @click.stop>
<!--      <div class="img-wrapper">-->
<!--        <img src="@/assets/images/new/rocket.svg" class="img">-->
<!--      </div>-->
      <div class="content section">
        <div class="tc text-18px line2" style="color:#333">{{ $t('extra.platformAnnouncement') }}</div>
        <div class="tc text-18px" v-if="notice">{{ notice.title }}</div>
        <pre class="text-15px my-5 px-3 line14 remark p-0"  v-if="notice" v-html="notice.content" />
        <div class="m-4">
<!--          <div class="big-btn radius mb-5">{{ $t('app.verionUpdate') }}</div>-->
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script>

export default {
  data() {
    return {
      showNotice: false,
      notice:null
    }
  },
  created() {
    this.$http.get('common/getSysNoticeList?type=1').then((data) => {
      if(data && data.length>0){
        this.notice = data[0]
        this.showNotice = true
      }
    })
  },
  watch: {
  },
  methods: {
    update() {
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.van-popup {
  background: transparent !important;
}
.wrapper {
  width: 350px;
  overflow: hidden;
  .img-wrapper {
    .img {
      width: 198px;
      display: block;
      margin: 0 auto -145px;
    }
  }
  .content {
    background: #fff;
    //padding-top: 150px;
    border-radius: 16px;
    color: #666;
  }
  .remark {
    white-space: pre-wrap;
    font-weight: bold;
    max-height: 200px;
    // word-break: break-all;
  }
}
</style>
