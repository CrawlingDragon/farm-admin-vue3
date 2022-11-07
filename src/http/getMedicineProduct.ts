import { get } from './http';
export function getMedicineProduct() {
  return get('/api/auth/getYongyaoProductLists');
}
