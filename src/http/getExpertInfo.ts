import { get } from './http';
interface Params {
  token?: string;
  expertId: number;
}

export function getExpertInfo(params: Params) {
  return get('/api/auth/expertDetail', params);
}
