<template>
  <div class="mb50">
    <div class="nav-bar border">
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/vip-admin' }">会员管理</el-breadcrumb-item>
        <el-breadcrumb-item>新增测土</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <router-view></router-view>
  </div>
</template>
<script lang="ts" setup>
import { onUnmounted, onMounted } from 'vue';
const emit = defineEmits(['update:hideAside']);
onMounted(async () => {
  emit('update:hideAside', false);
});
// 隐藏左边栏
onUnmounted(() => {
  emit('update:hideAside', true);
});
</script>
<style></style>
