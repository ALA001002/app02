<template>
  <Layout>
    <NavBar slot="header" back>
      {{$t('app.auth')}}
    </NavBar>
    <van-form @submit="onSubmit">
      <van-field
        v-model="form.realName"
        :label="$t('app.name')"
        :placeholder="$t('app.enterName')"
        :rules="[{ required: true, message: $t('app.enterName') }]"
      />
      <van-field
        v-if="form.authType==1"
        v-model="form.idNum"
        :label="$t('app.idNum1')"
        :placeholder="$t('app.enterIdNum1')"
        :rules="[{ required: true, message: $t('app.enterIdNum1') }]"
      />
      <van-field
        v-if="form.authType==2"
        v-model="form.passport"
        :label="$t('app.idNum2')"
        :placeholder="$t('app.enterIdNum2')"
        :rules="[{ required: true, message: $t('app.enterIdNum2') }]"
      />
      <van-field
        v-if="form.authType==3"
        v-model="form.driverLicense"
        :label="$t('app.driver_license')"
        :placeholder="$t('app.driver_license')"
        :rules="[{ required: true, message: $t('app.driver_license') }]"
      />
      <van-field name="radio" :label="$t('app.auth_type')">
        <template #input>
          <van-radio-group v-model="form.authType" direction="horizontal">
            <van-radio name="1">{{$t('app.idCard')}}</van-radio>
            <van-radio name="2">{{$t('app.passport')}}</van-radio>
            <van-radio name="3">{{$t('app.driver_license')}}</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field :disabled="disable" :label="$t('app.idCardImg'+type)">
        <template #input>
          <van-uploader v-model="files" :disabled="disable" multiple :max-count="3" :before-read="beforeRead"/>
        </template>
      </van-field>

      <van-field :label="$t('app.idCardStatus')">
        <template #input>
          {{$t('app.idCardStatus'+(user.authStatus||0))}}
        </template>
      </van-field>

      <div style="margin: 16px;">
        <van-button :disabled="disable" block type="info" native-type="submit">
          {{ $t('app.ok') }}
        </van-button>
      </div>
    </van-form>
    <div class="section html-content" v-html="remark"/>
  </Layout>
</template>

<script>
import BackPanel from '@/components/layout/BackPanel.vue'
import { Dialog, Toast } from 'vant'
import { get } from 'vuex-pathify'
import lrz from 'lrz'
export default {
  components: { BackPanel },
  data() {
    return {
      fileList: [],
      remark: null,
      type: '2',
      files: [],
      form: {
        realName: null,
        authType: 1,
        idNum: null,
        passport: null,
        driverLicense: null,
      }
    }
  },
  created() {
    this.$http.get('common/getSysArticle?key=sfrz').then(data => {
      this.remark = data.content
    })
  },
  computed: {
    user: get('user/info'),
    disable() {
      return this.user.authStatus=='1' || this.user.authStatus == '2'
    }
  },
  watch: {
    'user': {
      handler(val) {
        this.type = val.authType
        this.form.realName = val.realName
        this.form.idNum = val.idNum
        this.form.passport = val.passport
        if (val.authPhotos && this.user.authStatus != '3') {
          this.files = val.authPhotos.split(';').map(p => ({url: p}))
        }
      },
      immediate: true
    }
  },
  methods: {
    onSubmit() {
      Dialog.confirm({ title: this.$t('app.confirmOk') }).then(async() => {
        let formdata = new FormData()
        for(var key in this.form) {
          if (this.form[key]) {
            formdata.append(key, this.form[key])
          }
        }
        let maxSize = 3 * 1024 * 1024
        for (var file of this.files) {
            // 尝试压缩
          try {
            let rst = await lrz( file.file, { width: 1080, height: 1080, quality: 1 })
            if (rst.file.size > maxSize) {
              throw 'file size: ' + rst.file.size
            }
            formdata.append('files', rst.file, file.file.name)
          } catch(err) {
            Toast(this.$t('app.idCardImgTip'))
            // console.log(err)
            return
          }
        }

        Toast.loading()
        this.$http.api({
          method: 'post',
          url: 'user/uploadAuth',
          headers:{ 'Content-type': 'multipart/form-data'},
          data: formdata
        }).then(() => {
          Toast.success()
          this.$router.back()
        }).catch((err) => {
          console.log(err.msg)
          // Toast.fail(this.$t(err.msg))
          Toast.fail(window.i18n.t(`service.${err.msg}`))
        })
      })
    },
    beforeRead (files) {
      if (!(files instanceof Array)) {
        files = [files]
      }
      files.forEach(file => {
        if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
          Toast(this.$t('app.idCardImgTip'))
          return false
        }
      })
      return true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
