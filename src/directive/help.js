
import Vue from 'vue'
import { Dialog } from 'vant'

Vue.directive('help', {
  inserted: function (el, binding) {
    function documentHandler() {
      Dialog({
        title: el.innerText,
        message: el.__vueClickHelpText__,
        className: 'dark-dialog'
      })
    }
    el.style.textDecoration = 'underline'
    el.__vueClickHelp__ = documentHandler
    el.__vueClickHelpText__ = binding.value
    el.addEventListener('click', documentHandler)
  },
  update(el, binding) {
    el.__vueClickHelpText__ = binding.value
  },
  unbind(el) {
    // 解除事件监听
    el.removeEventListener('click', el.__vueClickHelp__)
    delete el.__vueClickOutside__
  }
})