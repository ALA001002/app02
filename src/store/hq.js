// 行情数据
import { make } from 'vuex-pathify'

const state = {
  hq: localStorage['hq/hq'] ? JSON.parse(localStorage['hq/hq']) : [{symbolCode:'btcusdt', symbolName:'BTC/USDT'},{symbolCode:'ethusdt', symbolName:'ETH/USDT'},{symbolCode:'eosusdt', symbolName:'EOS/USDT'}]
}

const mutations = make.mutations(state)

const actions = {
  ...make.actions('hq'),
  update ({ dispatch }, data) {
    data = data.map(p => {
      var ds = p.symbolName.split('/')
      if (ds.length > 1) {
        p.from = ds[0]
        p.to = ds[1]
      }
      return p
    })
    dispatch('setHq', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
