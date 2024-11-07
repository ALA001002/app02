<template>
  <div class="running-order">
    <div class="order-item-col" style="margin-top: 10px">
      <div class="col">
        <span v-if="item.side=='BUY'" class="order-type-buy">
          {{item.orderType=='MARKET'?$t('spot.marketTitle'):$t('spot.limitTitle')}}/{{$t('exchange.buy')}}
        </span>
        <span v-else class="order-type-sell">
          {{item.orderType=='MARKET'?$t('spot.marketTitle'):$t('spot.limitTitle')}}/{{$t('exchange.sent')}}
        </span>
        <van-circle style="margin-top: 5px;font-size: 10px" size="40px"
                    :rate="item.executedQty/item.origQty"
                    :speed="50" :text="item.executedQty/item.origQty*100+'%'"/>
      </div>
      <div class="col content">
        <span>{{item.baseCoin}}/{{item.quoteCoin}}</span>
        <div class="num flex line">
          <span class="order-title">{{$t('exchange.orderNum')}}</span>
          <span class="value">
              <span class="execute">{{item.executedQty}}</span><span class="total">/{{item.origQty}}</span>
            </span>
        </div>
        <div class="num flex line">
          <span class="order-title">{{$t('spot.price')}}</span>
          <span class="value">
              <span class="execute">{{item.executedPrice}}</span><span class="total">/{{item.orderType=='MARKET'?$t('exchange.marketType'):item.price}}</span>
            </span>
        </div>
      </div>
      <div class="col">
        <span style="color: var(--text-mid)">{{item.createTime.split(' ')[0]}}</span>
        <span @click="()=>cancelOrder(item.orderId)" style="padding: 5px 10px;background: #726e6e;font-size: 10px;margin-top: 10px;color: white;">
              {{$t('exchange.reminders')}}
            </span>
      </div>
    </div>
  </div>
</template>
<script>
import {Toast} from 'vant'

export default {
  props:{
    item: {
      type: Object
    }
  },
  methods:{
    cancelOrder(orderId){
      const self = this
      this.$http.create_api.post('/ico/revoke',{orderIds:[orderId]}).then(
          ()=>{
            Toast.success()
            self.$emit('updateOrder')
          }
      )
    },
  }
}
</script>
<style lang="scss">
.van-circle__text{
  font-size: 10px;
}
.order-item-col{
  display: flex;
  flex-direction: row;
  width: 100%;
  padding-bottom: 5px;
  border-bottom: 1px solid rgba(221, 221, 221, 0.24);
  .col{
    margin-right: 10px;
    flex: 1.5;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-bottom: none;
    &.content{
      flex: 2;
      .line{
        width: 100%;
      }
      margin-bottom: 0px;
    }
    .order-type-buy{
      color: green;
    }
    .order-type-sell{
      color: red;
    }
    .flex{
      display: flex;
      justify-content: space-between;
    }
  }
  .num {
    font-size: 12px;

    .order-title {
      color: var(--text-mid);
    }

    .value {
      .total {
        color: var(--text-mid);
      }

      .execute {
        color: var(--text-deep);
      }
    }
  }
}
</style>
