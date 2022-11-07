import { get } from './http';
export function getVipDetail(params: any) {
  return get('/api/auth/memberDetail', params);
}
