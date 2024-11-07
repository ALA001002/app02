<template>
  <div class="content-view">

<!--    <div class="headers ">-->
<!--      <div class="tabs">-->
<!--        <span @click="()=>changeTab(0)" :class="activeIndex==0?'active':''">{{ $t("timecontract.line") }}</span>-->
<!--        <span @click="()=>changeTab(1)" :class="activeIndex==1?'active':''">{{ $t("timecontract.exchange") }}</span>-->
<!--      </div>-->
<!--    </div>-->
    <div class="symbol-list">
      <van-icon name="fanhui" class-prefix="icon" class="has-text-grey-dark mr-2" @click="$router.back()" />
      <img src="@/assets/images/contract/menu.png"/>
      <span>{{data.symbolName}}</span>
<!--      {{JSON.stringify(data)}}-->
      <TextFormat :float="+data.change" class="text-12px ml-1" :text="+data.change" isFormat />
    </div>
    <div class="flex-data">
      <div class="flex flex-left">
        <div class="tabs">
            <span @click="()=>changeOpenIndex('1')" :class="tradeType==='1'?'active':''">{{
                $t("exchange.long")
              }}</span>
          <span @click="()=>changeOpenIndex('2')" :class="tradeType==='2'?'active':''">{{
              $t("exchange.short")
            }}</span>
        </div>
        <div class="account-data">USDT{{ $t("timecontract.account") }}</div>
        <div class="full-handling">{{ $t("timecontract.full-handling-fee") }}：{{ (times[profitIndex]||{}).feeRate||0 }}%</div>
        <div class="accept-profit-container">
          <div class="accept-profit">
            <div v-for="(item,key) in times" v-bind:key="key"
                 :class="(profitIndex===key?'data-item active':'data-item')+(tradeType==='1'?' green':' red')"
                 @click="()=>changeProfitIndex(key)">
              <span class="period">{{ item.period }}s</span>
              <span class="profit">{{ $t("timecontract.profit") }}{{ item.yieldRate }}%</span>
            </div>
          </div>
        </div>
        <div class="flex-between-data">
<!--          <span>{{ $t("exchange.margin") }}</span>-->
          <span class="text-10px">{{ $t("wallet.balance") }} {{ account.balance }} {{ account.currency }}</span>
        </div>
        <div class="input-value">
          <input :placeholder="$t('timecontract.pleaseInput')" v-model="amount"/>
          <span class="total-btn" @click="changeTotal">{{ $t("extra.all") }}</span>
        </div>
        <div class="estimatedTransactionPrice">{{ $t("exchange.predictPrice") }}：{{ predictPrice }}</div>
        <van-button :class="tradeType==='1'?'action-btn more':'action-btn empty'" @click="()=>{showConfirmDialog()}" :disabled="disableBtn">
          {{ tradeType==='1'?$t("exchange.long"):$t("exchange.short")}}
        </van-button>
      </div>
      <div class="flex flex-right">
        <div class="item-list">
          <span>
            <p>{{ $t("price") }}</p>
            <p>(USDT)</p>
          </span>
          <span>
            <p>{{ $t("amount") }}</p>
            <p>(BIT)</p>
          </span>
        </div>
        <ul class="data-item-price">
          <li class="flex" v-for="(item,index) in deepData.asksList" v-bind:key="'list1-'+index">
            <span class="red">{{ item.price }}</span>
            <span>{{ item.pendOrderVolume }}</span>
          </li>
        </ul>
        <div style="height: 2rem;"></div>
        <ul class="data-item-price">
          <li class="flex" v-for="(item,index) in deepData.bidsList" v-bind:key="'list2-'+index">
            <span class="green">{{ item.price }}</span>
            <span>{{ item.pendOrderVolume }}</span>
          </li>
        </ul>
