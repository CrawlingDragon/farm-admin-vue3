//获取坐诊，巡诊的接口
import { get, post } from './http';

interface ListParams {
  token?: string; //[string]	是	登录所得秘钥
  getType: string; //[string]	是	获取类型[1:坐诊记录 2:巡诊记录]
  uid?: string; //[string]		会员详情memberDetail接口id
  keyword: string; //[string]		关键字搜索
  startTime: string; //[string]		开始日期的开始时间,格式: 2022-10-08 10:20:30
  endTime: string; //[string]		开始日期的结束时间,格式: 2022-10-08 10:20:30
  page: number; //[string]	是	页码
  pageCount?: number; //[string]		每页数据量复制
}

//获取坐诊巡诊列表
export function getZuoXunList(listParams: ListParams) {
  return get('/api/auth/zuoXunLists', listParams);
}

// 坐诊/巡诊 列表导出PDF
interface PDFParams {
  token?: string; //[string]	是	登录所得秘钥
  getType: string; //[string]	是	获取类型[1:坐诊记录 2:巡诊记录]
  uid?: string; //[string]		会员详情memberDetail接口id
  keyword: string; //[string]		关键字搜索
  startTime: string; //[string]		开始日期的开始时间,格式: 2022-10-08 10:20:30
  endTime: string; //[string]		开始日期的结束时间,格式: 2022-10-08 10:20:30复制
}
export function getExportZuoXunPDF(PDFParams: PDFParams) {
  return get('/api/auth/zuoXunExportPdf', PDFParams);
}

// 坐诊/巡诊 新增
interface AddEditParams {
  token?: string; //[string]	是	登录所得秘钥
  zxId: string; //[string]		坐诊/巡诊ID,为空则默认新增
  uid: string; //[string]	是	会员id
  zuowuId: string; //[string]	是	坐诊/巡诊作物种类ID
  mushu: string; //[string]	是	病发数量
  unit: string; //[string]	是	数量单位id
  plantType: string; //[string]	是	种养模式 [1:露地 2:大棚 3:人造水域 4:自然水域 5:野生]
  degree: string; //[string]	是	病发程度[1:零星发生 2:局部发生 3:整片发生]
  wenzhenTime: string; //[string]	是	坐诊巡诊日期,格式 2022-10-08 11:20:00
  address?: string; //[string]		巡诊地点(新增巡诊时必填)
  isFrist: string; //[string]	是	初复诊 [1:初诊 2:复诊]
  content: string; //[string]		病情描述
  images: string; //[string]		图片地址,多个用分号 ; 拼接
  expertId: string; //[string]	是	坐诊专家id
  result: string; //[string]	是	看诊结果
  cetuNumber: string; //[string]		测土记录单号
  yongyaoInfoJson: any; //[json]		用药信息,数据格式: [{"drugName":"甲胺磷","drugId":"123","drugSpecIds":"21","drugQuantity":"1"},{"drugName":"甲胺磷","drugId":"123","drugSpecIds":"21","drugQuantity":"1"}]
}
export function getAddEditZuoXun(addEditParams: AddEditParams) {
  return post('/api/auth/zuoXunAddEdit', addEditParams);
}
// 坐诊/巡诊 删除
export function getDelZuoXun(zxId: string) {
  return post('/api/auth/zuoXunZhenDelete', { zxId });
}

// 坐诊/巡诊 详情
export function getZuoXunDetail(zuoXunId: string) {
  return get('/api/auth/zuoXunZhenDetail', { zxId: zuoXunId });
}

//坐诊/巡诊 新增坐诊/巡诊跟踪记录
interface AddTrackParams {
  token?: string; //[string]	是	登录所得秘钥
  zxId: string; //[string]	是	坐诊巡诊数据主键ID
  addType: [1, 2]; //[string]	是	添加类型 [1:坐诊 2:巡诊]
  trackTime: string; //[string]	是	跟踪日期, 格式 2022-10-08 12:20:12
  effect: [1, 2, 3]; //[string]	是	诊疗效果, 1:没效果 2:待跟进 3:已调理
  content: string; //[string]		效果描述复制
}
export function getAddZuoXunTrack(addTrackParams: AddTrackParams) {
  return post('/api/auth/zuoXunTrackAdd', addTrackParams);
}

// 坐诊/巡诊 删除记录
export function getDelZuoXunTrack(trackId: string) {
  return post('/api/auth/zuoXunTrackDel', { trackId });
}
