import { get } from './http';

export interface AddExpert {
  token?: string; //必填	登录所得秘钥
  schId?: string; //排班ID,为空则表示新增
  outpatientTime: string; //必填	门诊时间,格式 2022-10-08
  apm: string; //必填	时段[1:上午 2:下午]
  isRepeat: string; //必填 是否重复[1:是 0:否]
  expertId: string; //必填 专家ID
  status: string; //必填	状态 [1:启用 2:禁用]
}
export function getAddExpert(params: AddExpert) {
  return get('/api/auth/expertSchedulSave', params);
}
