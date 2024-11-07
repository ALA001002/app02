<template>
  <router-link tag="div" class="box py-3 has-text-dark  has-text-weight-bold card-bg" :to="data?'/options/'+data.symbolCode:''">
    <small>{{ data.symbolName }}
      <TextFormat :float="data.change" :text="data.change" isFormat />
    </small>
    <p class=" m-0 mt-2" style="line-height: 1rem">
      <van-skeleton title-width="100%" title :loading="!data.price && data.price != 0">
        <TextFormat :float="data.change" class="text-20px" :text="numFilter(data.price)" />
      </van-skeleton>
    </p>
  </router-link>
</template>

<script>
import TextFormat from '@/components/TextFormat.vue'
export default {
  props: {
    data: Object,
  },
  components: { TextFormat },
  methods: {
    numFilter(value) {
      var tempVal
      if (value > 1) {
        tempVal = parseFloat(value).toFixed(3)
      } else {
        tempVal = parseFloat(value).toFixed(5)
      }
      let realVal = tempVal.substring(0, tempVal.length - 1)
      return realVal
    },
  },
}
</script>
<style lang="scss" scoped>
.box {
  width: 110px;
  small {
    font-size: 14px;
  }
  p {
    font-size: 24px;
  }
  ::v-deep .van-skeleton__row:not(:first-child) {
    margin: 0.34rem auto auto auto;
  }
}
</style>
