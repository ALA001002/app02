<template>
  <BackPanel :title="$t('app.myInviter')">
    <van-notice-bar color="#1989fa" background="#ecf9ff" left-icon="info-o">
      {{$t('app.myInviterTip')}}
    </van-notice-bar>
    
    <van-form class="py-2 has-background-white" @submit="onSubmit">
      <van-field v-if="!!user.parentUid" v-model.trim="user.parentName" :label="$t('app.myInviter')" readonly/>
      <van-field v-model.trim="form.invitationCode" :readonly="!!user.parentName" :label="$t('app.myInviterCode')" :placeholder="$t('app.myInviterCode')"/>
      <div style="margin: 16px;">
        <van-button v-if="!user.parentUid" block type="info" native-type="submit">
          {{$t('app.ok')}}
        </van-button>
      </div>
    </van-form>
  </BackPanel>
</template>

<script>
import BackPanel from '@/components/layout/BackPanel.vue'
import { get } from 'vuex-pathify'
import { Toast, Dialog } from 'vant'
import { call } from 'vuex-pathify'
export default {
  components: { BackPanel },
  data() {
    return {
      form: {
        invitationCode: null
      }
    }
  },
  computed: {
    user: get('user/info')
  },
  watch: {
    'user.parentUid': {
      handler() {
        this.form.invitationCode = this.user.parentUid
      },
      immediate: true
    }
  },
  methods: {
    ...call({
      updateInfo: 'user/info'
    }),
    onSubmit() {
      Dialog.confirm({ title: this.$t('app.confirmOk') }).then(() => {
        this.$http.post('user/modifyPersonalInfo', this.form).then(() => {
          Toast.success()
          this.updateInfo()
          this.$router.back()
        })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
