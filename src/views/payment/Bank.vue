<template>
  <BackPanel>
    <div class="py-4 has-background-white">
      <h4 class="section title mb-1">
        <span>{{ title }}</span>
      </h4>
      <van-form :show-error="false" @submit="onSubmit">
        <van-field
          v-model="form.legalCurrency"
          :label="$t('app.pCurrency')"
          :rules="[{ required: true, message: $t('app.required') }]"
          clearable
          readonly
          @click="showCurrencyList=(pId==null)"
        />
        <van-field
          v-model="form.payee"
          :label="$t('app.pPayee')"
          :rules="[{ required: true, message: $t('app.required') }]"
          clearable
        />
        <van-field
          v-model="form.bankName"
          :label="$t('app.pBankName')"
          :rules="[{ required: true, message: $t('app.required') }]"
          clearable
        />
        <van-field
          v-model="form.bankAccount"
          :label="$t('app.pBankAccount')"
          :rules="[{ required: true, message: $t('app.required') }]"
          clearable
        />
        <van-field
          v-model="form.bankBranch"
          :label="$t('app.pBankBranch')"
          :rules="[{ required: true, message: $t('app.required') }]"
          clearable
        />
        <div style="margin: 16px;">
          <van-button block type="info" native-type="submit">
            {{ $t(pId?'app.update':'app.add') }}
          </van-button>
        </div>
      </van-form>
      
      <van-popup v-model="showCurrencyList" position="bottom">
        <van-picker
          show-toolbar
          :columns="currencyList"
          @confirm="selectCurrency"
          @cancel="showCurrencyList = false"
        />
      </van-popup>
    </div>
  </BackPanel>
</template>

<script>
import BackPanel from '@/components/layout/BackPanel.vue'
import { Toast, Dialog } from 'vant'
export default {
  components: { BackPanel },
  data() {
    return {
      showCurrencyList: false,
      currencyList: [],
      form: {
        legalCurrency: null,
        payee: null,
        bankName: null,
        bankAccount: null
      }
    }
  },
  created() {
    this.load()
  },
  computed: {
    title() {
      return this.$route.query.name
    },
    pId() {
      // 支付方式Id
      return this.$route.params.pId == 'add' ? null : this.$route.params.pId
    }
  },
  watch: {
    pId: {
      handler(val) {
        if (val) {
          this.$http.get('otc/getPayment?id='+val).then(data => {
            this.form = data
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    load() {
      this.$http.get('common/getLegalList').then(data => {
        this.currencyList = data.map(p => p.legalCurrency)
      })
    },
    selectCurrency(value) {
      this.form.legalCurrency = value
      this.showCurrencyList = false
    },
    onSubmit() {
      Dialog.confirm({ title: this.$t(this.pId?'app.confirmUpdate':'app.confirmAdd') }).then(() => {
        var url = this.pId ? 'otc/modifyPayment' : 'otc/addPayment'
        this.$http.post(url, this.form).then(() => {
          Toast.success()
          this.$router.back()
        })
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