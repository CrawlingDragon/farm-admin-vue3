import { get } from './http';
export function getTestExpert() {
  return get('/api/auth/getExpertTemplateCetu');
}
