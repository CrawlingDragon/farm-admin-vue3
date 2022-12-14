//获取nav栏的文案
import { get } from './http';
export function getGlobalTitle() {
  return get('/api/auth/platformName');
}
