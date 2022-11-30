import { get } from './http';
export function getNoteSmsTemplate() {
  return get('/api/auth/smsTemplate');
}