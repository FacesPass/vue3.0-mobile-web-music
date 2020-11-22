export function changeValue(value) {
  let res
  if (value < 0) {
    return
  }

  if (value > 100000000) {
    res = value / 100000000
    res = res.toFixed(2)
    return res + '亿'
  } else if (value > 10000) {
    res = value / 10000
    res = res.toFixed(2)
    return res + '万'
  } else {
    return value
  }
}

export function getSizeImage(picUrl, width, height = width) {
  return `${picUrl}?param=${width}x${height}`
}