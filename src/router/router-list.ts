export const asideRouter = [
  {
    words: '录入会员',
    label: 'addMember',
    path: '/vip-enter',
  },
  {
    words: '会员管理',
    label: 'memberLists',
    path: '/vip-admin',
  },
  {
    words: '审核会员申请',
    label: 'memberExamineLists',
    path: '/vip-apply',
  },
  {
    words: '专家管理',
    label: 'expertLists',
    path: '/vip-expert',
  },
  {
    words: '测土配方',
    label: 'testingsoilLists',
    path: '/examine-soil',
  },
  {
    words: '观测点',
    label: 'observepointLists',
    path: '/examine-point',
  },
  {
    words: '坐诊记录',
    label: 'zuozhenLists',
    path: '/examine-zuozhenlist',
  },
  {
    words: '巡诊记录',
    label: 'xunzhenLists',
    path: '/examine-xunzhenlist',
  },
  {
    words: '网诊管理',
    label: 'questionLists',
    path: '/examine-wangzhen',
  },
  {
    words: '统防统治',
    label: 'tongfangDelete',
    path: '/examine-tongfang',
  },
  {
    words: '处方模板',
    label: 'recipetemplateLists',
    path: '/examine-template',
  },
  {
    words: '作物解决方案',
    label: 'schemeLists',
    path: '/examine-scheme',
  },
  {
    words: '已卖出商品',
    label: 'soldLists',
    path: '/goods-sold',
  },
  {
    words: '销售统计',
    label: 'orderLists',
    path: '/goods-sell-info',
  },
  {
    words: '出售中的商品>',
    label: 'saleLists',
    path: '/goods-selling',
  },
  {
    words: '仓库中的商品>',
    label: 'storeLists',
    path: '/goods-unsell',
  },
  {
    words: '人才培训',
    label: 'trainLists',
    path: '/serve-people',
  },
  {
    words: '挂号管理',
    label: 'subscribeLists',
    path: '/serve-registration',
  },
  {
    words: '短信管理',
    label: 'smsLists',
    path: '/serve-note',
  },
  {
    words: '信息管理',
    label: 'newsLists',
    path: '/serve-message',
  },
];

export const indexRightBarRouter = [
  {
    words: '会员',
    label: 'user',
    path: '/vip-admin',
  },
  {
    words: '专家',
    label: 'expert',
    path: '/vip-expert',
  },
  {
    words: '测土配方',
    label: 'cetu',
    path: '/examine-soil',
  },
  {
    words: '观测点',
    label: 'viewpoint',
    path: '/examine-point',
  },
  { words: '网诊', label: 'ask', path: '/examine-wangzhen' },
  {
    words: '商品',
    label: 'product',
    path: 'http://vip.nzsoso.com/Member/Product/goodsOnSale.html',
  },
  {
    words: '销售记录',
    label: 'order',
    path: '/goods-sold',
  },
];

export function getCustomRouterLink(label: string, links: any) {
  let path = '';
  for (let i = 0; i < links.length; i++) {
    if (links[i].label === label) {
      path = links[i].path;
      continue;
    }
  }
  return path;
}
