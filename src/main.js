import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import './utils/androidBack'
import http from './utils/http'

import './utils/safeArea' // safeArea
import './utils/rem' // rem
import ws from './utils/webSocket' // webSocket
import VConsole from 'vconsole'
if (process.env.VUE_APP_DEBUG == '1' && /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
  new VConsole()
}
Vue.prototype.$ws = ws

// fastclick
import FastClick from 'fastclick'
FastClick.attach(document.body)

// directive
import './directive/help'
import clipboard from './directive/clipboard'
clipboard.install(Vue)

// vant ui
import Vant from 'vant'
// import 'vant/lib/index.css'
import './assets/css/vant-vars.less'
import { Lazyload, Calendar } from 'vant'

Vue.use(Calendar)
Vue.use(Vant)
Vue.use(Lazyload, {
  lazyComponent: true
})
import Img from '@/components/Img.vue'
Vue.component('Img', Img)

import { toNumber } from '@/utils/helper'
Vue.prototype.toNumber = toNumber

import './assets/css/index.scss'

Vue.config.productionTip = false
Vue.prototype.$http = http
import 'vue-list-marquee/dist/vue-list-marquee.css'
import VueListMarquee from 'vue-list-marquee'
Vue.use(VueListMarquee)

import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)


// 状态栏调成黑色
document.addEventListener('plusready', () => {
  // plus.navigator.setStatusBarStyle('light')
}, false)

//#region 注册全局自定义组件

import NavBar from '@/components/NavBar'
import NoData from '@/components/NoData'
import Layout from '@/components/layout'
import ValueFormat from '@/components/ValueFormat'
import CoinImg from '@/components/CoinImg'
import DialogSuccess from '@/components/DialogSuccess'
import ScrollMore from '@/components/ScrollMore'

Vue.use(NavBar)
Vue.use(NoData)
Vue.use(Layout)
Vue.use(ValueFormat)
Vue.use(CoinImg)
Vue.use(DialogSuccess)
Vue.use(ScrollMore)

//#endregion



new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
