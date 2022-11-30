import { get } from './http';
interface Params {
  token?: string; // [string]	是	登录所得秘钥
  startTime: string; // [string]		筛选开始时间 , 格式: 2022-09-29 10:20:30复制
  endTime: string; // [string]		筛选结束时间 , 格式: 2022-09-29 10:20:30
  status: number; // [string]		状态[1:启用 2:禁用 3:已过期]
  keyword: string; // [string]		关键字搜索
  page: number; // [string]	是	页码
  pageCount?: number; // [string]		每页数据量
}
export function getTrainLists(params: Params) {
  return get('/api/auth/trainLists', params);
}