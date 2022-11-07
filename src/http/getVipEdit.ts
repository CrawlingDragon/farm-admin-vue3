import { post } from './http';
interface Params {
  token?: string;
  id: any;
  userName: string;
  resideprovince: string;
  residecity: string;
  residedist: string;
  residecommunity: string;
  address: string;
  selfcard: string;
  sex: number;
  familycount: string;
  zuowuJson: any[];
  remarks: string;
  codeVerify: number | string;
}

export function getVipEdit(params: Params) {
  return post('/api/auth/memberEdit', params);
}
