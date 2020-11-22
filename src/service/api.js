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


//获取歌词  传入歌曲id
export function getLyric(id) {
  return request.get(`/lyric?id=${id}`)
}


//默认搜索关键词  调用此接口 , 可获取默认搜索关键词
export function getDefaultKeyword() {
  return request.get('/search/default')
}


//获取热门搜索列表
export function getHotSearch() {
  return request.get(`/search/hot/detail`)
}