import { get } from './http';
export function getSubscribeDetail(params: any) {
  return get('/api/auth/subscribeDetail', params);
}