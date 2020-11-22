//该模块实现移动端rem布局
function remSize() {
  let deviceWidth = document.documentElement.clientWidth || window.innerWidth //获取屏幕宽度
  if (deviceWidth >= 750) {
    deviceWidth = 750  //pc端屏幕宽度如果大于750也直接设置成750
  }
  if (deviceWidth <= 320) {
    deviceWidth = 320  //移动端屏幕宽度不能小于320
  }

  //设计稿是750px
  //设置一半的宽度。就是375px
  //1rem = 100px的设计稿宽度
  //一半宽度rem就是 3.75rem
  document.documentElement.style.fontSize = (deviceWidth / 7.5) + 'px'

  //设置默认字体大小
  document.body.style.fontSize = 0.3 + 'rem'
}

remSize()

window.onresize = function () {
  remSize()
}