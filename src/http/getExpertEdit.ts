import { post } from './http';

interface Params {
  token?: string;
  expertId: number;
  company: string;
  position: string; // [string]		职称
  bio: string; // [string]		简介
  zuowuStr: string; // 选择作物,逗号拼接,例:   冬枣,番茄,茶叶
}
export function getExportEdit(params: Params) {
  return post('/api/auth/expertEdit', params);
}
