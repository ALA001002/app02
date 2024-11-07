<template>
  <van-list class="scroll-more" v-model="loading" :finished="finished" :error.sync="error" :error-text="$t('extra.failClickMore')" :finished-text="list.length && !once?$t('extra.noMore'):''" @load="onLoad">
    <slot name="header"></slot>
    <van-empty v-if="finished && !list.length" :image="nodataImg" image-size="100px" :description="$t('extra.noData')" />
    <slot :list="list"></slot>
  </van-list>
</template>

<script>
import nodataImg from '@/assets/images/new/empety.svg'
export default {
  name: 'scroll-more',
  props: {
    api: {
      type: String,
      default: '',
    },
    method: {
      type: String,
      default: 'get',
    },
    params: {
      type: Object,
      default: () => {},
    },
    once: Boolean,
    paramsLoad: {
      type: Boolean,
      default: true,
    },
    size: {
      type: Number,
      default: 20,
    },
  },
  data() {
    return {
      nodataImg,
      loading: false,
      error: false,
      finished: false,
      list: [],
      page: 0,
    }
  },
  watch: {
    params: {
      handler() {
        if (this.paramsLoad) {
          this.reLoad()
        }
      },
      deep: true,
    },
  },
  methods: {
    getData() {
      this.$http[this.method](this.api, {
        ...this.params,
        pageNo: this.page,
        pageSize: this.size,
      })
        .then(res => {
          const list = res.length !== undefined ? res : res.content
          this.loading = false
          this.list = this.list.concat(list)
          this.finished = list.length < this.size
        })
        .catch(() => (this.error = true))
    },
    onLoad() {
      this.page++
      if (this.once && this.page >= 2) {
        this.finished = true
        return
      }
      this.api && this.getData()
    },
    reLoad(toLoad = false) {
      this.list = []
      this.finished = true
      this.page = 0
      this.$nextTick(() => {
        this.finished = false
      })
      toLoad && this.onLoad()
      // this.api && this.getData()
    },
  },
}
</script>

<style scoped lang="scss">
.scroll-more {
  height: 100%;
  max-height: 100vh;
  overflow-y: auto;
}
</style>