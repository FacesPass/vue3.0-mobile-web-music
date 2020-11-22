const devBaseURL = 'http://localhost:3000' //本地测试环境地址
const proBaseURL = ''  //生产环境的地址

export const BASE_URL = process.env.NODE_ENV === 'development' ? devBaseURL : proBaseURL

export const TIME_OUT = 5000

