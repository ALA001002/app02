import i18n from '@/i18n'
var plusReady = function (callback) {  
  if (window.plus) { 
    callback()
  } else {  
    document.addEventListener('plusready', callback)
  }  
}

plusReady(function () {  
  var firstBack = 0
  var handleBack = function () {  
     
    /**  
     * 假设 tabbar_menu 只有顶级页面有
     * 有可后退的历史记录，则后退。  
     * 否则，关闭当前窗口。  
     * 如果当前窗口是入口页，那么执行退出的逻辑。  
     */  
    var canBack = !document.getElementById('tabbar_menu')
    if (canBack) {
      window.history.go(-1)
    } else {
      if (!firstBack) {  
        firstBack = new Date().getTime()
        plus.nativeUI.toast(i18n.t('app.confirmReturn'))

        setTimeout(function () {  
          firstBack = 0
        }, 2000)
      } else if (new Date().getTime() - firstBack < 2000) {  
        plus.runtime.quit()
      }
    }
  }

  plus.key.addEventListener('backbutton', handleBack)
})