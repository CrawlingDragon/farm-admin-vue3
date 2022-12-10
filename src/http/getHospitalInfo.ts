//医院信息的api
import { get, post } from './http';

//获取医院信息详情
export function getHospitalDetail() {
  return get('/api/auth/businessInfo');
}

//编辑医院信息
interface HospitalParams {
  token?: string; //[string]	是	登录所得秘钥
  hospitalName: string; //[string]	是	医院名称复制
  hospitalLogo: string; //[string]	是	图标链接
  address: string; //[string]	是	详细地址
  zuowuStr: string; //[string]	是	作物种类逗号隔开,格式: 核桃,板栗,火龙果
  yyzzPic: string; //[string]		营业执照图片链接
  realname: string; //[string]	是	真实姓名
  company: string; //[string]	是	工作单位
  selfcard: string; //[string]	是	身份证
  tel: string; //[string]	是	手机号码
  introduce: string; //[string]	是	医院简介
  linkAddress: string; //[string]		通讯地址
}
export function getHospitalEdit(hospitalParams: HospitalParams) {
  return post('/api/auth/businessEdit', hospitalParams);
}
