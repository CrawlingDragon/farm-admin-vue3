import { get } from './http';

interface AsideItem {
  words: string; //文案
  label: string;
  state: number; // 1：显示 2：不显示
  linkurl?: string;//商品中心的跳转链接
}
export interface AsideTS {
  member: [AsideItem]; // 会员中心
  examine: [AsideItem]; //诊疗中心
  commodity: [AsideItem]; // 商品中心
  peculiarity: [AsideItem]; // 特色服务
}

export function getLeftAside() {
  return get('/api/auth/leftColumn');
}
