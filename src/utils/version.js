import store from '@/store/index'

let isForce = false
// let downloading = false

export function loadVersion() {
  store.set('version', process.env.VUE_APP_VERSION)
  store.dispatch('checkVersion')
}

export function download(force) {
  const version = store.get('newVersion')
  // if (version.type == 'android') {
  //   const localVersion = store.get('version')
  //   if (localVersion == version.version) {
  //     return
  //   }

  isForce = force !== false
  //   if (isForce) plus.nativeUI.showWaiting('下载更新文件...')
  //   if (downloading) return
  //   downloading = true

  //   plus.downloader.createDownload( version.url, { filename: '_doc/update/'}, (d, status) => {
  //     if (status == 200) {
  //       localStorage.updatePath = d.filename
  //       console.log('下载成功：', d.filename)
  //       if (isForce) {
  //         install() // 安装wgt包
  //       }
  //     } else {
  //       if (isForce) {
  //         plus.nativeUI.closeWaiting()
  //         plus.nativeUI.alert('更新失败[' + status + ']')
  //       }
  //       console.log('下载失败！')
  //     }
  //   }).start()
  //   return
  // }
  // 跳转到外部更新
  if (window.plus) {
    plus.runtime.openURL(version.url, () => {
      plus.nativeUI.alert('open error')
    })
  } else {
    window.open(version.url)
  }
}

// 更新应用资源包
export function install() {
  const path = localStorage.updatePath
  if (!path) {
    return
  }
  if (isForce) plus.nativeUI.showWaiting('安装中...')
  // console.log('安装中...')
  plus.runtime.install(path, {}, () => {
    plus.nativeUI.closeWaiting()
    localStorage.updatePath = null
    // console.log('更新成功！')
    if (isForce) {
      plus.nativeUI.alert('更新完成！', function () {
        plus.runtime.restart()
      })
    }
  }, function (e) {
    plus.nativeUI.closeWaiting()
    // console.log('安装失败[' + e.code + ']：', e.message)
    plus.nativeUI.alert('安装失败[' + e.code + ']：' + e.message)
  })
}
