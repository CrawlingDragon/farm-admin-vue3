import { get } from './http';

interface Params {
  token?: string;
  page: number;
  pageCount?: number;
}
const pageCount = 10;
export function getExpertList(params: Params) {
  return get('/api/auth/expertLists', { ...params, pageCount });
}
