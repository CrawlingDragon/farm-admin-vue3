//诊疗中心- 处方模板api
import { get, post } from './http';
//处方模板详情

export function getTemplateListFetch(page: number) {
  return get('/api/auth/recipetemplateLists', { page, pageCount: 10 });
}
//新增,编辑-处方模板
interface AddEditParams {
  token?: string; //[string]	是	登录所得秘钥
  templateId: string; //[string]		处方模板ID,为空则默认新增复制
  title: string; //[string]	是	处方名称
  content: string; //[string]	是	看诊结果
  yongyaoInfoJson: any; //用药信息,数据格式: [{"drugName":"甲胺磷","drugId":"123","drugSpecIds":"21","drugQuantity":"1"} {"drugName":"甲胺磷","drugId":"123","drugSpecIds":"21","drugQuantity":"1"}]
}
export function getTemplateAddEdit(addEditParams: AddEditParams) {
  return post('/api/auth/recipetemplateAddEdit', addEditParams);
}
//详情处方模板
export function getTemplateExamineDetail(templateId: number) {
  return get('/api/auth/recipetemplateDetail', { templateId });
}
//删除处方模板
export function getTemplateDel(templateId: number) {
  return post('/api/auth/recipetemplateDelete', { templateId });
}
