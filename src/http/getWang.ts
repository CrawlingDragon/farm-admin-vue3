//网诊相关的api
import { get, post } from './http';

//获取网诊列表
interface WangListParams {
  token?: string; //[string]	是	登录所得秘钥
  uid?: string; //[string]		会员详情memberDetail接口id
  keyword: string; //[string]		关键字搜索			 //
  startTime: string; //[string]		开始日期的开始时间,格式: 2022-10-08 10:20:30
  endTime: string; //[string]		开始日期的结束时间,格式: 2022-10-08 10:20:30
  isReply: number; //[string]		回复状态[0:全部 1:未回复 2:已回复]
  page: number; //[string]	是	页码
  pageCount: number; //[string]		每页数据量复制
}
export function getWangList(params: WangListParams) {
  return get('/api/auth/questionLists', params);
}
//获取网诊导出PDF
interface PDFParams {
  token?: string; //[string]	是	登录所得秘钥
  uid?: string; //[string]		会员详情memberDetail接口id
  keyword: string; //[string]		关键字搜索
  startTime: string; //[string]		开始日期的开始时间,格式: 2022-10-08 10:20:30
  endTime: string; //[string]		开始日期的结束时间,格式: 2022-10-08 10:20:30复制
  isReply: number;
}
export function getWangPDF(params: PDFParams) {
  return get('/api/auth/questionExportPdf', params);
}
//回复网诊
interface AnswerParams {
  token?: string; //[string]	是	登录所得秘钥
  questionId: string; //[string]	是	问题ID
  message: string; //[string]	是	回复内容
  images: string; //[string]		图片地址 , 多个用分号; 拼接
  yongyaoInfoJson: any; //[json]		用药信息,数据格式[{"drugName":"甲胺磷","drugId":"123","drugSpecIds":"21","drugQuantity":"1"}]
}
export function getWangToAnswer(params: AnswerParams) {
  return post('/api/atuh/professorAnswer', params);
}
//邀请专家回复网诊
interface ExpertAnswerParams {
  token?: string; //[string]	是	登录所得秘钥
  questionIds: string[]; //[string]	是	问题ID,多个用逗号拼接
  expertIds: string[]; //[string]	是	专家ID,多个用逗号拼接
}
export function getWangExpertAnswer(params: ExpertAnswerParams) {
  return post('/api/auth/inviteReply', params);
}
