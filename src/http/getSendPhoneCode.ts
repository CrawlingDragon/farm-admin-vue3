import { get } from './http';
export function getSendPhoneCode(params: any) {
  return get('/api/auth/sendSmsCode', params);
}
