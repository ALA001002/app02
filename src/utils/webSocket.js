import store from '@/store'
import http from './http'
let nonce = 1
let promiseList = {}
let _ws
let ws = {}
let timer
// 心跳检测
let _xtime = new Date().getTime()

ws.send = (type, data) => {
  let message = {
    type,
    nonce: nonce++,
    data
  }
  _ws.send(JSON.stringify(message))
  return message.nonce
}

ws.psend = (type, data) => {
  let nonce = ws.send(type, data)
  let promise = new Promise((resolve, reject) => {
    promiseList['w' + nonce] = { resolve, reject }
  })
  promise.nonce = nonce
  return promise
}

ws.load = () => {
  if (_ws) {
    _ws.close()
  }
  _ws = new WebSocket(http.getWsUrl())
  _ws.onopen = () => {
    nonce = 1
    promiseList = {}
    // 登录
    _ws.send(JSON.stringify({
      type: 'LOGIN',
      data: store.get('user/token')
    }))
    // console.log('web socket open...')
  }
  // _ws.onclose = (err) => {
  //   console.error('web socket close...', err)
  // }
  _ws.onmessage = (data) => {
    data = JSON.parse(data.data)
    // 心跳的话重置心跳时间
    if (data.type == 'PING') {
      _xtime = new Date().getTime()
      return
    }
    var wsData = {}
    if (data.code == 200) {
      wsData[data.type] = data.data
    }
    store.set('wsData', wsData)
    var key = 'w' + data.nonce
    if (promiseList[key]) {
      if (data.code == 200) {
        promiseList[key].resolve(data.data)
      } else {
        promiseList[key].reject(data)
      }
      delete promiseList[key]
    }
  }
  heartbeat()
}

function heartbeat() {
  clearInterval(timer)
  timer = setInterval(function () {
    if (new Date().getTime() - _xtime > 4000) {
      // 每隔4s 发送心跳

      if (_ws?.readyState == 1) {
        _ws.send(JSON.stringify({
          type: 'PING'
        }))
      }
    }
    if (new Date().getTime() - _xtime > 7000) {
      // 超过7s 重新连接
      // console.log('web socket restart...')
      ws.load()
      _xtime = new Date().getTime()
    }
  }, 1000)

}



//ws.load()

export default ws
