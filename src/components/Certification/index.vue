<template>
  <van-dialog v-model="visiable" getContainer="body" :cancel-button-text="$t('app.cancel')" :confirm-button-text="$t('extra.certificationNew')" show-cancel-button @confirm="confirm">
    <img class="certification-icon" src="@/assets/images/new/certification.svg">
    <div class="tc text-15px px-5 mb-3">{{$t('extra.certificationInfo')}}</div>
  </van-dialog>
</template>

<script>
export default {
  name: 'Certification',
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
  width: 130px;
  display: block;
  margin: 20px auto;
}
</style>