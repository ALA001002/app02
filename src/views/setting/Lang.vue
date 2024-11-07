<template>
  <BackPanel :title="$t('app.lang')">
    <I18n />
  </BackPanel>
</template>

<script>
import BackPanel from '@/components/layout/BackPanel.vue'
import I18n from '@/components/I18n.vue'
export default {
  components: { BackPanel, I18n }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
