import { get } from './http';
export function getPrescribingTemplate() {
  return get('/api/auth/recipetemplateLists', { pageCount: 20 });
}
