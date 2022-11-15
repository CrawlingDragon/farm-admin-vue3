import { get } from './http'
interface Params {
  token?: string; // [string]	是	登录所得秘钥
  page: number; // [string]	是	页码
  pageCount?: number; // [string]		每页数据量
}
export function getMessageLists(params: Params) {
  return get('/api/auth/newsLists', params)
}