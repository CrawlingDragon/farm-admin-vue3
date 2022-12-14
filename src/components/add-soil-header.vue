<template>
  <div class="nav-bar border">
    <el-breadcrumb separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/vip-admin' }" v-if="from === 'vip'"
        >会员管理</el-breadcrumb-item
      >
      <el-breadcrumb-item :to="{ path: '/examine-soil' }" v-else>测土配方</el-breadcrumb-item>
      <el-breadcrumb-item>{{
        routeName === 'examine-soil-add' ? '新增测土' : '测土详情:' + cetuId
      }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
const props = defineProps({
  cetuId: {
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
