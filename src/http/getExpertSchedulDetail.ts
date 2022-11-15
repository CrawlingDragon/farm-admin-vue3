import { get } from './http';
export function getExpertSchedulDetail(params: any) {
  return get('/api/auth/expertSchedulDetail', params);
}