<template>
  <van-popup :z-index="999" v-model="showNewVersion" @click="showNewVersion=false">
    <div class="wrapper" @click.stop>
      <div class="img-wrapper">
        <img src="@/assets/images/new/rocket.svg" class="img">
      </div>
      <div class="content section">
        <div class="tc text-18px line2" style="color:#333">{{ $t('app.verionNew') }}</div>
        <div class="tc text-18px">v{{ newVersion.version }}</div>
        <pre class="text-15px my-5 px-3 line14 remark p-0" v-html="newVersion.remark" />
        <div class="m-4">
          <div class="big-btn radius mb-5" @click="update">{{ $t('app.verionUpdate') }}</div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { get } from 'vuex-pathify'
import { download } from '@/utils/version'
import { loadVersion } from '@/utils/version'

export default {
  data() {
    return {
      showNewVersion: false,
    }
  },
  created() {
    loadVersion()
  },
  computed: {
    version: get('version'),
    newVersion: get('newVersion'),
  },
  watch: {
    newVersion(val) {
      if (
        val.version > this.version &&
        process.env.NODE_ENV !== 'development'
      ) {
        this.showNewVersion = true
      }
    },
  },
  methods: {
    update() {
      download(true)
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
    padding-top: 150px;
    border-radius: 16px;
    color: #666;
  }
  .remark {
    white-space: pre-wrap;
    font-weight: bold;
    // word-break: break-all;
  }
}
</style>
