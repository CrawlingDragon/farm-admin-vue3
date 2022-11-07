import { get } from './http';
import storage from 'good-storage';
export function getUserInfo() {
  let token = storage.get('token');
  return get('/api/auth/userInfo', { token });
}
