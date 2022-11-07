import { get } from './http';
export interface IndexParams {
  token: string;
  //获取数据类型[newuser:新增会员 user:会员 cetu:测土配方 answer:网诊与回复 order:销售记录]
  dataType: 'newuser' | 'user' | 'cetu' | 'answer' | 'order';
  // 时间长度切换[week:近一周数据 month:近一个月数据 ]
  timeType: 'week' | 'month';
}

export interface IndexData {
  info: any;
  dataTotal: any;
  switchVal: any;
  tempArray: any;
  dataType: string; //获取数据类型[newuser:新增会员 user:会员 cetu:测土配方 answer:网诊与回复 order:销售记录]
  timeType: string; //时间长度切换[week:近一周数据 month:近一个月数据 ]
  echartData: any;
  tableData: any;
  charArrayStr: string;
  replyArrayStr: string;
}

export function getIndex(params: IndexParams) {
  return get('/api/auth/index', params);
}
