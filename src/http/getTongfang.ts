// 统防统治的接口
import { get, post } from './http';

//获取统防统治列表
interface ListParams {
  token?: string; //[string]	是	登录所得秘钥
  keyword: string; //[string]		关键字搜索
  startTime: string; //[string]		开始日期的开始时间,格式: 2022-10-08 10:20:30
  endTime: string; //[string]		开始日期的结束时间,格式: 2022-10-08 10:20:30
  page: number; //[string]	是	页码
  pageCount: number; //[string]		每页数据量复制
}
export function getTongFangList(listParams: ListParams) {
  return get('/api/auth/tongfangLists', listParams);
}

//新增/编辑 统防统治
interface AddEditParams {
  token?: string; //[string]	是	登录所得秘钥
  tfId: string; //[string]		统防统治主键ID,为空则默认新增
  title: string; //[string]	是	名称
  zuowuId: string; //[string]	是	种类ID
  fangzhiTime: string; //[string]	是	开始防治日期,格式 2022-10-08 11:20:00
  mushu: string; //[string]	是	防治数量
  unit: string; //[string]	是	数量单位id			 //
  farmersNum: string; //[string]		农户数
  content: string; //[string]		描述
  yongyaoInfoJson: any; //[json]		用药信息,数据格式: [{"drugName":"甲胺磷","drugId":"123","drugSpecIds":"21","drugQuantity":"1"},{"drugName":"甲胺磷","drugId":"123","drugSpecIds":"21","drugQuantity":"1"}]
}
export function getAddEditTongFang(addEditParams: AddEditParams) {
  return post('/api/auth/tongfangAddEdit', addEditParams);
}

//详情 统防统治
export function getTongFangDetail(tfId: string) {
  return get('/api/auth/tongfangDetail', { tfId });
}

// 删除 统防统治
export function getDelTongFang(tfId: string) {
  return post('/api/auth/tongfangDelete', { tfId });
}
