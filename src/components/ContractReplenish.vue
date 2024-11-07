<template>
  <div class="setting">
  <!-- 设置 -->
    <div class="section">
      <p class="is-size-6 has-text-white py-4"> {{$t('order.doReplenish')}} </p>
      <div class="is-flex-center" style="background:rgba(0,0,0,.2);order-radius:10px; padding: 10px 15px">
        <span class="tag " :class="form.tradeType == '1' ? 'is-primary' : 'is-danger'">
          {{form.tradeType == '1' ? $t('exchange.long') : $t('exchange.short')}}
        </span>
        <span class="is-size-6 ml-2">{{form.contractMultiple}}X</span>
        <div class="is-grow has-text-centered">
          <p>{{form.amount || form.money}}</p>
          <small>{{$t('exchange.margin')}}</small>
        </div>
        <div class="has-text-right">
          <p>{{form.replenish}}</p>
          <small>{{$t('order.replenish')}}</small>
        </div>
      </div>
    </div>
    <van-field v-model="replenish" type="number" class="is-border py-1"/>
    <div style="padding: 16px">
      <van-button block type="info" @click="sub">
        {{$t('app.ok')}}
      </van-button>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    form: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      replenish: null
    }
  },
  methods: {
    load() {
      this.replenish = null
    },
    sub() {
      if (this.replenish <= 0) {
        Toast.fail(this.$t('order.numberError'))
        return
      }
      this.$emit('sub', { replenish: this.replenish })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
::v-deep .is-border >* {
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-width: 1px;
  line-height: 36px;
}
.setting {
  background-color: #1A2D50;
  font-size: 16px;
  p { margin: 7px 0; }
  small { color: rgba(255, 255, 255, 0.5); }
  .tag {
    border-radius:2px;
  }
  ::v-deep {
    .van-field__label{color:white} 
    .van-field::after{border-bottom: 0}
    .van-field {
      background-color: transparent;
    }
    input {padding: 0 15px; color:white}
  }
}
</style>
