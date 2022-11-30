import { post } from './http';
//删除跟踪记录
export function getTrackDel(trackId: string) {
  return post('/api/auth/trackDel', { trackId });
}

interface Params {
  token?: string;
  cetuId: string; //测土记录ID
  trackTime: string; //跟踪日期, 格式 2022-10-08 12:20:12
  effect: number; //	诊疗效果, 1:没效果 2:待跟进 3:已调理
  content: string;
}
//添加跟踪记录
export function getTrackAdd(params: Params) {
  return post('/api/auth/trackAdd', params);
}
