import { get } from './http';
export function getVipAdmin(params: any) {
  return get('api/auth/memberLists', params);
}
