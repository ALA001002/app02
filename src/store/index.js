import Vue from 'vue'
import Vuex from 'vuex'
import pathify from './pathify'
import sys from './sys'
import user from './user'
import hq from './hq'
import log from './log'
Vue.use(Vuex)

const store = new Vuex.Store({
  ...sys,
  modules: {
    user,
    log,
    hq
  },
  plugins: [pathify.plugin]
})

export default store
window.store = store