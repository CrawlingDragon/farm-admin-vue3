import { get } from './http'
export function getMessageDelete(params: any) {
  return get('/api/auth/delNews', params)
}