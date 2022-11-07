import { get } from './http';
export function getSelectInfo() {
  return get('/api/auth/getSelectInfo');
}
