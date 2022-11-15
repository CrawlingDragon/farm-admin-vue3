import { post } from './http';
export function getDelSoil(cetuId: string) {
  return post('/api/auth/testingsoilDelete', { cetuId });
}
