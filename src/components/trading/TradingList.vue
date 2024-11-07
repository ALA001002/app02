<template>
  <div class="has-text-weight-semibold">
    <div class="item py-1 has-text-weight-light text-shallow text-13px">
      <span class="has-text-left">{{ $t("exchange.name") }}</span>
      <span class="has-text-centered">{{ $t("exchange.price") }}</span>
      <span class="has-text-right">{{ $t("exchange.change") }}</span>
    </div>
    <Item v-for="data in list" :key="data ? data.id : null" :from="data.from" :to="data.to" :price="data.price" :change="data.change" class="py-2 item" @select="select(data)" />
  </div>
</template>

<script>
import Item from './TradingItem.vue'
export default {
  props: {
    list: Array,
  },
  components: { Item },
  methods: {
    select(data) {
      this.$emit('select', data)
    },
  },
}
</script>
<style lang="scss" scoped>
.has-text-weight-semibold {
  font-family: PingFangSC-Semibold, PingFang SC;
}
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  ::v-deep > * {
    flex-grow: 1;
    flex-basis: 0%;
  }
  // & + & {
  //   border-top: 1px solid hsl(0, 0%, 96%);
  // }
}
</style>
