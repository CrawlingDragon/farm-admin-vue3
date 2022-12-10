export { getUserInfo } from './getUserInfo';
export { fetchGetToken } from './getToken';
export { getLeftAside } from './getLeftAside';
export { getIndex } from './getIndex';
export { getExport } from './getExport';
export { getVipAdmin } from './getVipAdmin';
export { getVipDetail } from './getVipDetail';
export { getDeleteVip } from './getDeleteVip';
export { getVipEdit } from './getVipEdit';
export { getSendPhoneCode } from './getSendPhoneCode';
export { getVipApply } from './getVipApply';
export { getVipApplyAction } from './getVipApplyAction';
export { getExpertList } from './getExpertList'; //邀请专家列表
export { getExpertDelete } from './getExpertDelete';
export { getExpertInfo } from './getExpertInfo';
export { getExportEdit } from './getExpertEdit';

// 单位和种类的select options 接口
export { getSelectInfo } from './getSelectInfo';
// 专家，会员，模板，测土记录的select options 接口
export { getTestExpert } from './getTestExpert';
//获取alioss 账号信息
export { getAliossCount } from './getAliossCount';
// ======诊疗中心======
export { getSoilList } from './getSoilList';

export { getMedicineProduct } from './getMedicineProduct';
export { getPrescribingTemplate } from './getPrescribingTemplate';
export { getTemplateDetail } from './getTemplateDetail';
export { getAddSoil } from './getAddSoil';
export { getHospitalUser } from './getHospitalUser';
export { getTestSoilDetail } from './getTestSoilDetail';
export { getDelSoil } from './getDelSoil';
export { getTrackDel, getTrackAdd } from './getTrackDel'; //测土配详情：删除诊疗记录
// -观测点-
export {
  getObservePointList,
  getObservePointDetail,
  addObservePoint,
  delObservePoint,
  addDayObservePoint,
  addObservePointHistory,
  addObserveConclusion,
  delDayObservePoint,
  delTestObservePoint,
  delConclusion,
} from './getObsevePoint';
// 坐诊巡诊
export {
  getZuoXunList,
  getExportZuoXunPDF,
  getAddEditZuoXun,
  getDelZuoXun,
  getZuoXunDetail,
  getAddZuoXunTrack,
  getDelZuoXunTrack,
} from './getZuoXun';
// 网诊
export { getWangList, getWangPDF, getWangToAnswer, getWangExpertAnswer } from './getWang';
//统防统治
export {
  getTongFangList,
  getAddEditTongFang,
  getTongFangDetail,
  getDelTongFang,
} from './getTongfang';
//处方模版
export {
  getTemplateListFetch,
  getTemplateAddEdit,
  getTemplateExamineDetail,
  getTemplateDel,
} from './getExamineTemplate';
// 特色业务
// 挂号管理
export { getSubscribeLists } from './getSubscribeLists';
export { getExpertSchedulLists } from './getExpertSchedulLists';
export { getSubscribeDetail } from './getSubscribeDetail';
export { getSubscribeDetailSave } from './getSubscribeDetailSave';
export { getExpertSchedulDel } from './getExpertSchedulDel';
export { getExpertSchedulDetail } from './getExpertSchedulDetail';
export { getAddExpert } from './getAddExpert';
// 短信管理
export { getNoteLists } from './getNoteLists';
export { getNoteSmsSendInfo } from './getNoteSmsSendInfo';
export { getNoteDelete } from './getNoteDelete';
export { getNoteSmsTemplate } from './getNoteSmsTemplate';
export { getNoteSmsSend } from './getNoteSmsSend';
// 信息管理
export { getMessageLists } from './getMessageLists';
export { getMessageDelete } from './getMessageDelete';
export { getSaveNews } from './getSaveNews';
export { getNewsInfo } from './getNewsInfo';
// 人才培训
export { getTrainLists } from './getTrainLists';
export { getTrainDel } from './getTrainDel';
export { getTrainDetail } from './getTrainDetail';
export { getTrainAddEdit } from './getTrainAddEdit';
// 商品中心
// 已卖出的商品
export {
  getOutCommodityList,
  getExportList,
  getorderDetail,
  getorderDelete,
  getOrderRemarkEdit,
} from './getCommodityCenter';

//设置
// 医院信息
export { getHospitalDetail, getHospitalEdit } from './getHospitalInfo';
//Tv广告设置
export { getTvListFetch, getTvDel, getAddEditTv, getTvDetail } from './getTv';
