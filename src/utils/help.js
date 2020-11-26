//防抖
export function debounce(fn, wait = 100) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, wait);
  }
}

//节流
export function throttle(fn, wait = 100) {
  let prev = new Date()
  return function (...args) {
    let now = new Date()
    if (now - prev > wait) {
      fn.apply(this, args)
      prev = new Date()
    }
  }
}

//获取范围内的随机一个数
export function getRandomNum(length) {
  return Math.round(Math.random() * length)
}

