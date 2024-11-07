// 行情数据
import { make } from 'vuex-pathify'
import http from '@/utils/http'
import router from '@/router'

const state = {
  token: localStorage.token,
  info: localStorage.userInfo || {},
  wallet: [],
  profit: undefined
}

const mutations = make.mutations(state)

const actions = {
  ...make.actions(['token', 'info', 'wallet', 'profit']),
  token({ dispatch }, token) {
    if (token) {
      localStorage['token'] = token
    } else {
      localStorage.removeItem('token')
    }
    dispatch('setToken', token)
  },
  logout({ dispatch }) {
    localStorage.removeItem('token')
    dispatch('setToken', null)
    dispatch('setInfo', {})
    router.replace('/')
  },
  info({ dispatch, state }) {
    if (!state.token) return
    http.get('user/getUserInfo').then(data => {
      localStorage.userInfo = JSON.stringify(data)
      dispatch('setInfo', data)
    })
  },
  wallet({ dispatch }, data) {
    if (data) {
      dispatch('setWallet', data)
    }
  },
  profit({ dispatch }, data) {
    if (data) {
      dispatch('setProfit', data)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
