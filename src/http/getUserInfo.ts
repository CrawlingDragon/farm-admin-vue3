import { get } from './http';
import storage from 'good-storage';
export function getUserInfo() {
  let token = storage.session.get('token');
  return get('/api/auth/userInfo', { token });
}
