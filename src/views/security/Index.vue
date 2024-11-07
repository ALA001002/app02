<template>
  <Layout>
    <NavBar slot="header" back></NavBar>
    <div class="section py-0">
      <div class="big-title">{{$t('app.security')}}</div>
      <router-link class="card-bg flex-between p-3 mb-24" to="/security/password">
        <img class="box40" src="@/assets/images/new/safe_reset.svg">
        <div class="flex1 ml-2 text-15px">{{$t('app.loginPassword')}}</div>
        <van-icon name="arrow" color="#888" size="16"></van-icon>
      </router-link>
      <router-link class="card-bg flex-between p-3" to="/security/payPassword">
        <img class="box40" src="@/assets/images/new/safe_code.svg">
        <div class="flex1 ml-2 text-15px">{{$t('app.payPassword')}}</div>
        <div class="flex">
          <span class="text-mid mr-2">{{user.payPwdStatus==0?$t('app.noSetPayPassword'):''}}</span>
          <van-icon name="arrow" color="#888" size="16"></van-icon>
        </div>
      </router-link>
    </div>
  </Layout>
</template>

<script>
import { get } from 'vuex-pathify'
export default {
  computed: {
    user: get('user/info'),
  },
}
</script>

<style scoped lang="scss">
</style>
