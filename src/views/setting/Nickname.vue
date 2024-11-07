<template>
  <BackPanel :title="$t('app.editNickname')">
    <div>
      <van-notice-bar color="#1989fa" background="#ecf9ff" left-icon="info-o">
        {{$t('app.nicknameTip')}}
      </van-notice-bar>
      <van-form class="py-2 has-background-white" @submit="onSubmit">
        <p class="px-2">{{$t('app.nicknameTip2')}}</p>
        <van-field v-model.trim="form.nickName" :readonly="!!user.nickName" :placeholder="$t('app.enterNickname')"/>
        <div style="margin: 16px;">
          <van-button v-if="!user.nickName" block type="info" native-type="submit">
            {{$t('app.ok')}}
          </van-button>
        </div>
      </van-form>
    </div>
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
        nickName: null
      }
    }
  },
  computed: {
    user: get('user/info')
  },
  watch: {
    'user.nickName': {
      handler() {
        this.form.nickName = this.user.nickName
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