<!--        <div class="action-list-select">-->
<!--          <div>0.0001-->
<!--            <img src="@/assets/images/contract/arrow.png"/></div>-->
<!--          <div><img class="icon-img" src="@/assets/images/contract/line.png"/><img-->
<!--              src="@/assets/images/contract/arrow.png"/></div>-->
<!--        </div>-->
      </div>
    </div>
    <div class="historys flex">
      <div class="tabs">
          <span @click="()=>changeHistoryIndex(0)" :class="historyIndex==0?'active':''">{{
              $t("timecontract.current")
            }}</span>
        <span @click="()=>changeHistoryIndex(1)" :class="historyIndex==1?'active':''">{{
            $t("timecontract.history")
          }}</span>
      </div>
      <span :class="activeIndex===0?'more':'empty'"  @click="()=>{$router.push('/timecontract/order')}">{{$t("timecontract.more")}}</span>
    </div>
    <div class="order-list-item">
      <OrderItem v-for="item in list" :key="item.id" :data="item" :base="sup" :shareLink="shareLink" />
    </div>

    <van-dialog v-model="showConfirm" getContainer="body" :title="$t('exchange.confirmBuy')" show-cancel-button @confirm="buyContract">
      <div class="confirmPanel">
        <div>
          <span>{{$t('exchange.tradeType')}}</span>{{form.tradeType==='1'?$t('exchange.long'):$t('exchange.short')}}</div>
        <div><span>{{$t('exchange.period')}}</span> {{form.period}}s</div>
        <div><span>{{$t('exchange.yield')}}</span> {{form.yieldRate}}%</div>
        <div><span>{{$t('exchange.margin')}}</span> {{form.amount}}</div>
        <div><span>{{$t('order.fee')}}</span> {{form.fee}}</div>
        <div><span>{{$t('exchange.minMoney')}}</span> {{form.minMoney}}</div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
