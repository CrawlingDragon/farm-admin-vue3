import { post } from './http';
export function getDeleteVip(params: any) {
  return post('/api/auth/memberDelete', params);
}
