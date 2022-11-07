import { post } from './http';
interface Params {
  token?: string;
  applyId: number; //审核数据id
  status: number; //1:拒绝 99:通过
  reason?: string;
}
export function getVipApplyAction(params: Params) {
  return post('/api/auth/examineHandle', params);
}
