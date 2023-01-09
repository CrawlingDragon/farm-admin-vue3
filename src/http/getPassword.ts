import { get, post } from './http';
//修改密码
interface AddParams {
  token?: string;
  oldPwd: string;
  newPwd: string;
  repeatPwd: string;
}
export function getPassword(params: AddParams) {
  return get('/api/auth/resetPwd', params);
}