import { post } from './http';

export interface AddSoilParams {
  token?: string; //必填	登录所得秘钥
  cetuId: string; //测土记录ID,为空则默认新增测土
  uid: string; //必填	会员id
  address: string; //必填	位置
  northLat?: string; //	北纬度
  eastLng?: string; //东经度
  zuowuId: string; //	必填	现种养种类
  beforeZuowuId?: string; //		前种养种类
  mushu: string; //必填	数量
  unit: string; //必填	数量单位id
  dixing: string; //	必填	地形[1:平原 2:盆地 3:高原 4:丘陵 5:山地 6:水塘 7:水库 8:湖泊 9:河流 10海洋]
  depth: string; //必填	采样深度(cm)
  datecollected: string; //必填	采样日期,格式 2022-10-08 11:20:00
  isFrist: string; //	必填	初复诊 [1:初诊 2:复诊]
  soildescribe?: string; //描述
  images?: string[]; //图片地址,多个用分号 ; 拼接
  expertId: string; //必填	测试专家id
  status: string; //必填	测土状态[1:检测中 2:检测完成 3:给处方]
  soilResultsJson?: any; //测土配方结果,数据格式: {"atdVal":"7","sxlVal":"55","yxjVal":"12","phVal":"7","organicVal":"55","saltVal":"12","resultVal":"结果不错"}
  chufangInfoJson?: any; //处方信息,数据格式: {"isPublic":"1","expertId":"1234","chufangResult":"这个病很好治","lastCetuNumber":"4654654"}
  yongyaoInfoJson?: any; //用药信息,数据格式: [{"drugName":"甲胺磷","drugId":"123","drugSpecIds":"21","drugQuantity":"1"},{"drugName":"甲胺磷","drugId":"123","drugSpecIds":"21","drugQuantity":"1"}]}
}
export function getAddSoil(params: AddSoilParams) {
  return post('/api/auth/testingsoilAddEdit', params);
}
