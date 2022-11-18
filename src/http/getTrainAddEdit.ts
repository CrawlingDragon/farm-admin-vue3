import { get } from './http'
export interface Params {
  token?: string; // [string]	是	登录所得秘钥
  trainId?: string,//培训ID, 为空则表示新增培训
  title: string,//培训主题
  image: string,//培训主图地址
  startTime: string,//培训开始时间 , 格式: 2022-10-22 10:20:50
  endTime: string,//培训结束时间 , 格式: 2022-10-22 10:20:50
  trainTeacher: string,//讲师姓名
  content?: string,//描述
  trainType: string,//培训方式[1:线上直播 2:线下培训]
  trainAddress: string,//直播链接 或者线下培训地址
}
export function getTrainAddEdit(params: Params) {
  return get('/api/auth/trainAddEdit', params)
}