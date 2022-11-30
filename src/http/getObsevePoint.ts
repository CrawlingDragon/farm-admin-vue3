// 观测点的一些接口
import { get, post } from './http';

interface PointList {
  token?: string;
  uid?: string; // 会员详情memberDetail接口id
  keyword: string; //关键字搜索
  startTime: any; //开始日期的开始时间,格式: 2022-10-08 10:20:30
  endTime: any; //开始日期的结束时间,格式: 2022-10-08 10:20:30
  status: number; //状态[1:观测中 2:观测完成]
  page: number; //是	页码
  pageCount: number; //每页数据量复制
}

//观测点列表
export function getObservePointList(params: PointList) {
  return get('/api/auth/observepointLists', params);
}

//观测点详情
export function getObservePointDetail(viewId: number) {
  return get('/api/auth/observepointDetail', { viewId });
}

interface AddPointParams {
  token?: string; //[string]	是	登录所得秘钥
  viewId: string; //[string]		观测点主键ID,为空则默认新增观测点
  title: string; //[string]	是	观测点名称
  zuowuId: string; //[string]	是	现种养种类
  address: string; //[string]	是	位置
  northLat: string; //[string]		北纬度
  eastLng: string; //[string]		东经度
  mushu: string; //[string]	是	数量
  unit: string;
  //[string]	是	数量单位id
  observeTime: string; //[string]	是	观测日期,格式 2022-10-22 10:20:20
  uid: string; //[string]	是	试验会员ID
  describe: string; //[string]		观测点描述
  images: string; //[string]		观测点图片地址,多个用分号 ; 拼接
  cetuNumber: string; //[string]		首次测土单号
  useDrugTime: string; //[string]	是	开始用药日期,格式 2022-10-22 10:20:20
  useDrugContent: string; //[string]	是	用药描述
  yongyaoInfoJson: any; //[json]		用药信息,数据格式: [{"drugName":"甲胺磷","drugId":"123","drugSpecIds":"21","drugQuantity":"1"},{"drugName":"甲胺磷","drugId":"123","drugSpecIds":"21","drugQuantity":"1"}]
  contrastUseDrugTime: string; //[string]		对照组开始用药日期,格式 2022-10-22 10:20:20
  contrastUseDrugContent: string;
  //[string]	是	对照组用药描述
  contrastYongyaoInfoJson: any; //[json]		对照组用药信息,数据格式: [{"drugName":"甲胺磷","drugId":"123","drugSpecIds":"21","drugQuantity":"1"},{"drugName":"甲胺磷","drugId":"123","drugSpecIds":"21","drugQuantity":"1"}]
}
//新增，编辑观测点
export function addObservePoint(params: AddPointParams) {
  return post('/api/auth/observepointAddEdit', params);
}

// 删除观测点
export function delObservePoint(pointId: string) {
  return post('/api/auth/observepointDelete', { viewId: pointId });
}

interface DayParams {
  token?: string; //[string]	是	登录所得秘钥
  viewId: string; //[string]	是	观测点数据主键id
  observetime: string; //[string]	是	观察日期,格式 2022-10-10 22:10:30复制
  images: string; //[string]	是	图片地址 , 多个分号 ; 拼接
  describe: string; //[string]	是	描述
  contrastObservetime: string; //[string]	是	对照组观察日期,格式 2022-10-10 22:10:30
  contrastImages: string; //[string]	是	对照组图片地址 , 多个分号 ; 拼接
  contrastDescribe: string; //[string]	是	对照组描述
}

//添加日常观测记录
export function addDayObservePoint(dayParams: DayParams) {
  return post('/api/auth/dailyobserveAdd', dayParams);
}

interface AddTestParams {
  token?: string; //[string]	是	登录所得秘钥
  viewId: string; //[string]	是	观测点数据主键id
  cetuNumber: string; //[string]	是	测土单号复制
  contrastCetuNumber: string; //[string]	是	对照组测土单号
}
// 添加测土记录
export function addObservePointHistory(addTestParams: AddTestParams) {
  return post('/api/auth/testingsoilLogAdd', addTestParams);
}

interface ConclusionParams {
  token?: string; //[string]	是	登录所得秘钥
  viewId: string; //[string]	是	观测点数据主键ID
  conclusionTime: string; //[string]	是	结论日期 , 格式 2022-10-10 10:20:20复制
  observeconclusion: string; //[string]	是	观测结论
  effect: string; //[string]	是	用药效果[1:没效果 2:待跟进 3:已调理]
}
// 添加结论
export function addObserveConclusion(conclusionParams: ConclusionParams) {
  return post('/api/auth/conclusionAdd', conclusionParams);
}

//删除日常观测
export function delDayObservePoint(dailyId: string) {
  return post('/api/auth/dailyobserveDel', { dailyId });
}
//删除测土记录
export function delTestObservePoint(logId: string) {
  return post('/api/auth/testingsoilLogDel', { logId });
}

//删除观测点结论
export function delConclusion(viewId:string) {
  return post('/api/auth/conclusionDel', { viewId });
}
