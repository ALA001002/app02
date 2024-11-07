<template>
  <van-radio-group v-model="select">
    <van-cell-group v-for="lang in langs" :key="lang.id">
      <van-cell :title="lang.name" clickable @click="select = lang.id">
        <template #right-icon>
          <van-radio :name="lang.id">
          </van-radio>
        </template>
      </van-cell>
    </van-cell-group>
  </van-radio-group>
</template>

<script>
import { langs } from '@/i18n'
export default {
  data() {
    return {
      langs: langs
    }
  },
  computed: {
    select: {
      get() {
        return this.$i18n.locale
      },
      set(val) {
        this.$i18n.changeLang(val)
        this.$emit('select', val)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
