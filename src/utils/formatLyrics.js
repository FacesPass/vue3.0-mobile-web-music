/**
[00:00.000] 作曲 : 许嵩
[00:01.000] 作词 : 许嵩
[00:22.240]天空好想下雨
[00:24.380]我好想住你隔壁
[00:26.810]傻站在你家楼下
[00:29.500]抬起头数乌云
[00:31.160]如果场景里出现一架钢琴
[00:33.640]我会唱歌给你听
[00:35.900]哪怕好多盆水往下淋
[00:41.060]夏天快要过去}
*/

// [00:31.160]如果场景里出现一架钢琴
export function parseLyric(lyricString) {
  //匹配歌词的正则表达式
  const parseExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

  const lineStrings = lyricString.split("\n");

  const lyrics = [];
  for (let line of lineStrings) {
    if (line) {
      //找到字符串中的正则表达式的匹配
      const result = parseExp.exec(line);
      if (!result) continue
      //分钟
      const min = +result[1] * 60 * 1000
      //秒
      const sec = +result[2] * 1000
      //毫秒
      const milSec = result[3].length === 3 ? +result[3] : +result[3] * 10
      const time = min + sec + milSec
      const lyric = line.replace(parseExp, "").trim()
      const lineObj = { time, lyric }
      lyrics.push(lineObj)
      //计算下一段时间，用于当前歌词的高亮展示
      lyrics.forEach((lyric, i) => {
        if (i !== lyrics.length - 1) {
          lyric.nextTime = lyrics[i + 1].time
        }
      })
    }
  }

  return lyrics;
}