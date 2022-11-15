import { get } from './http'
export function getSubscribeDetailSave(params: any) {
  return get('/api/auth/subscribeEdit', params)
}