import { make } from 'vuex-pathify'

const state = {
  data:[]
}

const mutations = make.mutations(state)
const actions = {
  ...make.actions(['data']),
  addLog({dispatch,state},log){
    state.data.unshift(log)
    dispatch('setData', [...state.data])
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
