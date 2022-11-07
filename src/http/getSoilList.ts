import { get } from './http';
interface Params {
  token?: string; // [string]	是	登录所得秘钥
  uid?: number; // [string]		会员详情memberDetail接口id
  keyword: string; // [string]		关键字搜索
  status: number; // [string]		状态[1:检测中 2:检测完成 3:已给处方]
  startTime: string; // [string]		筛选开始时间 , 格式: 2022-09-29 10:20:30复制
  endTime: string; // [string]		筛选结束时间 , 格式: 2022-09-29 10:20:30
  page: number; // [string]	是	页码
  pageCount?: number; // [string]		每页数据量
}
export function getSoilList(params: Params) {
  return get('/api/auth/testingsoilLists', params);
}
