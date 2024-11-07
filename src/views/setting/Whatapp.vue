<template>
  <BackPanel>
    <div class="py-4 has-background-white">
      <h4 class="section title mb-1">
        <span>{{ $t('app.bindWhatapp') }}</span>
      </h4>
      <van-form :show-error="false" @submit="onSubmit">
        <van-field
            v-model="form.whatapp"
            :placeholder="$t('login.enterWhatApp')"
            clearable
            :rules="[{ required: true, message: $t('login.enterWhatApp') }]"
        />

        <div style="margin: 16px;">
          <van-button block type="info" native-type="submit">
            {{ $t('login.sub') }}
          </van-button>
        </div>
      </van-form>
    </div>
  </BackPanel>
</template>

<script>
import BackPanel from '@/components/layout/BackPanel.vue'
import { Toast } from 'vant'
import { get } from 'vuex-pathify'
export default {
  components: { BackPanel },
  data() {
    return {
      form: {
        whatapp: null
      }
    }
  },
  computed: {
    user: get('user/info')
  },
  mounted() {
    this.form.whatapp = this.user.whatapp
  },
  methods: {
    onSubmit() {
      this.$http.post('user/bindWhatapp', this.form).then(() => {
        Toast.success(this.$t('login.forgetSuccess'))
        this.$router.back()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  margin-top: 60px;
}
.title {
  font-size: 25px;
  font-weight: 500;
  margin-top: 0;
}
.small {
  color: #999999;
  font-size: 75%;
}
</style>
