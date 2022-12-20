// 获取全局开关
import { get } from './http';
export function getSwitchInfo() {
  return get('/api/auth/switchInfo');
}
