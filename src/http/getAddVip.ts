import { get } from './http';

interface Params {
  token?: string;
  userName: string;
  resideprovince: string;
  // [string]	是	省名,格式: 浙江省
  residecity: string;
  // [string]	是	市名, 格式 : 杭州市
  residedist: string;
  // [string]	是	区
  residecommunity: string;
  // [string]		街道复制
  address: string;
  tel: number | string;
  sex: number;
  selfcard: string | number;
  familycount: number | string;
  zuowuJson: any;
  remarks: string;
}
export function getAddVip(params: Params) {
  return get('/api/auth/addMember', params);
}

interface Telparams {
  token?: string;
  tel: number | string;
}
export function getUserInfoByTel(params: Telparams) {
  return get('/api/auth/getUserInfoByTel', params);
}
