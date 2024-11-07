// 设置 rem 函数
function setRem() {
  // 375 默认大小18.75px; 375px = 20rem ; 每个元素px基础上/16
  let htmlWidth =
    document.documentElement.clientWidth || document.body.clientWidth
  // 得到html的Dom元素
  let htmlDom = document.getElementsByTagName('html')[0]
  // 设置根元素字体大小
  htmlDom.style.fontSize = htmlWidth / 20 + 'px'
}
// 初始化
setRem()
// 改变窗口大小时重新设置 rem
window.onresize = () => setRem()
