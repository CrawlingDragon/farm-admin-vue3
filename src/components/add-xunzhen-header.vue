<template>
  <div class="nav-bar border">
    <el-breadcrumb separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/vip-admin' }" v-if="from === 'vip'"
        >会员管理</el-breadcrumb-item
      >
      <el-breadcrumb-item :to="{ path: '/examine-xunzhenlist' }" v-else
        >巡诊记录</el-breadcrumb-item
      >
      <el-breadcrumb-item>{{
        routeName === 'examine-point-add' ? '新增巡诊' : '巡诊详情:' + zuoxunNumber
      }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
const props = defineProps({
  zuoxunNumber: {
    type: [String, Number],
    default: 0,
  },
});

const route = useRoute();
//如果来自会员中心，from = vip
const from = computed(() => route.query.from);
const routeName = computed(() => route.name);
</script>
<style lang="scss" scoped></style>
