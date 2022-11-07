import { get } from './http';
export function getExport(params: any) {
  return get('/api/auth/exportExcel', params);
}
