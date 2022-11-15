import { get } from './http'
interface Params {
  token?: string; // [string]	是	登录所得秘钥
  newId: string,//信息id,为空则视为新增
  title: string,//标题
  keywords?: string,//关键词
  content: string,//内容
  thumb?: string,//缩略图链接
}
export function getSaveNews(params: Params) {
  return get('/api/auth/saveNews', params)
}