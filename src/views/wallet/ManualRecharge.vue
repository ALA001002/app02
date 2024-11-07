<template>
  <BackPanel :title="coin+' '+$t('wallet.deposit')">
    <div class="section">
      <div class="has-background-white panel">
        <h5 class="title is-6">{{coin+' '+$t('wallet.depositAddress')}}</h5>
        <vue-qr v-if="address" :text="address" :size="200" class="rect"></vue-qr>
        <div v-copy class="address">{{address}}<i class="icon icon-fuzhi"/></div>
      </div>
    </div>
    <div class="section html-content" v-html="remark"/>

    <van-form @submit="onSubmit">
      <van-field
          v-model="form.formAddress"
          :label="$t('app.fromAddress')"
          :placeholder="$t('app.enterFromAddress')"
          type="text"
          :rules="[{ required: true, message: $t('app.enterFormAddress') }]"
      />
      <van-field
        v-model="form.money"
        :label="$t('app.money')"
        :placeholder="$t('app.moneyName')"
        type="number"
        :rules="[{ required: true, message: $t('app.moneyName') }]"
      />
      <div v-if="coin == 'USDT'">
      <van-field
        :label="$t('app.addressName')"
        value="TRC20-USDT"
        readonly
      />
      </div>
      <van-field :label="$t('app.CardImg')" :rules="[{ required: true, message: $t('app.CardImgpl') }]">
        <template #input>
          <van-uploader v-model="fileList" :max-count="1" :after-read="afterRead" :before-read="beforeRead"/>
        </template>
      </van-field>
      <div style="margin: 16px;">
        <van-button block type="info" native-type="submit">
          {{ $t('app.ok') }}
        </van-button>
      </div>
    </van-form>

  </BackPanel>
</template>

<script>
import BackPanel from '@/components/layout/BackPanel.vue'
import { Toast } from 'vant'
import vueQr from 'vue-qr'
export default {
  components: { BackPanel, vueQr },
  data() {
    return {
      remark: '',
      address: null,
      fileList: [],
      form: {
        money: null,
        toAddress: null,
        file: null,
        formAddress:null
      }
    }
  },
  computed: {
    coin: function() {
      return this.$route.params.coin
    }
  },
  methods: {
    afterRead(file) {
      file.status = 'success'
      this.form.file = file.file
    },
    beforeRead (file) {
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        Toast(this.$t('app.CardImgtl'))
        return false
      }
      return true
    },
    onSubmit () {
      this.form.coin = this.coin
      this.form.toAddress = this.address
      let formdata = new FormData()
      for(var key in this.form) {
        if (this.form[key]) {
          formdata.append(key, this.form[key])
        }
      }
      Toast.loading()
        this.$http.api({
          method: 'post',
          url: 'asset/recharge',
          headers:{ 'Content-type': 'multipart/form-data'},
          data: formdata
        }).then(() => {
          Toast.success(this.$t('app.czcg'))
          this.form = {
            money: null,
            toAddress: null,
            file: null,
            fileList: null,
          }
          this.$router.back()
        }).catch((err) => {
          if(err.data == null) {
            Toast.fail(window.i18n.t(`service.${err.msg}`))
          }else {
            Toast.fail(window.i18n.t(`service.${err.msg}`)+err.data)
          }

        })
    }
  },
  watch: {
    coin: {
      handler(val) {
        if (!val) return
        this.$http.get('asset/manualRechargeAddress', {currency: val}).then(data => {
          this.address = data
        })
        this.$http.get('common/getSysArticle?key=cb'+val.toLowerCase()).then(data => {
          this.remark = data.content
        })
      },
      immediate: true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
* {
  font-family:PingFangSC-Regular,PingFang SC;
}
.panel {
  text-align: center;
  padding: 30px;
  border-radius:4px;
}
.title {
  margin-top: 10px;
}
.address {
  background:rgba(55,125,255,.06);
  border-radius:4px;
  padding: 10px 15px;
  margin-top: 10px;
  word-wrap:break-word;
}
$color: rgba(55,125,255,.4);
.rect{
  padding: 2px;
  background: linear-gradient(to left,  $color,  $color) left top no-repeat,
  linear-gradient(to bottom,  $color,  $color) left top no-repeat,
  linear-gradient(to left,  $color,  $color) right top no-repeat,
  linear-gradient(to bottom,  $color,  $color) right top no-repeat,
  linear-gradient(to left,  $color,  $color) left bottom no-repeat,
  linear-gradient(to bottom,  $color,  $color) left bottom no-repeat,
  linear-gradient(to left,  $color,  $color) right bottom no-repeat,
  linear-gradient(to left,  $color,  $color) right bottom no-repeat;
  background-size: 2px 20px, 20px 2px, 2px 20px, 20px 2px;
  border-radius: 4px;
  overflow: hidden;
}
</style>
