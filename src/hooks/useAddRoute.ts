//检查测土，观测点，坐诊，巡诊，网诊，是否在会员页面，是否需要再路由上加上 uId
import { useRoute } from 'vue-router';
import { computed, ref } from 'vue';
// const ifNeedUidRouteQuery = computed(() => {
//   if (route.meta.pageAddress === 'vip') {
//     return { uId: uId.value };
//   } else {
//     return {};
//   }
// });
export function useIfNeedUidRouteQuery() {
  let isNeedUidQuery = ref({});
  const route = useRoute();
  const uId = computed(() => route.query.uId);
  const isVip = computed(() => route.meta.pageAddress);
  if (isVip.value === 'vip') {
    isNeedUidQuery.value = { uId: uId.value };
  } else {
    isNeedUidQuery.value = {};
  }
  return isNeedUidQuery;
}
