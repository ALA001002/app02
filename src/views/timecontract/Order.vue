<template>
  <div>
    <navBar back>{{$t("exchange.order")}}</navBar>
    <div class="historys flex">
      <div class="tabs">
          <span @click="()=>changeHistoryIndex(0)" :class="historyIndex==0?'active':''">{{
              $t("timecontract.current")
            }}</span>
        <span @click="()=>changeHistoryIndex(1)" :class="historyIndex==1?'active':''">{{
            $t("timecontract.history")
          }}</span>
      </div>
    </div>
    <div class="order-list-item">
      <OrderItem v-for="item in list" :key="item.id" :data="item" :base="sup" :shareLink="shareLink"/>
    </div>
  </div>
</template>
<script>
import OrderItem from '@/components/timecontract/OrderItem'

export default {
  data() {
    return {
      shareLink: null,
      sup: this,
      historyIndex: 0,
      historys: []
    }
  },
  computed:{
    list() {
      return this.historys.filter(p => {
        if (this.historyIndex == '0') {
          return p.status == 0
        }
        return p.status != 0
      })
    }
  },
  components: {OrderItem},
  created() {
    this.queryHistorys()
  },
  methods: {
    queryHistorys() {
      const self = this
      this.$http.get('/timeContract/listContract?contractType=0&trustType=0').then((res) => {
        // console.log(res)
        self.historys = res
      })
    },
    changeHistoryIndex(index) {
      this.historyIndex = index
    }
  }
}
</script>
<style scoped lang="scss">
.order-list-item{
  margin-top: 1.3125rem;
  padding: 0 2.5%;
}
.historys {
  //margin-top: 2.3125rem;
  padding: 0 2.5%;
  justify-content: space-between;

  .tabs {
    width: 95%;
    margin: 0 auto;
    font-size: 0.9375rem;
  }

  .more {
    color: #F5A600;
    font-size: 0.8125rem;
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

</style>