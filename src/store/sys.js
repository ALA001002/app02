import { make } from 'vuex-pathify'
import http from '@/utils/http'

const state = {
  config: localStorage['config'] || {
    see: true
  },
  klineOpt: localStorage['klineOpt'] ? JSON.parse(localStorage['klineOpt']) : { kType: '5min', technical1: 'MA', technical2: 'MACD' },
  version: '-',
  newVersion: localStorage.newVersion ? JSON.parse(localStorage.newVersion) : {},
  lang: localStorage.lang,
  wsData: {},
  bgConfig: null,
  loanStatus: 0,
  vipStatus: 0,
  welfareStatus: 0,
  statusbarHeight: window.plus ? plus.navigator.getStatusbarHeight() : 20
}

const mutations = make.mutations(state)


const actions = {
  ...make.actions('newVersion', 'bgConfig'),
  checkVersion({ dispatch }, opt) {
    let appType = (navigator.userAgent.indexOf('Android') > -1
      || navigator.userAgent.indexOf('Adr') > -1) ? 'android' : 'ios'
    http.get('common/version').then(data => {
      // http.get('common/getVersionInfo?app=' + appType).then(data => {
      data.type = appType
      localStorage.newVersion = JSON.stringify(data)
      dispatch('setNewVersion', data)
      if (opt && opt.callback) {
        opt.callback(data)
      }
    })
  },
  checkConfig({ state }) {
    http.get('config/query').then((data) => {
      // console.log(data)
      state.bgConfig = data
    })
  },
  openStatus({ state }) {
    http.get('common/openStatus').then((data) => {
      state.loanStatus = data.loanStatus
      state.vipStatus = data.vipStatus
      state.welfareStatus = data.welfareStatus
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
