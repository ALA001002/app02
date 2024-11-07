<template>
  <van-image ref="img" :src="csrc" v-bind="$props" @load="onLoad" @click="onClick">
    <template v-if="bak" v-slot:loading><i :class="bak" /></template>
    <template v-if="bak" v-slot:error><i :class="bak" /></template>
  </van-image>
</template>

<script>
export default {
  props: ['src', 'height', 'width', 'round', 'fit', 'bak'],
  data() {
    return {
      cacheKey: null,
      hasCache: false,
      csrc: null,
    }
  },
  mounted() {
    this.init(this.src)
  },
  watch: {
    src(src) {
      this.init(src)
    },
  },
  methods: {
    onLoad(event) {
      // 将图片内容缓存
      if (!this.hasCache) {
        this.hasCache = true
        this.cache()
      }
      this.$emit('load', event)
    },
    init(src) {
      if (!src) return
      this.cacheKey = 'i_' + this.getHash(src)
      // 是否有缓存
      var img = this.getCache(this.cacheKey)
      this.hasCache = img != null
      this.csrc = this.hasCache ? img : src
    },
    getHash(str) {
      var hash = 1315423911,
        i,
        ch
      for (i = str.length - 1; i >= 0; i--) {
        ch = str.charCodeAt(i)
        hash ^= (hash << 5) + ch + (hash >> 2)
      }
      return hash & 0x7fffffff
    },
    cache() {
      this.$http.api.get(this.src, { responseType: 'blob' }).then(data => {
        let reader = new FileReader()
        reader.onload = e => {
          if (window.plus) {
            plus.storage.setItem(this.cacheKey, e.target.result)
          } else {
            localStorage[this.cacheKey] = e.target.result
          }
        }
        reader.readAsDataURL(data.data)
      })
    },
    getCache(key) {
      if (window.plus) {
        return plus.storage.getItem(key)
      }
      return localStorage[key]
    },
    onClick() {
      this.$emit('click')
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
