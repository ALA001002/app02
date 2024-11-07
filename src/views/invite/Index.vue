<template>
  <div class="hero is-full has-background-white">
    <HeadSafeArea />
    <van-nav-bar left-arrow @click-left="$router.back()">
      <template #title>
        <van-tabs v-model="component" color="#377DFF">
          <van-tab name="profit" :title="$t('invite.myProfit')" />
          <van-tab name="inviter" :title="$t('invite.myInvite')" />
        </van-tabs>
      </template>
    </van-nav-bar>
    <component :is="component" class="is-grow" style="overflow:auto" />
  </div>
</template>

<script>
import HeadSafeArea from '@/components/HeadSafeArea'
import inviter from '@/components/invite/Inviter.vue'
import profit from '@/components/invite/Profit.vue'
export default {
  components: { HeadSafeArea, inviter, profit },
  data() {
    return {
      component: 'profit',
    }
  },
  computed: {
    goto: function () {
      return this.$route.params.goto
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
