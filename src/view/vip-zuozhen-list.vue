<template>
  <div class="pb20">
    <div class="nav-bar border">
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/vip-admin' }">会员管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="`/vip-detail?id=${uId}`"
          >会员：{{ userInfo.userName }} {{ userInfo.tel }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>坐诊记录</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content border">
      <div class="left-bar">
        <VipListInfo :userInfo="userInfo" />
      </div>
      <div class="right-bar">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import VipListInfo from '@/components/vip-list-info.vue';
import { reactive, onMounted, computed, onBeforeMount, onUnmounted } from 'vue';
import { getVipDetail } from '@/http';
import { useRoute } from 'vue-router';
const route = useRoute();
const uId = computed(() => route.query.uId);
let userInfo = reactive({
  userName: '',
  tel: '',
  face: '',
  listText: '坐诊',
  listNum: '',
  // tempArray: {
  //   cetu: 0,
  //   viewpoint: 0,
  //   wenzhen: 0,
  //   xunzhen: 0,
  //   order: 0,
  //   ask: 0,
  // },
});
const emit = defineEmits(['update:hideAside']);
onMounted(async () => {
  emit('update:hideAside', false);
  let r = await getVipDetail({ id: uId.value });
  // console.log('r', r);
  let user = r.userInfo;
  userInfo.userName = user.userName;
  userInfo.tel = user.tel;
  userInfo.face = user.face;
  userInfo.listNum = r.tempArray.wenzhen;
});

onUnmounted(() => {
  emit('update:hideAside', true);
});
</script>
<style lang="scss" scoped>
.content {
  background: #fff;
  border-top: none;
  display: flex;
  .left-bar {
    width: 130px;
    border-right: 1px solid #e5e5e5;
  }
  .right-bar {
    flex: 1;
    min-width: 0;
  }
}
</style>
