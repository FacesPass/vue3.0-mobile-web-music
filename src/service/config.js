const devBaseURL = 'http://123.207.32.32:9001' //本地测试环境地址
const proBaseURL = 'http://123.207.32.32:9001'  //生产环境的地址

export const BASE_URL = process.env.NODE_ENV === 'development' ? devBaseURL : proBaseURL

export const TIME_OUT = 5000

