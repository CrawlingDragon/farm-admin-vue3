import { get } from './http';
export function getNewsInfo(params: any) {
  return get('/api/auth/newsInfo', params);
}