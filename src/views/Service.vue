<template>
  <BackPanel :title="$t('app.contactService')">
    <Message style="height: 100%" />
  </BackPanel>
</template>

<script>
import BackPanel from '@/components/layout/BackPanel.vue'
import Message from '@/components/imessage/Index.vue'
export default {
  components: { BackPanel, Message },
  data() {
    return {
      mail: 'lx199066@gmail.com'
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
