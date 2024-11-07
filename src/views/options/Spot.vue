<template>
  <div>
    <div class="content">
      <div class="header">
<!--        <img src="@/assets/images/exchange/exchange.png" style="height: 33px;margin-right: 10px"/>-->
<!--        <span class="text">{{ code }}</span>-->
<!--        <TextFormat :float="+(data && data.change)" class="text-12px ml-1" :text="+(data && data.change)" isFormat />-->
        <div class="symbol-list">
          <van-icon name="fanhui" class-prefix="icon" class="has-text-grey-dark mr-2" @click="$router.back()" />
          <img src="@/assets/images/exchange/exchange.png" @click="emitChange" style="height: 33px;margin-right: 10px"/>
          <span>{{data && data.symbolName}}</span>
          <!--      {{JSON.stringify(data)}}-->
          <TextFormat :float="+data.change" class="text-12px ml-1" :text="+data.change" isFormat />
        </div>
      </div>
      <div class="body">
        <div class="left">
          <div class="price-item">
            <span>{{ $t('exchange.volPrice') }}</span>
            <span style="margin-left: 10px">{{ $t('exchange.volume') }}</span>
          </div>
          <template v-for="(item,index) in priceOutVolumes">
            <div v-bind:key="'pricein-'+index" class="price-item" >
              <!--              @click="()=>changePrice(item.price)"-->
              <span class="price">{{ item.price }}</span>
              <span class="volume">{{ item.pendOrderVolume }}</span>
            </div>
          </template>
          <!--          <div class="center">-->
          <!--            <div>{{ centerValue }}</div>-->
          <!--            <div class="rate-value">≈{{ centerValue * rate }}</div>-->
          <!--          </div>-->
          <template v-for="(item,index) in priceInVolumes">
            <div v-bind:key="'price-'+index" class="price-item">
              <!--               @click="()=>changePrice(item.price)"-->
              <span class="price bottom">{{ item.price }}</span>
              <span class="volume">{{ item.pendOrderVolume }}</span>
            </div>
          </template>
        </div>
        <div class="right">
          <div class="tabs">
            <span @click="()=>buyIndex=0" :class="{active:buyIndex==0}">{{ $t('exchange.buy') }}</span>
            <span @click="()=>buyIndex=1" :class="{active:buyIndex==1,sell:buyIndex==1}">{{ $t('exchange.sent') }}</span>
          </div>
          <!--          <div class="type item">{{$t('exchange.bidPrice')}}</div>-->
          <div class="price item">
            <div class="market-type" style="height: 30px;line-height: 30px;" @click="showSelect=true">
             <div class="select-type" style="position:relative;">
               <div @click="showTypeList=!showTypeList">{{typeList[typeIndex].text}}
               <img src="@/assets/images/spot/down.png"
                style="position: absolute;right: 10px;width: 24px;"
               />
               </div>
               <ul class="type-option" :style="{
                 display: showTypeList?'block':'none',margin:'0',padding:'0',
               background:'rgb(16, 15, 21)',
                   zIndex: 100,
                    position: 'absolute',
                    width: '100%'
                }">
                 <li @click="chooseType(index)" v-bind:key="item.value+'_type'" v-for="(item,index) in typeList">{{ item.text}}</li>
               </ul>
             </div>
