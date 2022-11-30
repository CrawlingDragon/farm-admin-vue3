import { get } from './http';
export function getTrainDetail(params: any) {
  return get('/api/auth/trainDetail', params);
}