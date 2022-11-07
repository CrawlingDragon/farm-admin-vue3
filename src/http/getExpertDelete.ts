import { post } from './http';
export function getExpertDelete(params: any) {
  return post('/api/auth/expertDel', params);
}