<!--              <select style="background: none;color: white;border: none;" v-model="orderType">-->
<!--                <option :value="0">{{$t('exchange.marketType')}}</option>-->
<!--                <option :value="1">{{$t('exchange.limitType')}}</option>-->
<!--              </select>-->
            </div>
          </div>
          <div class="price item" v-if="typeIndex==0">
            <div class="tab-change">
              <span @click="marketDealType=1;buyNum=null" :class="`${marketDealType==1?'active':''}`">{{$t('spot.turnover')}}</span>
              <span @click="marketDealType=0;buyNum=null" :class="`${marketDealType==0?'active':''}`">{{$t('spot.num')}}</span>
            </div>
          </div>
          <div class="price item" v-if="typeIndex==1">
            <van-field v-model="buyPrice">
              <template slot="left-icon">
                <img @click="subPrice" class="change-icon" src="@/assets/images/exchange/sub.png"/>
              </template>
              <template slot="right-icon">
                <img @click="addPrice" class="change-icon" src="@/assets/images/exchange/add.png"/>
              </template>
            </van-field>
          </div>
          <div class="num item">
            <van-field type="number" v-model="buyNum"  @input="(e)=>{changeBuyNum(e)}" :placeholder="getPlaceHolder()">
              <template slot="left-icon">
                <img @click="sub" class="change-icon" src="@/assets/images/exchange/sub.png"/>
              </template>
              <template slot="right-icon">
                <img @click="add" class="change-icon" src="@/assets/images/exchange/add.png"/>
              </template>
            </van-field>
          </div>
          <div class="percents">
            <template v-for="(item,index) in buyPercents">
              <div @click="()=>{
                changePercentIndex(index)
              }" class="buy-percent-item" v-bind:key="'buy-percent-'+index">
                <span class="block-color"></span>
                <span :class="{active:percentIndex===index}">{{ item }}%</span>
              </div>
            </template>
          </div>
          <div class="amount item" v-if="typeIndex==1">
            <van-field v-model="buyValue" @blur="(e)=>{changeBuyValue(e)}">
            </van-field>
          </div>
          <div class="account-value item">
            <span>{{ $t('exchange.canUse') }}</span>
            <span>{{ usdtBalance }} {{ buyIndex==1?this.coin:'USDT' }}</span>
          </div>
          <div @click="buy" :class="{btn:true,item:true,sent:buyIndex==1}">
            {{ buyIndex==0?$t('exchange.buy'):$t('exchange.sent') }} {{ coin }}
          </div>
        </div>
      </div>
      <div class="order-tabs">
        <div class="tabs-info">
          <span class="active">
            {{ $t('exchange.currentOrders') }}
          </span>
          <!--          <span>-->
          <!--            {{ $t('exchange.assets') }}-->
          <!--            <span class="border"></span>-->
          <!--          </span>-->

          <span class="border" @click="$router.push('/options/spotOrder')">
            {{$t('exchange.orders')}}
          </span>
        </div>
        <div class="tabs-info-content">
          <div style="text-align: center;margin-top: 20px;" v-if="!orders || orders.length===0">{{$t('exchange.noData')}}</div>
          <div style="width: 100%;display: flex;flex-direction: column;">
            <template v-for="(item,index) in orders">
              <RunningOrder @updateOrder="updateOrder()" :item="item" v-bind:key="index+'_item'"/>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {call, get} from 'vuex-pathify'
