import request from './request'

//获取 banner( 轮播图 ) 数据
//type: 0 - pc   1 - 安卓   2 - ios  3 - ipad
export function getBanner(type = 0) {
  return request.get(`/banner?type=${type}`)
}

//获取推荐歌单
//limit 获取歌单数量
export function getRecommendAlbumList(limit = 20) {
  return request.get(`/personalized?limit=${limit}`)
}


//获取歌单详情信息  传入歌曲id
export function getAlbumListDetail(id) {
  return request.get(`/playlist/detail?id=${id}`)
}

//获取歌曲的播放链接，传入歌曲id
export function getMusicUrl(id) {
  return request.get(`/song/url?id=${id}`)
}

//获取歌词  传入歌曲id
export function getLyric(id) {
  return request.get(`/lyric?id=${id}`)
}


//默认搜索关键词  调用此接口 , 可获取默认搜索关键词
export function getDefaultKeyword() {
  return request.get('/search/default')
}

//获取搜索建议
export function getSearchSuggest(keyword) {
  return request.get(`/search/suggest/?keywords=${keyword}&type=mobile`)
}

//获取热门搜索列表
export function getHotSearch() {
  return request.get(`/search/hot/detail`)
}

//搜索音乐
//调用此接口 , 传入搜索关键词可以搜索该音乐 / 专辑 / 歌手 / 歌单 / 用户 
//关键词可以多个 , 以空格隔开 , 如 " 周杰伦 搁浅 "( 不需要登录 )
//搜索获取的 mp3url 不能直接用 , 可通过 /song/url 接口传入歌曲 id 获取具体的播放链接
//keywords:关键词
//limit : 返回数量 
//type: 搜索类型；默认为 1 即单曲 
//取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
export function search(keywords, limit = 40, type = 1) {
  return request.get(`/search?keywords=${keywords}&limit=${limit}&type=${type}`)
}