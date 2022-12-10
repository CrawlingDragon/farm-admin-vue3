//TV广告设置api
import { get, post } from './http';

//获取广告设置列表
export function getTvListFetch() {
  return get('/api/auth/adLists');
}

//删除广告
export function getTvDel(adId: string) {
  return post('/api/auth/delAd', { adId });
}

//新增编辑广告
interface AddParams {
  token?: string;
  adId: number;
  title: string;
  images: string[];
  listorder: string; //排序数值
  content: ''; //内容
}
export function getAddEditTv(params: AddParams) {
  return post('/api/auth/adHandle', params);
}

//获取广告 详情
export function getTvDetail(adId: string) {
  return get('/api/auth/adInfo', { adId });
}
