import { get } from './http'
export function getTrainDel(params: any) {
  return get('/api/auth/trainDel', params)
}