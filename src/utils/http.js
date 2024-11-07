import axios from 'axios'
import {Toast} from 'vant'
import store from '@/store/index'

Toast.allowMultiple()
// 创建axios实例
var api = axios.create({
  timeout: 60000
})

var create_api = axios.create({
  timeout: 60000
})
let index = localStorage.getItem('API_INDEX')
if (typeof index == 'undefined') {
  index = 0
  localStorage.setItem('API_INDEX', index)
}
// 环境
let H5_HOME_URL = process.env.VUE_APP_H5_HOME_URL
let CREATE_ORDER_URL = process.env.VUE_APP_CREATE_ORDER_URL
let API_URLS = process.env.VUE_APP_API_URL.split(',')
let WS_URLS = process.env.VUE_APP_WS_URL.split(',')
let WS_URL = WS_URLS[+index]
axios.defaults.baseURL = api.defaults.baseURL = API_URLS[+index]

create_api.defaults.baseURL = CREATE_ORDER_URL
const changeBaseUrl = (e) => {
  console.log(e.message)
  if (e && e.message == 'Network Error') {
    index++
    if (API_URLS.length <= index) {
      index = 0
    }
    localStorage.setItem('API_INDEX', index)
    WS_URL = WS_URLS[+index]
    axios.defaults.baseURL = api.defaults.baseURL = API_URLS[+index]
  }
}

axios.defaults.headers['Content-Type'] = api.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 超时
api.defaults.timeout = 10000
// 请求拦截
api.interceptors.request.use(
    config => {
      // 请求带上token 和 语种
      const token = store.get('user/token')
      const lang = localStorage.lang
      token && (config.headers['Authorization'] = 'Bearer ' + token)
      lang && (config.headers['Lang'] = lang)
      return config
    },
    error => {
      return Promise.error(error)
    })

// 响应拦截器
api.interceptors.response.use(
    response => {
      // 200 成功
      const data = response.data || {}
      if (response.status !== 200) {
        data.code = response.status
        data.msg = response.message
      }
      if (data.code === 200) {
        return Promise.resolve(data)
      } else if (data.code === 401) {
        // 登录过期或未登录，清除token
        store.dispatch('user/logout')
        data.msg = 'login_expire'
        return Promise.reject(data)
      } else {
        return Promise.reject(data)
      }
    },
    error => {
      const data = {
        code: error.response && error.response.status,
        msg: error.response && error.response.data.message
      }
      changeBaseUrl(error)
      return Promise.reject(data)
    }
)

// 超时
create_api.defaults.timeout = 10000
// 请求拦截
create_api.interceptors.request.use(
    config => {
      // 请求带上token 和 语种
      const token = store.get('user/token')
      const lang = localStorage.lang
      token && (config.headers['Authorization'] = 'Bearer ' + token)
      lang && (config.headers['Lang'] = lang)
      return config
    },
    error => {
      return Promise.error(error)
    })

// 响应拦截器
create_api.interceptors.response.use(
    response => {
      // 200 成功
      const data = response.data || {}
      if (response.status !== 200) {
        data.code = response.status
        data.msg = response.message
      }
      if (data.code === 200) {
        return Promise.resolve(data)
      } else if (data.code === 401) {
        // 登录过期或未登录，清除token
        store.dispatch('user/logout')
        data.msg = 'login_expire'
        return Promise.reject(data)
      } else {
        return Promise.reject(data)
      }
    },
    error => {
      const data = {
        code: error.response && error.response.status,
        msg: error.response && error.response.data.message
      }
      changeBaseUrl(error)
      return Promise.reject(data)
    }
)

const request = function (method, url, params, flag) {
  let timer, toast
  if (!flag) {
    timer = setTimeout(() => {
      toast = Toast.loading({forbidClick: true, duration: 0})
    }, 650)
  }

  return new Promise((resolve, reject) => {
    method(url, params).then(data => {
      clearTimeout(timer)
      if (!flag) {
        if (toast) toast.clear()
      }
      resolve(flag?data:data.data)
    }).catch(err => {
      clearTimeout(timer)
      if (!flag) {
        if (err.msg) {
          err.msg = window.i18n.t('service.' + err.msg)
        }
        if (toast) {
          toast.icon = 'cross'
          toast.message = err.msg
          toast.forbidClick = false
          setTimeout(() => toast.clear(), 2500)
        } else {
          Toast.fail({
            icon: 'cross',
            message: err.msg,
            forbidClick: false,
            duration: 2500
          })
        }
      }
      reject(err)
    })
  })
}

const get = function (url, params, flag) {
  return request(api.get, url, {params: params}, flag)
}

const post = function (url, params, flag) {
  return request(api.post, url, params, flag)
}

const create_order_get = function (url, params, flag) {
    return request(create_api.get, url, params, flag)
}
const create_order_post = function (url, params, flag) {
  return request(create_api.post, url, params, flag)
}
api[get] =  (url, params) => get(url, params, true)
api[post] = (url, params) => post(url, params, true)
create_api[create_order_get] =  (url, params) => create_order_get(url, params, true)
create_api[create_order_post] = (url, params) => create_order_post(url, params, true)


export default {
  // api: {...,get: (url, params) => get(url, params, true), post: (url, params) => post(url, params, true)},
  api,
  get,
  post,
  create_api,
  create_order_get,
  create_order_post,
  getWsUrl() {
    return WS_URL
  },
  getH5HomeUrl() {
    return H5_HOME_URL
  },
  getCreateOrderUrl() {
    return CREATE_ORDER_URL
  }
}
