<template>
  <div @click="select" class="flex">
    <span class="has-text-left  text-16px">{{ from }}<small class="text-shallow text-12px">/{{ to }}</small></span>
    <van-skeleton title-width="100%" title :loading="!price && price != 0">
      <span class="flex1 tr text-20px">{{ numFilter(price) }}</span>
    </van-skeleton>
    <van-skeleton title-width="100%" title :loading="!change && change != 0">
      <span class="has-text-right">
        <TextFormat class="is-pulled-right" :float="change" :text="change" isFormat isBlock />
      </span>
    </van-skeleton>
  </div>
</template>

<script>
import TextFormat from '@/components/TextFormat.vue'
export default {
  props: {
    from: String,
    to: String,
    price: String,
    change: Number,
  },
  components: { TextFormat },
  methods: {
    select() {
      this.$emit('select')
    },
    numFilter(value) {
      var tempVal
      if (value > 1) {
        tempVal = parseFloat(value).toFixed(7)
      } else {
        tempVal = parseFloat(value).toFixed(10)
      }
      var realVal = tempVal.substring(0, tempVal.length - 1)
      realVal = realVal.replace(/(\d+)\.(\d+?)0+$/g,'$1.$2')
      return realVal
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep .van-skeleton__title {
  height: 20px;
}
</style>
