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

//将秒转化为分,用于歌词的时间控制
export function secToMin(sec) {
  sec = Math.floor(sec)
  //计算分钟
  //将秒数除以60，然后下舍入，既得到分钟数
  let min = Math.floor(sec / 60);
  //计算秒
  //取得秒%60的余数，既得到秒数
  sec = sec % 60;
  //将变量转换为字符串
  min += ''
  sec += ''
  //如果只有一位数，前面增加一个0
  min = (min.length === 1) ? '0' + min : min;
  sec = (sec.length === 1) ? '0' + sec : sec;
  return min + ':' + sec;
}

