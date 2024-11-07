<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view class="view" />
    </transition>
    <Version />
    <Notice />
    <Not />
    <Log v-if="false"></Log>
  </div>
</template>

<script>
import { call } from 'vuex-pathify'
import Version from '@/components/Version.vue'
import Notice from '@/components/Notice.vue'
import Log from '@/views/log/Index.vue'
export default {
  name: 'App',
  components: { Version, Log, Notice},
  data() {
    return {
      transitionName: '',
    }
  },
  created() {
    this.load()
  },
  watch: {
    //使用watch 监听$router的变化
    $route(to, from) {
      //如果to索引大于from索引,判断为前进状态,反之则为后退状态
      if (to.meta.index > from.meta.index) {
        //设置动画名称
        this.transitionName = 'slide-left'
      } else if (to.meta.index < from.meta.index) {
        this.transitionName = 'slide-right'
      } else {
        this.transitionName = ''
      }
    },
  },
  computed: {},
  methods: {
    ...call({
      updateHq: 'hq/update',
      updateInfo: 'user/info',
      // loadConfig: 'checkConfig',
      // openStatus: 'openStatus',
      updateWallet: 'user/wallet',
      // updateProfit: 'user/profit',
    }),
    load() {
      this.updateInfo()
      this.updateData()
      this.updateAccountInfo()
      // this.loadConfig()
      // this.openStatus()
    },
    updateData() {
      this.$http.create_api
        .get('common/hqInfo')
        .then(data => {
          data = data.data
          // this.updateWallet(data.accountInfo)
          this.updateHq(data.contractInfo)
          // this.updateProfit(data.yesterdayProfit)
          setTimeout(() => this.updateData(), 3000)
        })
        .catch(() => {
          setTimeout(() => this.updateData(), 2000)
        })
    },
    updateAccountInfo() {
      this.$http.create_api
        .get('common/accountInfo')
        .then(data => {
          data = data.data
          this.updateWallet(data.accountInfo)
          // this.updateHq(data.contractInfo)
          // this.updateProfit(data.yesterdayProfit)
          setTimeout(() => this.updateAccountInfo(), 5000)
        })
        .catch(() => {
          setTimeout(() => this.updateAccountInfo(), 50000)
        })
    },
  },
}
</script>

<style lang="scss">
.view {
  width: 100%;
  position: absolute;
  overflow: hidden;
  background: var(--bg-color);
  color: #fff;
}
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 460ms;
  position: absolute;
}
.slide-right-enter {
  opacity: 1;
  transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active {
  opacity: 1;
  transform: translate3d(100%, 0, 0);
}
.slide-left-enter {
  opacity: 1;
  transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active {
  opacity: 1;
  transform: translate3d(-40%, 0, 0);
}
.van-slider__bar {
  background-color: rgba(0, 0, 0, 0) !important;
}
</style>
