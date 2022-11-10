import { get } from './http';
export function getNoteSmsSendInfo(params: any) {
  return get('/api/auth/smsSendInfo', params);
}