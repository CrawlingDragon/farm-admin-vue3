import { get } from './http';
export function getAliossCount() {
  return get('/api/auth/getAccount');
}
