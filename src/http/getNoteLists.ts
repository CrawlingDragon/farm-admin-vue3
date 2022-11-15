import { get } from './http'
interface Params {
  token?: string; // [string]	是	登录所得秘钥
  startTime: string; // 搜索开始时间 格式: 2022-10-08 11:22:30
  endTime: string; // 搜索结束时间 格式: 2022-10-12 11:22:30
  page: number; // [string]	是	页码
  pageCount?: number; // [string]		每页数据量
}
export function getNoteLists(params: Params) {
  return get('/api/auth/smsSendLists', params)
}