import { get } from './http';
export interface Params {
  token?: string;
  startTime: string;
  endTime: string;
  keyword: string;
  status: number; //审核状态 【1：已拒绝 2：待审核 99：审核通过】
  page: number;
  pageCount?: number;
}
export function getVipApply(params: Params) {
  return get('/api/auth/memberExamineLists', params);
}
