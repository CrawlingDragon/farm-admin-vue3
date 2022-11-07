import { get } from './http';
export function getHospitalUser() {
  return get('/api/auth/getHospitalUser');
}
