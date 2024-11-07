<template>
  <div class="is-flex has-text-centered has-text-weight-semibold" style="justify-content: space-between;">
    <BoxItem v-for="data in list" :key="data ? data.id : null" :data="data" class="my-0 mt-2" />
  </div>
</template>

<script>
import BoxItem from './ContractBoxItem.vue'
export default {
  props: {
    list: Array,
  },
  components: { BoxItem },
}
</script>
