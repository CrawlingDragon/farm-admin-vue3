import { createRouter, createWebHistory, RouteRecordRaw, Router } from 'vue-router';
const routes: RouteRecordRaw[] = [
  {
    path: '/index',
    component: () => '@/components/header.vue',
  },
];

export const router: Router = createRouter({
  routes: routes,
  history: createWebHistory(),
  scrollBehavior: (to, from, position) => {
    return { top: 0, left: 0 };
  },
});
