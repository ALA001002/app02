<template>
  <van-dialog v-model="visiable" getContainer="body" :confirm-button-text="$t('app.ok')" @confirm="confirm">
    <img class="certification-icon" src="@/assets/images/new/success.svg">
    <div class="tc text-15px px-5 my-5">{{text}}</div>
  </van-dialog>
</template>

<script>
import i18n from '@/i18n'
export default {
  name: 'Certification',
  props: {
    text: {
      type: String,
      default: i18n.t('extra.predictSuccess'),
    },
  },
  data() {
    return {
      visiable: false,
    }
  },
  methods: {
    show() {
      this.visiable = true
    },
    confirm() {
      this.$emit('confirm')
    },
  },
}
</script>

<style scoped lang="scss">
.certification-icon {
  width: 52px;
  display: block;
  margin: 40px auto 0;
}
</style>