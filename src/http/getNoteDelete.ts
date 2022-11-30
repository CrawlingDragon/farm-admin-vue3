import { get } from './http';
export function getNoteDelete(params: any) {
  return get('/api/auth/sendLogDel', params);
}