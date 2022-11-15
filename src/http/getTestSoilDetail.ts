import { get } from './http';
export function getTestSoilDetail(cetuId: number) {
  return get('/api/auth/testingsoilDetail', { cetuId });
}
