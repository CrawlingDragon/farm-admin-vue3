<template>
  <div class="nav-bar border">
    <el-breadcrumb separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/vip-admin' }" v-if="from === 'vip'"
        >会员管理</el-breadcrumb-item
      >
      <el-breadcrumb-item :to="{ path: '/examine-point' }" v-else>观测点</el-breadcrumb-item>
      <el-breadcrumb-item>{{
        routeName === 'examine-point-add' ? '新增观测点' : '观测点详情:' + pointNumber
      }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
const props = defineProps({
  pointNumber: {
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
