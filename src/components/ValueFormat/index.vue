<template>
  <span class="value-format" :class="{big:value>=0}">
    <template v-if="plusOrMinus">{{value>=0?'+':'-'}}</template>{{prefix}}
    {{Math.abs(value )}}
    {{suffix}}
  </span>
</template>

<script>
export default {
  name: 'value-format',
  props: {
    prefix: String,
    suffix: String,
    plusOrMinus: Boolean,
    value: {
      type: [String, Number],
      default: 0,
    },
  },
}
</script>

<style scoped lang="scss">
.value-format {
  color: var(--text-danger);
  &.big {
    color: #29ad5e;
  }
}
</style>