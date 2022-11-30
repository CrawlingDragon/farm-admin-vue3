import { get } from './http';
interface Params {
  token?: string; // [string]	是	登录所得秘钥
  smsTempId: string; // [string]		短信模板ID , 例:  1
  userMobiles: string;//[string]  手机号逗号拼接
}
export function getNoteSmsSend(params: Params) {
  return get('/api/auth/smsSend', params);
}