import {Toast} from 'vant'
import TextFormat from '@/components/TextFormat.vue'
import {parseNumber6,parseNumber4} from '@/utils/number'
import RunningOrder from '@/components/orderItem/RunningOrder.vue'
export default {
  props: {
    code: {
      type: String
    }
  },
  computed:{
    user: get('user/info'),
    wallet: get('user/wallet'),
    updateWallet: 'user/wallet',
    hq: get('hq/hq'),
    list: function () {
      return this.hq || []
      // .filter(p => !!p.supTimeContract)
    },
    data: function () {
      return this.list.find(p => p.symbolCode == this.code?.toLowerCase())
    }
  },
  components:{TextFormat,RunningOrder},
  data() {
    return {
      dataCode:null,
      marketDealType:1,
      targetCache:null,
      typeList:[{
        text:this.$t('exchange.marketType'),
        value:'MARKET'
      },{
        text:this.$t('exchange.limitType'),
        value:'LIMIT'
      }],
      typeValue:{
        value:0,
        text:this.$t('exchange.marketType')
      },
      showTypeList:false,
      showSelect:true,
      orderType:0,
      orders:[],
      typeIndex:0,
      newOrders:[],
      buyPrice:0,
      buyNum:null,
      buyValue: 0,
      usdtBalance:0,
      buyIndex:0,
      percentIndex:-1,
      value: 0.6,
      rate: 1.2,
      hqInfo:null,
      times:[],
      coin:'BTC',
      centerValue: 12111.2,
      buyPercents: [25, 50, 75, 100],
      priceOutVolumes: [
        {
          price: 0,
          pendOrderVolume: 0,
        }
      ],
      priceInVolumes: [
        {
          price: 0,
          pendOrderVolume: 0,
        }
      ]
    }
  },
  mounted() {
    this.code = this.$route.params.code.toUpperCase()
    this.coin = this.code.replace('USDT','').replace('usdt','')
    // this.buyPrice = this.priceOutVolumes[0].price
    this.initData()
    this.query()
    this.queryDeep()
    this.updateData()
    // console.log(this.wallet)
  },
  watch:{
    typeIndex(){
      this.buyPrice=parseNumber6(this.hqInfo.price)
      console.log(`---${this.buyPrice}----`)
    },
    code(){
      this.coin = this.code.toUpperCase().replace('USDT','').replace('usdt','')
      this.query()
    },
    buyPrice(){
      this.buyValue = this.buyPrice * this.buyNum
    },
    data(){
      this.dataCode = this.data.symbolCode
    },
    dataCode(){
      this.buyPrice = parseNumber6(this.data.price)
      this.buyNum=0
      this.percentIndex = -1
    },
    wallet(){
      for(const key in this.wallet){
        const item = this.wallet[key]
        const type = this.buyIndex===1?this.coin:'USDT'
        if(item.currency===type){
          this.usdtBalance = parseNumber6(item.balance)
          break
        }
      }
      // console.log(this.wallet)
    },
    usdtBalance(){
      this.changePercentIndex(this.percentIndex)
    },
    // code(){
    //   this.coin = this.code?.replace('USDT','').replace('usdt','')
    // },
    buyIndex(){
      this.buyNum = 0
      for(const key in this.wallet){
        const item = this.wallet[key]
        const type = this.buyIndex===1?this.coin:'USDT'
        if(item.currency===type){
          this.usdtBalance = parseNumber6(item.balance)
          break
        }
      }
      this.buyValue = 0
      this.buyNum = 0
    }
  },
  methods:{
    getPlaceHolder(){
      if(this.typeIndex==0){
        if(this.marketDealType==0){
          // return this.$t('spot.mask')
          return this.data.baseCoin
        }else{
          // return this.$t('spot.usdt')
          return this.data.quoteCoin
        }
      }
      return ''
    },
    changeBuyNum(){
      let temp = (this.buyNum+'')
      const temps = temp.split('.')
      if(temps.length>1){
        const dl = temps[1].length
        if(dl>6){
          temp=parseNumber6(temp)
          this.buyNum = temp
          this.buyValue = parseNumber6(this.buyPrice * temp)
          return
        }
      }
      this.buyValue = parseNumber6(this.buyPrice * temp)
    },
    changeBuyValue(){
      this.buyNum = parseNumber6(this.buyValue/this.buyPrice)
    },
    chooseType(index){
      this.typeIndex = index
      this.showTypeList = false
    },
    onConfirm(value, index) {
      this.orderType = index
    },
    parseNumber6,
    parseNumber4,
    ...call({
      updateHq: 'hq/update'}),
    initData(){
      for(const key in this.wallet){
        const item = this.wallet[key]
        const type = this.buyIndex===1?this.coin:'USDT'
        if(item.currency===type){
          this.usdtBalance = parseNumber6(item.balance)
          break
        }
      }
    },
    emitChange(){
      this.$emit('showBar')
    },
    updateData() {
      const self = this
      this.$http.create_api
          .get('common/hqInfo')
          .then(data => {
            data = data.data
            // this.updateWallet(data.accountInfo)
            // console.log(data)
            self.hqInfo = data.contractInfo.filter(t=>t.symbolCode==this.code.toLowerCase())[0]
            self.updateHq(data.contractInfo)
            // this.updateProfit(data.yesterdayProfit)
            setTimeout(() => this.updateData(), 3000)
          })
          .catch(() => {
            setTimeout(() => this.updateData(), 2000)
          })
    },
    updateAccountInfo() {
      this.$http.create_api
          .get('common/accountInfo')
          .then(data => {
            data = data.data
            this.updateWallet(data.accountInfo)
            // this.updateHq(data.contractInfo)
            // this.updateProfit(data.yesterdayProfit)
            setTimeout(() => this.updateAccountInfo(), 5000)
          })
          .catch(() => {
            setTimeout(() => this.updateAccountInfo(), 50000)
          })
    },
    changePrice(price){
      this.buyPrice = price
    },
    changePercentIndex(index){
      if(index<0){
        return
      }
      this.percentIndex = index
      if(!this.buyPrice){
        this.buyPrice=parseNumber6(this.hqInfo.price)
      }
      if(!this.buyPrice){
        return
      }
      if(this.buyIndex==1) {
        if(this.marketDealType==0) {
          this.buyNum = parseNumber6((this.usdtBalance * this.buyPercents[this.percentIndex] / 100))
        }else{
          this.buyNum = parseNumber6((this.usdtBalance*this.buyPrice * this.buyPercents[this.percentIndex] / 100))
        }
      }else {
        console.log('usdtBalance='+this.usdtBalance+'this.buyPercents='+this.buyPercents[this.percentIndex]+'buyPrice='+this.buyPrice)
        if(this.marketDealType==0) {
          this.buyNum = parseNumber6((this.usdtBalance * this.buyPercents[this.percentIndex] / this.buyPrice / 100.0))
        }else{
          this.buyNum = parseNumber6((this.usdtBalance * this.buyPercents[this.percentIndex]/100))
        }
      }
    },
    updateOrder(){
      this.query()
    },
    cancelOrder(orderId){
      this.$http.create_api.post('/ico/revoke',{orderIds:[orderId]}).then(
          ()=>{
            Toast.success()
            self.updateAccountInfo()
          }
      )
    },
    add(){
      if(!this.buyPrice){
        this.buyPrice=parseNumber6(this.hqInfo.price)
      }
      if(this.typeIndex==0){
        if(this.marketDealType==0){
          if((+this.buyNum+1)*this.buyPrice>this.usdtBalance){
            return
          }
        }else{
          if((this.buyNum+1)>this.usdtBalance){
            return
          }
        }
      }else{
        if((+this.buyNum+1)*this.buyPrice>this.usdtBalance){
          return
        }
      }
      this.buyNum = +this.buyNum+1
      this.changeBuyNum()
    },
    subPrice(){
      this.buyPrice = +this.buyPrice-1

    },
    addPrice(){
      if(this.typeIndex==1){
        if((+this.buyNum)*(this.buyPrice+1)>this.usdtBalance){
          return
        }
      }
      this.buyPrice = +this.buyPrice+1
    },
    sub(){
      this.buyNum = +this.buyNum-1
      if(this.buyNum<0){
        this.buyNum = 0
      }
      this.changeBuyNum()
    },

    queryDeep(){
      const self = this
      clearTimeout(this.timer)
      this.timer = setTimeout(()=>{
        self.$http.api.get(`/common/deepInfo/${this.$route.params.code.toLowerCase()}`).then(({data}) => {
          data.asksList.length=5
          data.bidsList.length=5
          self.priceOutVolumes = data.asksList
          self.priceInVolumes = data.bidsList
          // if(self.typeIndex!==1) {
          //   self.buyPrice = self.priceOutVolumes[0].price
          // }
        })
        self.queryDeep()
      },1000)

    },
    query(){
      const self = this
      this.$http.post('/ico/newOrders',{currency:this.coin,status:'NEW'}).then((data)=>{
        // console.log(data)
        self.orders = data
      })
    },
    buy(){
      const self = this
      const side = this.buyIndex===1?'SELL':'BUY'
      const orderType = this.typeIndex==0?'MARKET':'LIMIT'

      // price:this.buyPrice,
      //     quoteOrderQty:this.orderType==1?this.buyPrice:null,
      //     quantity:this.buyNum,
      const params = {
        // from:'USDT',
        // to:this.coin,
        symbol:this.code,
        side,
        orderType
      }
      if(this.typeIndex===1){
        params.price = this.buyPrice
        params.quantity = this.buyNum
      }else{
        if(this.marketDealType==0){
          params.quantity = this.buyNum
        }else{
          params.quoteOrderQty = this.buyNum
        }
      }
      // const url = this.orderType==0?'/ico/place':'/ico/buy'
      this.$http.post('/ico/place',params).then(()=>{
        Toast.success()
        self.query()
        self.updateAccountInfo()
      })
      this.buyValue = 0
      this.buyNum = 0
    }
  }
}
</script>
<style>

