import html2canvas from 'html2canvas'
import { Toast } from 'vant'



/*这里一定要是_doc目录*/
// const path = '_doc/gallery/_tmp.jpg'
const path = '_doc/gallery/_tmp.png'

const save = function (canvas) {
  var base64 = canvas.toDataURL('image/png')
  if (window.plus) {
    var img = new plus.nativeObj.Bitmap('coin_address')
    img.loadBase64Data(base64, () => {
      img.save(path, { overwrite: true }, () => {
        plus.gallery.save(path, function () {
          Toast.success()
        }, function () {
          Toast.fail('fail')
        })
      }, (e) => {
        Toast.fail('fail ' + e)
      })
    }, (e) => {
      Toast.fail('fail ' + e)
    })
  } else {
    console.log('浏览器下载')
    var a = document.createElement('a')
    // 创建一个单击事件
    var event = new MouseEvent('click')
    // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
    a.download = 'tmp.png'
    // 将生成的URL设置为a.href属性
    a.href = base64
    // 触发a的单击事件
    a.dispatchEvent(event)
  }
}

export default function (el, backgroundColor = null) {
  html2canvas(el, {
    allowTaint: true,
    logging: true,
    useCORS: true,
    backgroundColor
  }).then(canvas => {
    try {
      save(canvas)
    } catch (err) {
      // console.log(err)
      Toast.fail('fail ' + err)
    }
  }).catch(err => {
    // console.log(err)
    Toast.fail('fail  ' + err)
  })
}