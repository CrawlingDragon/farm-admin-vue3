import { get } from './http';

// 获取商品列表
interface listsParams {
  token?: string; //[string]	是	登录所得秘钥
  keyword?: string | number;//商品编码或商品名称
}
export function getProductLists(lists: listsParams) {
  return get('/api/auth/getProductLists', lists);
}
// 结算
interface orderParams {
  token?: string; //[string]	是	登录所得秘钥
  goodsJson: any;//结算商品,格式 : [{"specSn":"00001","buyNum":"2"}]
  uid: string | number;//结算会员ID
}
export function getCashierOrder(order: orderParams) {
  return get('/api/auth/saveCashierOrder', order);
}
