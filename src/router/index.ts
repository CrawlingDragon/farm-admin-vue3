import { createRouter, createWebHistory, RouteRecordRaw, Router } from 'vue-router';
import { fetchGetToken, login } from '@/common/js/getToken';
import { getUrlQuery } from '@/common/js/util';
import storage from 'good-storage';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/index',
  },
  {
    path: '/index',
    component: () => import('@/view/index.vue'),
  },
  {
    path: '/set',
    component: () => import('@/view/set.vue'),
  },
  {
    path: '/search',
    component: () => import('@/view/search.vue'),
  },
  {
    // 收银台
    path: '/cashier-desk',
    component: () => import('@/view/cashier-desk.vue'),
  },
  {
    path: '/change-password',
    component: () => import('@/view/change-password.vue'),
  },
  // 会员中心
  {
    path: '/vip-enter', //录入会员
    component: () => import('@/view/vip-enter.vue'),
  },
  {
    path: '/vip-admin', //会员管理
    component: () => import('@/view/vip-admin.vue'),
  },
  {
    path: '/vip-detail', //会员详情
    component: () => import('@/view/vip-detail.vue'),
  },
  {
    path: '/vip-edit', //会员编辑
    component: () => import('@/view/vip-edit.vue'),
  },
  {
    path: '/vip-apply', // 审核会员申请
    component: () => import('@/view/vip-apply.vue'),
  },
  {
    path: '/vip-expert', // 专家管理
    component: () => import('@/view/vip-expert.vue'),
  },
  {
    path: '/vip-expert-edit/:expertId', // 会员-专家编辑
    component: () => import('@/view/vip-expert-edit.vue'),
  },
  //诊疗中心
  {
    path: '/examine-soil', //测土配方
    component: () => import('@/view/examine-soil.vue'),
  },
  {
    path: '/examine-soil-add', //新增测土
    name: 'examine-soil-add',
    component: () => import('@/view/examine-soil-add.vue'),
  },
  {
    path: '/examine-soil-detail/:cetuId', //测土配方详情
    component: () => import('@/view/examine-soil-detail.vue'),
  },

  {
    path: '/examine-soil-edit/:cetuId', //编辑测土
    component: () => import('@/view/examine-soil-add.vue'),
  },
  {
    path: '/examine-point', //观测点
    component: () => import('@/view/examine-point.vue'),
  },
  {
    path: '/examine-point-add', //新增观测点
    component: () => import('@/view/examine-point-add.vue'),
  },
  {
    path: '/examine-zuozhenlist', //坐诊记录
    component: () => import('@/view/examine-zuozhenlist.vue'),
  },
  {
    path: '/examine-zuozhen-add', // 新增坐诊
    component: () => import('@/view/examine-zuozhen-add.vue'),
  },
  {
    path: '/examine-xunzhenlist', //巡诊记录
    component: () => import('@/view/examine-xunzhenlist.vue'),
  },
  {
    path: '/examine-xunzhen-add', // 新增巡诊
    component: () => import('@/view/examine-xunzhen-add.vue'),
  },
  {
    path: '/examine-wangzhen', //网诊管理
    component: () => import('@/view/examine-wangzhen.vue'),
  },
  {
    path: '/examine-tongfang', //统防统治
    component: () => import('@/view/examine-tongfang.vue'),
  },
  {
    path: '/examine-template', //处方模板
    component: () => import('@/view/examine-template.vue'),
  },
  {
    path: '/examine-scheme', //作物解决方案
    component: () => import('@/view/examine-template.vue'),
  },

  //商品中心
  {
    path: '/goods-sold', //已卖出商品
    component: () => import('@/view/goods-sold.vue'),
  },
  {
    path: '/goods-sell-info', //销售统计
    component: () => import('@/view/goods-sell-info.vue'),
  },
  {
    path: '/goods-selling', //出售中的商品
    component: () => import('@/view/goods-selling.vue'),
  },
  {
    path: '/goods-unsell', //仓库中的商品
    component: () => import('@/view/goods-unsell.vue'),
  },
  //特色业务
  {
    path: '/serve-people', //人才培训
    component: () => import('@/view/serve-people.vue'),
  },
  {
    path: '/serve-registration', //挂号管理
    component: () => import('@/view/serve-registration.vue'),
  },
  {
    path: '/serve-registration-add', //新增专家排班
    component: () => import('@/view/serve-registration-add.vue'),
  },
  {
    path: '/serve-registration-detail', //挂号单详情
    component: () => import('@/view/serve-registration-detail.vue'),
  },
  {
    path: '/serve-note', //短信管理
    component: () => import('@/view/serve-note.vue'),
  },
  {
    path: '/serve-note-detail', //发短信
    component: () => import('@/view/serve-note-detail.vue'),
  },
  {
    path: '/serve-note-show', //短信详情
    component: () => import('@/view/serve-note-show.vue'),
  },
  {
    path: '/serve-message', //信息管理
    component: () => import('@/view/serve-message.vue'),
  },
  //医院设置
  {
    path: '/hospital-info', // 医院信息
    component: () => import('@/view/hospital-info.vue'),
  },
  {
    path: '/hospital-TV', //TV广告图设置
    component: () => import('@/view/hospital-TV.vue'),
  },
  {
    path: '/hospital-APP', //APP模块设置
    component: () => import('@/view/hospital-APP.vue'),
  },
  {
    path: '/hospital-PC', //PC端模块设置
    component: () => import('@/view/hospital-PC.vue'),
  },
  {
    path: '/hospital-live', //直播节目单
    component: () => import('@/view/hospital-live.vue'),
  },
  // 服务
  {
    path: '/service-user', //用户反馈
    component: () => import('@/view/service-user.vue'),
  },
  {
    path: '/service-QQ', //QQ在线客服
    component: () => import('@/view/service-QQ.vue'),
  },
];

export const router: Router = createRouter({
  routes: routes,
  history: createWebHistory(),
  scrollBehavior: (to, from, position) => {
    return { top: 0, left: 0 };
  },
});

router.beforeEach(async (to, from) => {
  let token = storage.get('token');
  const urlParamsCode = getUrlQuery('code'); // 获取浏览器code 参数
  //如果路由跳转是相同的，就取消
  if (to.path === from.path) return;

  if (urlParamsCode && token == '') {
    // 去请求token
    let r = await fetchGetToken(urlParamsCode);
  } else if (token == '') {
    const url = encodeURIComponent(window.location.origin + decodeURIComponent(to.fullPath));
    let redirect_uri = storage.get('redirect_uri', url);
    // 跳转到用户中心
    login('password', redirect_uri);
  }
});