// import QrScan from '@/components/QrScan.vue'
import OrderItem from '@/components/timecontract/OrderItem.vue'
import {get} from 'vuex-pathify'
import TextFormat from '@/components/TextFormat.vue'
import {Toast} from 'vant'
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  components: {TextFormat,OrderItem},
  computed: {
    wallet: get('user/wallet'),
    accounts() {
      return this.wallet.map(p => {
        p.name = p.currency + ' ' + (p.virtual === 1 ? this.$t('exchange.imitate') : this.$t('exchange.account'))
        return p
      })
    },
    account() {
      if (this.accounts.length > 0) {
        return this.accounts[this.accountIndex]
      }
      return {}
    },
    predictPrice() {
      if (!this.data.slipPoint) return
      const ds = this.data.slipPoint.split('%')
      const val = this.form.tradeType == '1' ? Number(ds[0]) : - Number(ds[0])
      return this.toNumber(ds.length > 1 ? this.data.price * ((100 + val)/100) : this.data.price + val)
    },
    hqList: get('hq/hq'),
    hqData: function() {
      const res =  this.hqList.find(p => p.symbolCode == this.data.symbol)
      if(!res){
        return {price:0}
      }
      return res
    },
    list() {
      return this.historys.filter(p => {
        if (this.historyIndex == '0') {
          return p.status == 0
        }
        return p.status != 0
      })
    }
  },
  data() {
    return {
      disableBtn:false,
      showConfirm:false,
      shareLink: null,
      sup: this,
      deepData:{asksList:[],bidsList:[]},
      amount: '',
      accountIndex: 0,
      profitIndex: 0,
      price: 44481.3,
      historys: [{
        date: '04-14 14:44',
        orderNo: 'TC20220424984938488480001',
        symbol: 'BTC/USDT',
        period: 180,
        price: -100,
        fee: -100,
        openPrice: -100,
        principal: -100,
        percent: -100
      }],
      dataPercent: '+1.875',
      activeIndex: 1,
      tradeType: '1',
      historyIndex: 0,
      fee: 0,
      profits: [
        {
          period: 180,
          profit: 20
        },
        {
          period: 360,
          profit: 30
        },
        {
          period: 720,
          profit: 40
        },
        {
          period: 1440,
          profit: 50
        }
      ],
      list1: [
        {
          price: 11,
          amount: 12,
          deep: 12,
        }, {
          price: 11,
          amount: 12,
          deep: 12,
        }, {
          price: 11,
          amount: 12,
          deep: 12,
        }, {
          price: 11,
          amount: 12,
          deep: 12,
        }, {
          price: 11,
          amount: 12,
          deep: 12,
        }],
      list2: [
        {
          price: 11,
          amount: 12,
          deep: 12,
        }, {
          price: 11,
          amount: 12,
          deep: 12,
        }, {
          price: 11,
          amount: 12,
          deep: 12,
        }, {
          price: 11,
          amount: 12,
          deep: 12,
        }, {
          price: 11,
          amount: 12,
          deep: 12,
        }],
      form:{currency:'USDT',amount:null,fee:null,period:null,tradeType:null,minMoney:100,yieldRate:null,symbolCode:null},
      times:[]
    }
  },
  watch: {
    'data.symbolCode': {
      handler(val) {
        if(!val){
          return
        }
        this.times = []
        this.form.period = null
        this.$http.get('timeContract/getTimeContractPeriod?symbolCode=' + val).then(data => {
          this.times = data
          if (this.times.length > 0) {
            this.form.period = this.times[0].period
            this.form.yieldRate = this.times[0].yieldRate
            this.form.minMoney = this.times[0].minMoney
            this.form.fee = ((this.times.find(p => p.period === this.form.period) || {}).feeRate * 100)
          }
        })
      },
      immediate: true
    },
    amount(val){
      if(!val || val<this.form.minMoney){
        this.disableBtn = true
      }else{
        this.disableBtn = false
      }
    },
    mul(val) {
      if (val) {
        this.form.amount = this.toNumber(this.account.balance * val, 8)
      }
    },
    account(val) {
      this.form.currency = val.currency
    },
    form: {
      handler(val) {
        this.$emit('change', val)
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.queryDeep()
    this.queryHistorys()
  },
  methods: {
    confirm(){},
    queryDeep(){
      const self = this
      setTimeout(()=> {
        this.$http.api.get(`/common/deepInfo/${this.data.symbolCode}`).then(({data}) => {
          self.deepData = data
        })
        self.queryDeep()
      },5000)
    },
    queryHistorys(){
      const self = this
      this.$http.get('/timeContract/listContract?contractType=0&trustType=0').then((res)=>{
        // console.log(res)
        self.historys = res
      })
    },
    changeTotal(){
      this.amount = this.account.balance
    },
    showConfirmDialog(){
      this.form.tradeType = this.tradeType
      const data  = this.times[this.profitIndex]
      this.form = {...this.form,...data,amount:+this.amount,symbolCode: this.data.symbolCode}
      this.showConfirm = true
    },
    buyContract(){
      this.$http.post('timeContract/buyContract', this.form,true).then(() => {
        Toast.success()
        this.queryHistorys()
        this.$refs.form.load()
      })/*.catch((err) => {
        // console.log(err)
        if(err.data == null) {
          Toast.fail(window.i18n.t(`service.${err.msg}`))
        } else {
          Toast.fail(window.i18n.t(`service.${err.msg}`)+err.data)
        }
      })*/
    },
    load() {
      this.form.amount = null
      this.form.mul = null
    },
    changeTab(index) {
      this.activeIndex = index
    },
    changeOpenIndex(index) {
      this.tradeType = index
    },
    changeProfitIndex(index) {
      this.profitIndex = index
    },
    changeHistoryIndex(index) {
      this.historyIndex = index
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.order-list-item {
  margin-top: 0.8125rem;

  .order-item {
    background-color: #1D1C21;
    color: #D2D2D5;
    padding: 0.5rem;

    .body-header {
      margin-top: 0.625rem;
      display: flex;
      justify-content: space-between;

      .symbol-icon {
        margin-left: 4px;
      }
    }

    .header {
      display: flex;
      justify-content: space-between;
      padding: 0.5625rem 0;
      font-size: 0.6875rem;
      border-bottom: 1px solid #3E3D41;

      .time {
        color: #626262;
      }

      img {
        height: 1rem;
      }
    }

    .urealize {
      margin-top: 0.625rem;
    }

    .content-info {
      display: flex;
      flex-direction: row;
      justify-content: left;

      div {
        flex: 1;
        margin-top: 0.5rem;

        &.item-title {
          color: #D2D2D5;
          font-size: 0.675rem;
        }

        &.item-price {
          font-size: 1rem;
          color: white;
        }
      }
    }
  }
}

.historys {
  margin-top: 2.3125rem;
  justify-content: space-between;

  .tabs {
    width: 12.5rem;
    font-size: 0.9375rem;
  }

  .more {
    color: #F5A600;
    font-size: 0.8125rem;
  }
}

.action-list-select {
  display: flex;
  flex-direction: row;
  margin-top: 0.5rem;

  > div {
    height: 1.75rem;
    line-height: 1.75rem;
    background-color: #1D1C21;
    border-radius: 4px;
    box-sizing: border-box;
    padding: 0 5px;

    &:last-child {
      margin-left: 0.875rem;
    }

    img:last-child {
      vertical-align: middle;
      width: 0.6875rem;
      height: 0.6875rem;
      margin-left: 0.2rem;
    }

    .icon-img {
      height: 0.71875rem;
      vertical-align: middle;
    }
  }
}

.flex-right {
  .data-info-per {
    display: flex;
    flex-direction: column;
    color: #87868B;
    font-size: 10px;
    text-align: right;
  }

  margin-left: 0.4rem;

  .item-list {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 12px;
    color: #87868B;

    p {
      padding: 0;
      margin: 0;
    }
  }

  .data-item-price {
    font-size: 0.75rem;

    li {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      height: 1.25rem;
      line-height: 1.25rem;

      .green {
        color: green;
      }

      .red {
        color: red;
      }
    }

  }
}

.action-btn {
  background-color: #28AB5D;
  color: white;
  font-size: 1.065rem;
  height: 2.5rem;
  line-height: 2.5rem;
  text-align: center;
  border-radius: 4px;
  width: 100%;

  &.empty {
    background-color: #FB4C53;
  }
}

.estimatedTransactionPrice {
  font-size: 0.75rem;
  color: #B2B1B6;
  text-align: right;
  margin: 12px 0 13px 0;
}

.symbol-list {
  margin-top: 1.28rem;
  font-size: 1.0625rem;
  display: table;

  img {
    vertical-align: super;
    height: 0.46875rem;
    margin-right: 8px;
  }

  .percent-data {
    color: #2BAD5F;
    margin-left: 4px;
  }
}
.accept-profit-container {
  height: 8rem;
  overflow-y: auto;
  .accept-profit {
    display: flex;
    flex-wrap: wrap;

    .data-item {
      &.active {
        &.green {
          background-color: #28AD5E;
        }

        &.red {
          background-color: #FB4C53;
        }
      }

      color: white;
      width: 5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-content: center;
      background-color: #1D1C21;
      padding: 0.5rem 0;
      border-radius: 4px;

      &:nth-child(2n) {
        margin-left: 0.625rem;
      }

      &:nth-child(n+3) {
        margin-top: 0.625rem;
      }

      span {
        text-align: center;
      }

      .period {
        font-size: 1.065rem;
      }

      &.active {
        background-color: #FB4C53;
      }
    }
  }
}

.headers {
  margin-top: 2.5rem;
}

.content-view {
  box-sizing: border-box;
  padding: 0 4.5%;
}

.full-handling {
  margin: 6px 0 10px 0;
}

.flex-between-data {
  margin: 10px 0 4px 0;
  display: flex;
  justify-content: space-between;

  :first-child {
    color: #DBD9DF;
    font-size: 0.875rem;
  }

  :nth-child(2) {
    color: #B2B1B6;
    font-size: 0.75rem;
  }
}

.input-value {
  height: 3rem;
  line-height: 3rem;
  display: flex;
  justify-content: space-between;
  align-content: space-around;
  background-color: #1D1C21;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 0 10px;

  .total-btn {
    color: #F5A600;
    font-size: 1rem;
    width: 3rem;
  }
}

.tabs {
  background-color: #1D1C21;
  color: #87868B;
  font-size: 0.90625rem;
  height: 1.8125rem;
  display: flex;
  flex-direction: row;
  width: 100%;
  line-height: 1.8125rem;
  border-radius: 4px;

  span {
    overflow: hidden;
    flex: 1;
    text-overflow: ellipsis;
    text-align: center;
  }

  span.active {
    background-color: #44424D;
    color: #DBD9DF;
  }
}

.full-handling {
  margin-top: 6px;
  color: #B2B1B6;
  font-size: 0.75rem;
}

.headers {
  width: 100%;
  margin: 1.25rem auto 0 auto;
  display: flex;

  span {
    flex: 1;
    font-size: 0.9375rem;
  }
}

.flex-data {
  display: flex;
  flex-direction: row;
  margin-top: 0.96875rem;

  .flex {
    &.flex-left {
      flex: 6;
    }

    flex: 4;
    display: block;

    .account-data {
      width: 100%;
      height: 2.25rem;
      line-height: 2.25rem;
      color: white;
      text-align: left;
      border-radius: 4px;
      background-color: #1D1C21;
      text-indent: 10px;
      margin-top: 12px;
    }
  }
}

.flex-between {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.confirmPanel{
  text-align: center;
  background-color: #1D1B1C;
  div{
    background: #222222;
    height: 2rem;
    line-height: 2rem;
    display: flex;
    color: white;
    margin:1px 0;
    span{
      width: 45%;
      text-align: right;
      margin-right: 2rem;
      color:#898989;
    }
  }
}
</style>
<style>

.van-dialog__header{
  padding: 0;
  font-weight: 500;
  text-align: center;
  height: 2.5rem;
  line-height: 2.5rem;
}
</style>
