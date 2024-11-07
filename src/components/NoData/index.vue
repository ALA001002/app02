<template>
  <div class="no-data">
    <img class="icon" src="@/assets/images/new/empety.svg">
    <div class="text">
      <slot>{{$t('extra.noData')}}</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'no-data',
  props: {
    msg: String,
  },
}
</script>

<style scoped lang="scss">
.no-data {
  text-align: center;
  margin-top: 8vh;
  .icon {
    width: 100px;
    height: 100px;
    vertical-align: top;
  }
  .text {
    color: #626262;
    font-size: 16px;
    margin-top: 6px;
  }
}
</style>