input::-webkit-input-placeholder{
  color:rgba(255,255,255,0.2)!important;
}
* { touch-action: pan-y; }
</style>
<style lang="scss">
.tab-change{
  display: flex;
  flex-direction: row;
  padding: 5px 0;
  span{
    flex: 1;
    color: rgba(255,255,255,0.2);
    &.active{
      color: white;
    }
  }
}
.change-icon{
  width: 20px;
}
.van-field__right-icon{
  line-height: 1;
}
.van-field__left-icon{
  line-height: 2;
  margin-top: 5px;
}
.content {
  box-sizing: border-box;
  background: var(--main-bg-color);

  .header {
    padding: 10px;
    box-sizing: border-box;
    border-radius: 10px;

    .text {
      font-size: 22px;
      font-weight: bold;
    }

    .percent-value {
      color: var(--main-text-color);
      margin-left: 10px;
    }
  }
  .van-cell{
    padding: 0;
    text-align: center;
    input{
      text-align: center;
    }
  }
  .body {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: var(--main-body-bg-color);
    padding: 20px;
    box-sizing: border-box;
    border-radius: 10px;

    .left {
      flex: 4;
      display: flex;
      overflow: hidden;
      justify-content: space-between;
      justify-items: left;
      flex-direction: column;

      .center {
        color: var(--main-text-color);
        text-align: center;
        font-size: 18px;

        .rate-value {
          color: var(--main-text-low-color);
        }
      }

      .price-item {
        display: flex;
        justify-content: space-between;
        span{
          word-break: break-all;
          white-space: normal;
        }
        .price {
          color: #AE475C;

          &.bottom {
            color: green;
          }
        }

        .volume {
          color: white;
        }
      }
    }

    .right {
      flex: 5;
      overflow: hidden;
      margin-left: 10px;

      .tabs {
        display: flex;
        flex-direction: row;
        justify-items: center;
        justify-content: center;
        background: var(--main-bg-color-white);
        color: var(--main-text-low-color-white);
        border-radius: 5px;
        overflow: hidden;
        span {
          padding: 0 5px;
          box-sizing: border-box;
          flex: 1;
          text-align: center;
          word-break: break-all;
          white-space: normal;
          &.active {
            color: var(--main-body-bg-color-white);
            background: var(--main-text-color-white);
            &.sell{
              background: red;
            }
          }
        }
      }

      .type {
      }

      .percents {
        display: flex;
        flex-display: row;
        justify-items: center;
        color: var(--main-text-desc-color);

        span {
          flex: 1;
          text-align: center;
        }

        &.item {
          background: var(--main-body-bg-color);
        }
      }

      .item {
        margin-top: 10px;
        align-items: center;
        justify-items: center;
        background: var(--main-bg-color);
        text-align: center;
        padding: 0 5px;
        color: white;
        border-radius: 0.21333rem;
        background-color: #1D1C21;
      }

      .account-value {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }

      .amount {
        height: 40px;
        line-height: 40px;
      }

      .btn {
        background: var(--main-btn-bg-color-white);
        color: var(--main-btn-text-color-white);
        border-radius: 5px;
        height: 50px;
        line-height: 50px;
        &.sent{
          background: rgba(255, 0, 0);
        }
      }
    }
  }

  .order-item{
    display: flex;
    flex-direction: row;
    justify-content: center;
    justify-items: center;
    align-items: center;
    color:var(--main-text-color);
    padding: 0 5px;
    &:first-child{
      border-bottom: 1px solid #ddd;
      margin: 10px 0;
    }
    &.sell{
      color:red;
    }
    span{
      overflow: hidden;
      flex:1;
      text-align: center;
      word-break: break-all;
      white-space: normal;
      &:not(:last-child){
        margin-right:10px;
      }
    }
  }
  .order-tabs {
    background: var(--main-body-bg-color);

    .tabs-info {
      padding: 20px;
      border: 1px solid #ddd;

      span {
        font-size: 18px;
        margin-right: 30px;
        color: var(--main-text-low-color);
        position: relative;

        &.active {
          color: var(--main-text-deep-color);

          .border {
            position: absolute;
            display: inline-block;
            width: 50px;
            height: 5px;
            bottom: -20px;
            left: 50%;
            margin-left: -25px;
            background: var(--main-border-color);
          }

          //:after{
          //  content: '';
          //  border-bottom: 2px solid var(--main-border-color);
          //}
        }
      }
    }
  }
  .percents {
    display: flex;
    flex-direction: row;
    justify-content: center;
    justify-items: center;
    margin-top: 10px;
    .buy-percent-item {
      flex: 1;
      text-align: center;
      span {
        &.block-color{
          background: var(--main-btn-bg-color-white);
          height: 5px;
          display: block;
        }
        &.active{
          color: #ffc800;
        }
      }
      &:not(:last-child) {
        margin-right: 10px;
      }
    }
  }
}
</style>
