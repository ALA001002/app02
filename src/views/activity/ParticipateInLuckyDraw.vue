<template>
  <div class="draw">
    <div class="drawcard">
      <div class="tit">{{$t('activity.rgc')}}<span style="font-size: 32px;font-family: DINCondensed-Bold, DINCondensed;">5000</span>{{$t('activity.cjm')}}</div>
      <div class="btn-w">
        <input type="text" class="input" v-model="code" :placeholder="$t('activity.input')">
        <div @click="start" class="btn">{{$t('activity.ljcj')}}</div>
      </div>
      <div class="turntable_box">
        <ul id="rotary_table">
          <li
            v-for="(item, index) in awards"
            :key="index"
            :class="['award' + index, { active: index == current }]"
            class="award"
          >
            <img class="img" :src="item.img" alt />
            <div class="mask">{{item.name}}</div>
          </li>
          <img class="center-btn" src="@/assets/images/activity/center.png" alt="">
        </ul>
      </div>
    </div>
    <div class="record">
      {{$t('activity.drawpt')}}
    </div>
    <div class="yaolist">
      <div class="yaolisttop">
        <span>{{$t('activity.drawzh')}}</span>
        <span>{{$t('activity.drawnum')}}</span>
        <span>{{$t('activity.drawtime')}}</span>
      </div>
      <div class="yaoli">
        <vue-list-marquee :listData='winningRecordPd' >
          <template slot-scope="{ item, index }">
            <div class="yaoqli" :key="index">
                <span style="width: 35%;text-align: left;display: inline-block;overflow: hidden;text-overflow:ellipsis;white-space:nowrap;">{{item.username}}</span>
                <span style="width: 35%;text-align: left;display: inline-block;overflow: hidden;text-overflow:ellipsis;white-space:nowrap;">{{item.num}} {{item.coin}}</span>
                <span>{{item.createTime.split(' ')[0]}}</span>
            </div>
          </template>
        </vue-list-marquee>
      </div>
    </div>
    <div class="record">
      {{$t('activity.draww')}}
    </div>
    <div class="yaolist1">
      <div class="yaolisttop">
        <span>{{$t('activity.drawzjsg')}}</span>
        <span>{{$t('activity.drawtime')}}</span>
      </div>
      <div class="yaoli">
        <div class="yaoqli" v-for="(item, index) in winningRecord" :key="index">
          <span>{{item.num}} {{item.coin}}</span>
          <span>{{item.createTime.split(' ')[0]}}</span>
        </div>
      </div>
    </div>
    <div class="rules">
      <div class="t">{{$t('activity.cjlj')}}</div> 
      <div class="s">
        {{$t('activity.c1')}}
      </div> 
      <div class="s">
        {{$t('activity.c2')}}
      </div>
      <div class="s">
        {{$t('activity.c3')}}
      </div> 
      <div class="s">
        {{$t('activity.c4')}}
      </div>
      <div class="s">
        {{$t('activity.c5')}}
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant'
export default {
  name: 'nineSquaredPaper',
  data() {
    return {
      awards: [
        // 图片名字与ID
        // { id: 1, name: '0.001 BTC', img: 'https://pic1.zhuanstatic.com/zhuanzh/578d2bac-9b64-4d9b-ae5e-e611730fb34d.png' },
        // { id: 2, name: '1 USDT', img: 'https://pic4.zhuanstatic.com/zhuanzh/aef2d4dd-1adf-471f-a6c2-794b428eb715.png' },
        // { id: 3, name: '1 ETH', img: 'https://pic3.zhuanstatic.com/zhuanzh/2ed01b85-1db9-4a37-8615-567d25eb9d73.png' },
        // { id: 4, name: '0.001 BTC', img: 'https://pic1.zhuanstatic.com/zhuanzh/578d2bac-9b64-4d9b-ae5e-e611730fb34d.png' },
        // { id: 5, name: '10 LIBRA' , img: 'https://pic2.zhuanstatic.com/zhuanzh/35843616-d655-4f39-afc8-864105e570a4.png'},
        // { id: 6, name: '1 ETH' , img: 'https://pic3.zhuanstatic.com/zhuanzh/2ed01b85-1db9-4a37-8615-567d25eb9d73.png'},
        // { id: 7, name: '1 USDT', img: 'https://pic4.zhuanstatic.com/zhuanzh/aef2d4dd-1adf-471f-a6c2-794b428eb715.png' },
        // { id: 8, name: '10 LIBRA', img: 'https://pic2.zhuanstatic.com/zhuanzh/35843616-d655-4f39-afc8-864105e570a4.png' }
      ],
      winningRecord: [],
      winningRecordPd: [],
      code: '',
      current: 9, // 当前索引值
      speed: 200, // 时间->速度
      diff: 15, // 基数
      award: {}, // 抽中的奖品
      time: 0, // 当前时间戳
      timer: null, // 定时器
    }
  },
  mounted() {
    this.$http.api.get('luck/jackpotList').then(data => {
      this.awards = data.data.map(item => {
        const imgs = {
          'BTC': 'https://pic1.zhuanstatic.com/zhuanzh/578d2bac-9b64-4d9b-ae5e-e611730fb34d.png',
          'USDT': 'https://pic4.zhuanstatic.com/zhuanzh/aef2d4dd-1adf-471f-a6c2-794b428eb715.png',
          'ETH': 'https://pic3.zhuanstatic.com/zhuanzh/2ed01b85-1db9-4a37-8615-567d25eb9d73.png',
          'DIEM': 'https://pic2.zhuanstatic.com/zhuanzh/35843616-d655-4f39-afc8-864105e570a4.png'
        }
        return {
          id: item.id,
          name: item.num + ' ' + item.coin,
          img: imgs[item.coin]
        }
      })
    })
    this.$http.api.get('luck/winningRecord').then(data => {
      this.winningRecord = data.data
    })
    this.$http.api.get('luck/platformRecord').then(data => {
      this.winningRecordPd = data.data
    })
  },
  methods: {
    async start() {
      if(!this.code) {
        Toast(this.$t('activity.input'))
        return
      }
      this.getLottery()
      this.time = Date.now()
      this.speed = 200
      this.diff = 12
    },
    async getLottery() {
      this.$http.api.get('luck/luckDraw?code=' + this.code).then(data => {
        this.award.name = data.data.num + ' ' + data.data.coin,
        this.award.id = data.data.id
        this.move()
      }).catch(data => {
        Toast(data.msg)
      })
    },
    move() {
      this.timer = setTimeout(() => {
        this.current++
        if (this.current > 7) {
          this.current = 0
        }
        if (this.award.id && (Date.now() - this.time) / 1000 > 2) {
          this.speed += this.diff
          if (
            (Date.now() - this.time) / 1000 > 4 &&
            this.award.id == this.awards[this.current].id
          ) {
            clearTimeout(this.timer)
            setTimeout(() => {
              Toast(`${this.award.name}`)
            }, 0)
            return
          }
        } 
        else {
          this.speed -= this.diff
        }
        this.move()
      }, this.speed)
    }
  }
}
</script>
<style lang="scss" scoped>
.draw {
  padding: 20px;
  .drawcard {
    width: 335px;
    height: 510px;
    background: linear-gradient(263deg, #2F5FFF 0%, #3CBAFF 100%);
    border-radius: 15px;
    .tit {
      margin-bottom: 24px; 
      padding-top: 30px;
      font-size: 18px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #FFFFFF;
      line-height: 24px;
      text-align: center;
    }
    .btn-w {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .input {
      width: 140px;
      height: 36px;
      background: #FFFFFF;
      border-radius: 2px;
      outline: none;
      border: none;
      padding-left: 5px;
      margin-right: 15px;
    }
    .btn {
      width: 92px;
      height: 36px;
      background: linear-gradient(263deg, #2F5FFF 0%, #3CBAFF 100%);
      border-radius: 18px;
      border: 3px solid #FFFFFF;
      line-height: 32px;
      text-align: center;
      font-size: 12px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #FFFFFF;
    }
  }
  .record {
    margin: 20px auto 10px;
    height: 22px;
    font-size: 16px;
    font-family: PingFang-SC-Bold, PingFang-SC;
    font-weight: bold;
    color: #333333;
    line-height: 22px;
  }
  .yaolist1 {
    width: 335px;
    height: 130px;
    background: #F6F7FA;
    border-radius: 10px;
    .yaoli {
      width: 335px;
      height: 91px;
      background: #F1F2F7;
      overflow-y: scroll;
      .yaoqli {
        display: flex;
        justify-content: space-between;
        height: 29px;
        line-height: 29px;
        padding: 0 20px 0 10px;
        font-size: 11px;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: #333333;
      }
    }
    .yaolisttop {
      display: flex;
      justify-content: space-between;
      height: 29px;
      line-height: 29px;
      padding: 0 20px 0 10px;
      font-size: 11px;
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color: #999999;
    }
  }
  .yaolist {
    background: #F6F7FA;
    border-radius: 10px;
    width: 335px;
    height: 200px;
    .yaoli {
      width: 335px;
      height: 180px;
      background: #F1F2F7;
      overflow: hidden;
      // overflow-y: scroll;
      .yaoqli {
        display: flex;
        justify-content: space-between;
        height: 29px;
        line-height: 29px;
        padding: 0 20px 0 10px;
        font-size: 11px;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: #333333;
      }
    }
    .yaolisttop {
      display: flex;
      justify-content: space-between;
      height: 29px;
      line-height: 29px;
      padding: 0 20px 0 10px;
      font-size: 11px;
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color: #999999;
    }
  }
  .rules {
    margin-top: 20px;
    margin-bottom: 40px;
    .t {
      font-size: 16px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      font-weight: bold;
      color: #333333;
      line-height: 22px;
    }
    .s {
      font-size: 12px;
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color: #999999;
      line-height: 24px;
    }
  }
}

.turntable_box {
  margin-top: 30px;
  #rotary_table {
    position: relative;
    width: 320px;
    height: 320px;
    margin: auto;
    .award {
      width: 100px;
      height: 93px;
      background: #FFFFFF;
      border-bottom: solid #B8C2D7 7px;
      border-radius: 15px;
      text-align: center;
      float: left;
      position: absolute;
      overflow: hidden;
      .img {
        margin: 12px auto 0;
        width: 45px;
        height: 45px;
      }
      .mark {
        text-align: center;
        margin-top: 5px;
        height: 20px;
        font-size: 20px;
        font-family: DINCondensed-Bold, DINCondensed;
        font-weight: bold;
        color: #333333;
        line-height: 20px;
      }
      &.active {
        background: linear-gradient(360deg, #FF8A87 0%, #FF5653 100%);
        border-bottom: solid #E53430 7px;
      }
      &.award0 {
        top: 0px;
        left: 0px;
      }
      &.award1 {
        top: 0px;
        left: 110px;
      }
      &.award2 {
        top: 0px;
        right:0px;
      }
      &.award3 {
        top: 110px;
        right: 0px;
      }
      &.award4 {
        bottom: 10px;
        right: 0px;
      }
      &.award5 {
        bottom: 10px;
        right: 110px;
      }
      &.award6 {
        bottom: 10px;
        left: 0px;
      }
      &.award7 {
        top: 110px;
        left: 0px;
      }
    }
    .center-btn{
      width: 60px;
      height: 102px;
      position: absolute;
      top: 102px;
      left: 130px;
    }
  }
}

</style>
