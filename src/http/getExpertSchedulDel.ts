import { get } from './http';
export function getExpertSchedulDel(params: any) {
  return get('/api/auth/expertSchedulDel', params);
}