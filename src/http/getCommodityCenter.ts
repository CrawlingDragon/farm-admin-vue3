import { get } from './http';
interface outParams {
  token?: string; //[string]	是	登录所得秘钥
  keyword: string; //[string]		关键字搜索
  startTime: string; //[string]		开始日期的开始时间,格式: 2022-10-08
  endTime: string; //[string]		开始日期的结束时间,格式: 2022-10-12
  status: string | number;//[string] 备注筛选[0:全部 1:无备注 2:有备注]
  page: number | string; //[string]	是	页码
  pageCount: number | string; //[string]		每页数据量复制
}
//获取已卖出的商品列表
export function getOutCommodityList(listParams: outParams) {
  return get('/api/auth/orderProductLists', listParams);
}
// 导出购买数据
interface exportParams {
  token?: string; //[string]	是	登录所得秘钥
  keyword: string; //[string]		关键字搜索
  starttime: string; //[string]		开始日期的开始时间,格式: 2022-10-08
  endtime: string; //[string]		开始日期的结束时间,格式: 2022-10-12
  status: string | number;//[string] 备注筛选[0:全部 1:无备注 2:有备注]
}
export function getExportList(listParams: exportParams) {
  return get('/api/auth/importOrderLists', listParams);
}
// 订单详情
export function getorderDetail(OrderId: any) {
  return get('/api/auth/orderDetail', { orderId: OrderId });
}
// 删除订单
export function getorderDelete(OrderId: any) {
  return get('/api/auth/orderDelete', { orderId: OrderId });
}
// 修改备注
interface editParams {
  token?: string; //[string]	是	登录所得秘钥
  orderId: any;//订单ID
  remark: string;//订单备注
}
export function getOrderRemarkEdit(edit: editParams) {
  return get('/api/auth/orderRemarkEdit', edit)
}