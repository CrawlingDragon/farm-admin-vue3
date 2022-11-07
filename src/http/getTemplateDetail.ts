import { get } from './http';

// 获取模板详情
export function getTemplateDetail({ templateId: templateId }: { templateId: number }) {
  return get('/api/auth/recipetemplateDetail', { templateId: templateId });
}
